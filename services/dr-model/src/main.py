"""
nazar-dr-model — diabetic retinopathy classifier microservice.

Wraps a public HuggingFace ViT (rafalosa/diabetic-retinopathy-224-procnorm-vit)
behind a single POST /predict endpoint. Designed to be called from nazar-scan
inside the cluster — no auth on this service (NetworkPolicy restricts callers).
"""

import io
import os
import time
from contextlib import asynccontextmanager

import numpy as np
import torch
from fastapi import FastAPI, UploadFile, File, HTTPException
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification

MODEL_ID = os.getenv("MODEL_ID", "rafalosa/diabetic-retinopathy-224-procnorm-vit")
# P(any DR) above this → flag as DR. Tuned to push sensitivity ≥95% per Phase 0
# eval (specificity drops from 98% to ~92%, acceptable for screening).
DR_THRESHOLD = float(os.getenv("DR_THRESHOLD", "0.30"))

# Model's id2label is NOT APTOS-standard order. Hardcode the remap so the API
# always speaks APTOS semantics (0=No DR, 1=Mild, 2=Moderate, 3=Severe, 4=Proliferative).
MODEL_TO_APTOS = {0: 1, 1: 2, 2: 0, 3: 4, 4: 3}
APTOS_NAMES = ["No DR", "Mild NPDR", "Moderate NPDR", "Severe NPDR", "Proliferative DR"]
APTOS_RISK = ["low", "moderate", "moderate", "high", "high"]

state = {"processor": None, "model": None}


@asynccontextmanager
async def lifespan(app: FastAPI):
    state["processor"] = AutoImageProcessor.from_pretrained(MODEL_ID)
    state["model"] = AutoModelForImageClassification.from_pretrained(MODEL_ID)
    state["model"].eval()
    torch.set_num_threads(int(os.getenv("TORCH_NUM_THREADS", "4")))
    yield


app = FastAPI(lifespan=lifespan, title="nazar-dr-model")


@app.get("/health")
async def health():
    return {"ok": True, "model": MODEL_ID, "threshold": DR_THRESHOLD}


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    if not (image.content_type or "").startswith("image/"):
        raise HTTPException(400, "expected image/* content type")
    raw = await image.read()
    if not raw:
        raise HTTPException(400, "empty image body")
    try:
        img = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception:
        raise HTTPException(400, "could not decode image")

    t0 = time.perf_counter()
    inputs = state["processor"](images=img, return_tensors="pt")
    with torch.no_grad():
        logits = state["model"](**inputs).logits
    probs = torch.softmax(logits[0], dim=-1).numpy()
    elapsed_ms = (time.perf_counter() - t0) * 1000

    aptos_probs = np.zeros(5, dtype=np.float64)
    for midx, aidx in MODEL_TO_APTOS.items():
        aptos_probs[aidx] = float(probs[midx])

    p_any_dr = float(1.0 - aptos_probs[0])
    has_dr = p_any_dr > DR_THRESHOLD

    top1 = int(np.argmax(aptos_probs))
    confidence = float(aptos_probs[top1])

    return {
        "has_dr": has_dr,
        "p_any_dr": p_any_dr,
        "threshold": DR_THRESHOLD,
        "classification": APTOS_NAMES[top1],
        "classification_idx": top1,
        "risk_level": APTOS_RISK[top1] if has_dr else "low",
        "confidence": confidence,
        "probs": {APTOS_NAMES[i]: float(aptos_probs[i]) for i in range(5)},
        "model": MODEL_ID,
        "inference_ms": elapsed_ms,
    }

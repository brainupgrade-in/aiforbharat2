FROM python:3.11-slim

WORKDIR /app
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    HF_HOME=/app/.cache/huggingface

# CPU-only torch from PyTorch's index — much smaller than default GPU build.
RUN pip install --index-url https://download.pytorch.org/whl/cpu torch==2.5.1

COPY requirements.txt .
RUN pip install -r requirements.txt

# Pre-download model weights into the image so cold-start doesn't hit HF every time.
RUN python -c "from transformers import AutoImageProcessor, AutoModelForImageClassification; \
    AutoImageProcessor.from_pretrained('rafalosa/diabetic-retinopathy-224-procnorm-vit'); \
    AutoModelForImageClassification.from_pretrained('rafalosa/diabetic-retinopathy-224-procnorm-vit')"

COPY src ./src

EXPOSE 8080
USER nobody
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1"]

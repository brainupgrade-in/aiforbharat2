# Nazar AI (DiabetCare AI)

AI-powered diabetic retinopathy screening and diabetes management for India's 89.8 million diabetics. Mobile-first PWA, multilingual (EN/HI/KN), and now self-hosted on a single home k3s cluster after migrating off AWS.

**Live:** [https://nazarai.gheware-ai.com/](https://nazarai.gheware-ai.com/)
**GitHub:** [https://github.com/brainupgrade-in/aiforbharat2](https://github.com/brainupgrade-in/aiforbharat2)
**Demo Video:** [https://youtube.com/shorts/Xhfi6niUU90](https://youtube.com/shorts/Xhfi6niUU90) (53s YouTube Short, vertical)

**Team:** TheHealthGheware · **Lead:** Rajesh Gheware (25+ yrs at JPMorgan Chase, Deutsche Bank, Morgan Stanley)
**Hackathon:** AWS AI for Bharat (entered Round 2; concluded)

**Hindi tagline:** "आँखों से प्यार झलकना चाहिए, बीमारी नहीं"

---

## Status

- ✅ React 18 PWA, Apollo + custom magic-link OTP auth (with resend cooldown + server-side rate limit)
- ✅ First-login profile onboarding (name, age, diabetes type) gates the app; in-app edit affordance for later changes
- ✅ Multilingual UI **and** auth screen (EN/HI/KN) — preference saved to user_profile and follows the user across devices
- ✅ Hasura GraphQL on CloudNativePG Postgres with row-level security via JWT claims; Apollo `errorLink` auto-bounces back to sign-in when JWT expires
- ✅ Diabetes-advisor chatbot via `ollama_cloud` (`kimi-k2.6:cloud` for EN, `gpt-oss:120b` for HI/KN, full-chain fallback on non-2xx **or** empty content); chat history persists per session
- ✅ Real DR screening pipeline: ViT-base classifier (`rafalosa/diabetic-retinopathy-224-procnorm-vit`) running CPU-only on the cluster, ~220 ms / image, threshold-tuned for ≥95% sensitivity at the cost of some specificity. Client-side image-quality gate (dimension + Laplacian-blur) before upload; XHR upload progress bar for slow connections. Camera defaults to **front** (patient self-scan) with an in-frame flip button to back (ASHA-worker / clinic with fundus lens).
- ✅ Glucose tracker with cloud sync — log, edit, delete; trend chart with status thresholds
- ✅ Scan history tab — full list of past scans, tap any row to re-open the result page (no re-inference)
- ✅ Auth security: 6-digit OTP `bcrypt(otp + OTP_PEPPER)` hashed, 10-min TTL, single-use; rate limit (1/30s, max 5/hour per email)
- ✅ Cloudflare Tunnel public exposure (no exposed home IP), Let's Encrypt TLS via cert-manager
- ✅ E2E test suite: **20/20 passing** (auth → Hasura RLS → DR pipeline → ollama_cloud → site)
- ✅ AWS account fully torn down (no recurring spend)
- 🔄 Meal-photo analyzer — pending. Will need a shared object-storage tier (MinIO) when shipped.

---

## Problem Analysis

### India's Diabetes Crisis

**Massive Disease Burden** ([IDF Atlas 11th Edition, 2025](https://diabetesatlas.org/), [SMART India / Lancet 2022](https://www.thelancet.com/journals/langlo/article/PIIS2214-109X(22)00411-9/fulltext)):
- 89.8 M diabetics — world's 2nd-largest population, projected 156.7 M by 2050
- 16.9% diabetic-retinopathy prevalence; ~3 M with vision-threatening DR
- 43% of diabetics undiagnosed; many first detected only when complications are present
- ₹2-3 lakh crore annual economic impact (40-50% develop complications)

**Severe Manpower Crisis:**
- ~1,400 retina specialists for 89.8 M diabetics at risk of blindness ([AIIMS survey](https://www.outlookindia.com/healthcare-spotlight/aiims-survey-flags-alarming-shortage-of-eye-specialists-puts-indias-vision-goals-in-focus))
- 80% of doctors in urban areas serving 35% of the population
- 80% deficit of specialists in rural Community Health Centers

**Access & Cost Barriers:**
- ₹3,000-5,000 per specialist consultation; ₹500-1,500 per fundus photograph
- 38% of diabetic households face catastrophic health expenditure
- Type-1 families spend ~41% of total income on diabetes care
- Only 45% of rural individuals have access to adequate diabetes care vs 68% urban

**Market:** 89.8 M diabetics + 136 M pre-diabetics = 225 M total addressable market. India has 659+ M smartphone users — the bridge exists.

---

## Solution Overview

A mobile PWA that gives the patient:

- **AI Diabetic Retinopathy Screening** — upload a fundus image; binary "any DR vs no DR" decision plus 5-class staging
- **Smart Glucose Tracker** — manual logging, trend chart, status badges, cloud sync
- **AI Meal Analyzer** *(pending)* — Indian-food-aware carb estimation
- **Diabetes Advisor Chatbot** — 24/7 conversational guidance, India-specific context (foods, prices in INR, government schemes), multilingual
- **Multilingual UX** — English, Hindi, Kannada (extensible)
- **High-contrast mode** for low-vision users
- **GPS-based nearby ophthalmologist finder** with WhatsApp-shareable scan summary

### What's different

- Smartphone-camera-based DR screening — ₹0-100 per scan vs ₹500-1,500 traditional fundus photography
- First diabetes app whose entire AI stack runs in our infra (no per-token AWS Bedrock bill on the critical path)
- Self-hosted on a single small server, not a cloud account — cost predictable, data flow auditable
- ABDM-ready for future government integration

---

## Architecture (current — on-prem)

```
                         ┌────────────────────────────────────┐
        Patient ────────▶│  Cloudflare Tunnel (TLS at edge)   │
        (browser/PWA)    └─────────────┬──────────────────────┘
                                       │ HTTP
                                       ▼
                         ┌────────────────────────────────────┐
                         │  Traefik Ingress (k3s built-in)    │
                         │  path-based routing + cert-manager │
                         └────┬─────┬────────┬──────────┬─────┘
                              │     │        │          │
              /  ┌────────────┘     │        │          │
                 ▼                  ▼        ▼          ▼
           ┌──────────┐  /auth/* /api/chat /api/scan /api/graphql
           │nazar-web │      │       │        │          │
           │ (nginx)  │      ▼       ▼        ▼          ▼
           └──────────┘  ┌────┐  ┌──────┐  ┌────┐   ┌───────┐
                         │auth│  │chat- │  │scan│   │hasura │
                         │    │  │ bot  │  │    │   │       │
                         └─┬──┘  └──┬───┘  └─┬──┘   └───┬───┘
                           │        │        │          │
                           │        ▼        ▼          ▼
                           │   ollama_cloud  │     ┌──────────┐
                           │   (kimi/gpt-oss)│     │ Postgres │
                           ▼                 │     │ (CNPG)   │
                      ┌─────────┐            ▼     └──────────┘
                      │Postgres │       ┌──────────┐
                      │(via JWT)│       │ dr-model │
                      └─────────┘       │ (ViT)    │
                                        └──────────┘
                                              ▲
                                              │
                                        Longhorn PVC
                                        (/data, 20Gi,
                                         scan images)
```

All seven services run in the `nazarai` namespace on a single k3s cluster (`k3s-agentgrow`) on a NUC. Hasura enforces row-level security keyed on the `x-hasura-user-id` claim from JWTs minted by `nazar-auth`.

### Tech stack (in production)

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS + Apollo Client (PWA via vite-plugin-pwa) |
| Auth | Custom Fastify magic-link OTP (10-min TTL, bcrypt-hashed) → HS256 JWT (7-day TTL) |
| Data API | Hasura v2.42 in JWT mode |
| Database | Postgres 16 via CloudNativePG operator, Longhorn PVC |
| Chat AI | `ollama_cloud` — `kimi-k2.6:cloud` (EN), `gpt-oss:120b` (HI/KN, fallback) |
| DR classifier | PyTorch CPU + ViT-base (`rafalosa/diabetic-retinopathy-224-procnorm-vit`) |
| Storage | Longhorn block (20 Gi PVC for scan images, 5 Gi for Postgres) |
| Ingress / TLS | Traefik (built-in k3s) + cert-manager (Let's Encrypt) |
| Public exposure | Cloudflare Tunnel — token-based, no port-forward, hides home IP |
| Container registry | self-hosted, mirrored at `registry.gheware-ai.com` |

See `CLAUDE.md` for the full developer guide (commands, conventions, gotchas).

---

## Repository Layout

```
ai-for-bharat-2/
├── src/                                 React MVP (Vite)
│   ├── pages/Nazar*.jsx                 Home, Scan, Result, Chat, Glucose, History
│   ├── components/                      OtpLoginForm, NazarAuthScreen, ProfileForm, LotusSeverity, NearbyDoctors, ...
│   └── lib/                             auth.jsx, apollo.js (with errorLink), queries.js, imageQuality.js, i18n.js
├── services/                            Containerized backend services
│   ├── auth/                            nazar-auth (Fastify, magic-link OTP)
│   ├── chatbot/                         nazar-chatbot (Fastify → ollama_cloud)
│   ├── scan/                            nazar-scan (Fastify multipart, owns scan PVC)
│   ├── dr-model/                        nazar-dr-model (FastAPI + PyTorch ViT)
│   └── web/                             nazar-web (nginx serving Vite dist/)
├── k8s/                                 Kubernetes manifests
│   ├── 00-namespace.yaml                ... 08-scan.yaml
│   ├── hasura-perms.json                Bulk metadata API for user-role RLS
│   └── sql/01-schema.sql                Postgres DDL (7 tables)
├── tests/
│   ├── e2e.test.js                      20 Vitest tests (auth → Hasura → AI → site)
│   └── fixtures/test-fundus.png         224×224 synthetic gradient for scan tests
├── docs/                                Original HTML/CSS wireframes
├── research/                            Diabetes / NCD research notes
├── CLAUDE.md                            Developer guide (load-bearing — read first)
├── PROJECT_SUMMARY.md, IDEA_SUBMISSION.md, ...   Hackathon-submission artifacts
└── *.svg / *.png                        Architecture & cost diagrams
```

---

## Testing

```bash
HASURA_ADMIN_SECRET=<...> OTP_PEPPER=<...> npm test
```

Both env vars must match the values in the cluster's `hasura-env` and `nazar-auth-env` k8s Secrets respectively — `OTP_PEPPER` is needed because the test injects OTPs directly into `login_otp` using the same `bcrypt(otp + OTP_PEPPER)` the auth service uses.

**20 tests** cover:
1. Public site health (3) — `/`, `/auth/health`, `/api/chat/health`
2. Magic-link auth (4) — JWT issuance, `/auth/me`, bad OTP, missing token
3. Hasura GraphQL with RLS (4) — auto-set `user_id` on insert, list-own-rows-only, admin-only `login_otp` blocked, profile CRUD
4. Retina scan pipeline (6) — health, 401 without JWT, full upload→classify→persist, image roundtrip, cross-user 404, RLS check
5. Chatbot (3) — 401 without JWT, English response, 400 on empty message

Suite runs against the live URL by default. Set `TEST_PUBLIC_URL=...` to point elsewhere.

---

## Business Model & Sustainability

**Freemium (Primary):**
- Free tier: glucose tracker, AI chatbot, basic DR screening (1 scan / month)
- Premium ₹99/month or ₹999/year: unlimited DR scans, advanced meal analysis, ad-free, priority support

**B2G:** integration with NPCDCS screening programs, ASHA-worker dashboards (₹50-100 per DR screening).

**B2B:** corporate-wellness diabetes screening (₹200-500/employee/year).

**Insurance partnerships:** outcome-based shared-savings model with diabetes-policy issuers.

**Cost structure** is much friendlier post-migration:
- Compute: 1 NUC running k3s (sunk cost; marginal monthly cost ≈ electricity)
- Cloudflare Tunnel: free tier
- ollama_cloud chat: pay-per-token via existing `OLLAMA_API_KEY`
- DR inference: zero marginal cost (in-cluster CPU)

The original AWS-based projection (~₹3 lakh/month at 100K users) was retired along with the AWS account.

---

## Competitive Landscape

| Product | Strengths | Limitations |
|---|---|---|
| **BeatO** | Smart glucometers, CGM ecosystem | No DR screening; expensive CGM |
| **Fitterfly** | Clinical results (1.96% HbA1c reduction) | ₹15K-30K per program; no DR screening |
| **Sugar.fit** | CGM + nutrition coaching | Premium pricing; limited rural reach |
| **Remidio** | AI DR screening (CDSCO approved) | Requires fundus camera (₹2.75-4.5 lakh) |
| **Nazar AI** | Smartphone-camera DR + glucose + chatbot, multilingual, offline-first PWA, ₹999/yr | Smartphone fundus capture needs lens adapter for clinical-grade results |

---

## Clinical Validation Plan

### DR Screening
- Prospective study, ~1,000 diabetic patients (age 30-70, ≥5 years duration)
- Gold standard: ophthalmologist fundus examination + ETDRS grading
- Primary outcomes: sensitivity for referable DR, specificity for ruling it out
- Targets: sensitivity ≥92%, specificity ≥88%, AUC-ROC ≥0.95
- IEC approval required before patient enrollment

**Phase 0 (already done) result on APTOS public test split (400 samples):**
- Top-2 accuracy 81%, sensitivity 89.5% at argmax
- At threshold P(any-DR) > 0.30 (production setting): sensitivity ~95%, specificity ~92%
- The model never predicts Mild / Severe / Proliferative directly — it functions as a "No DR vs Moderate-or-worse" classifier with the binary threshold doing the screening work. That's fine for a screening tool; staging accuracy is not the goal.

### Glucose Prediction
- Observational cohort, 200 Type-2 diabetics over 90 days
- Outcome: HbA1c reduction ≥0.5% (clinically significant)

---

## Risk Analysis & Mitigation

| Risk | Mitigation |
|---|---|
| Smartphone fundus capture quality varies | Position as advisory screening, not diagnostic; recommend professional follow-up; image-quality gate before inference |
| Public DR model trained on professional cameras → degradation on phone images | Phase 0 already passed binary threshold; if real-world phone images underperform, escalate to RETFound foundation model + APTOS fine-tune |
| Hosted ollama_cloud models can be silently retired (e.g. `kimi-k2:1t` retired 2026-04-14) | Two-model fallback chain in chatbot; verify model availability before pinning new IDs |
| Single-NUC SPOF | Postgres backups via WAL archiving (TODO: external disk via restic / velero); cluster restore from manifests in `k8s/` |
| SaMD classification under Medical Devices Rules 2017 | Position as wellness/screening tool; explicit "not a diagnosis" disclaimer; CDSCO consultation before any diagnostic claim |
| Data privacy under DPDP Act 2023 | Minimal collection, encrypted at rest (Longhorn) and in transit (TLS 1.3), user can delete all data via cascade on `app_user` |

---

## References

- IDF Diabetes Atlas 11th Edition (2025)
- Lancet Global Health 2022 — SMART India study
- AIDRSS clinical trial: 92% sensitivity, 88% specificity for DR detection
- MadhuNetrAI: 93.2% sensitivity, 95.3% specificity (PMC11923701)
- Digital Personal Data Protection Act 2023 (India)
- Medical Devices Rules 2017 (CDSCO)
- Ayushman Bharat Digital Mission (ABDM)

---

## Quick Links

- **Live:** [https://nazarai.gheware-ai.com/](https://nazarai.gheware-ai.com/)
- **Demo video (YouTube Short):** [https://youtube.com/shorts/Xhfi6niUU90](https://youtube.com/shorts/Xhfi6niUU90)
- **Developer guide:** `CLAUDE.md`
- **Diabetes scope rationale:** `DIABETES_FOCUS.md`
- **Hackathon submission record:** `IDEA_SUBMISSION.md`, `PROJECT_SUMMARY.md`, `*.pptx`
- **Research notes:** `research/`
- **Original wireframes:** `docs/`

---

**Last Updated:** 2026-05-01
**Repository:** https://github.com/brainupgrade-in/aiforbharat2

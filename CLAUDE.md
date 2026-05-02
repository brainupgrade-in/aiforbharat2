# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a hackathon submission repository for the **AWS AI for Bharat Hackathon**, focused on developing AI solutions that improve efficiency, understanding, or support within healthcare and life sciences ecosystems in India.

**Project Goal:** Design and implement mobile-first AI healthcare solutions to address India's critical healthcare challenges, particularly high GDP burden diseases and severe healthcare workforce shortages.

**Target Audience:** 1.4 billion Indian population with focus on:
- Rural healthcare access (65% population)
- Resource-constrained healthcare settings
- Underserved populations with limited specialist access
- Mobile-first digital health adoption

## Problem Statement

Design an AI solution that improves efficiency, understanding, or support within healthcare or life-sciences ecosystems, specifically addressing:

1. **High GDP Burden**: ₹15-20 lakh crore annual healthcare costs (12-15% of India's GDP)
2. **Manpower Crisis**: 20+ lakh healthcare professional shortage across all categories
3. **Access Inequality**: 80% doctors in urban areas serving only 35% population
4. **Late Detection**: 43% of Indian diabetics undiagnosed (IDF Atlas 11th Edition, 2025); many diagnosed only when complications are present
5. **Treatment Gap**: 83% mental health treatment gap, 60% TB detection gap

## Project Status

- **Hackathon entry** submitted to AWS AI for Bharat (round 2) ✅
- **Wireframes** in `docs/` folder ✅
- **Architecture diagrams** (logical, technical, use-case, cost, funding) ✅
- **App name:** Nazar AI (DiabetCare AI as secondary)
- **Migrated to on-prem** (April 2026) ✅ — entire AWS stack deleted; live on home k3s cluster
  - Live at: **https://nazarai.gheware-ai.com/**
  - GitHub: https://github.com/brainupgrade-in/aiforbharat2
  - Cluster: `k3s-agentgrow` on `nuc` (SSH: `ssh rajesh@nuc`)
  - Namespace: `nazarai`
  - Public exposure: Cloudflare Tunnel → Traefik → in-cluster services
- **Features implemented:**
  - DR screening (real ML, threshold-tuned for sensitivity)
  - Magic-link OTP auth with resend cooldown + server-side rate limit
  - First-login profile onboarding (name + age + diabetes type) + later-edit modal in app header
  - Multilingual UI + auth (EN/HI/KN), language preference persisted to `user_profile.language` and localStorage
  - Glucose tracker — log, edit, delete, trend chart, status badges
  - AI chatbot with persistent history (per-session, RLS-protected)
  - Scan history tab — list + tap-to-reopen results from any past scan
  - Real upload progress UI for slow connections; client-side image quality (dimension + Laplacian-blur) gate before upload
  - Camera defaults to front (`facingMode: 'user'`) for self-screening; in-frame flip button switches to back for ASHA-worker / clinic use with a fundus lens adapter
  - WhatsApp result sharing uses the live URL (`https://nazarai.gheware-ai.com`) — no stale Amplify links
  - Apollo `errorLink` → expired-JWT detection → graceful sign-out
  - GPS doctor finder, WhatsApp result sharing, high-contrast mode, PWA install
- **AI Chatbot:** ollama_cloud foundation models via Lambda-style microservice ✅
  - Models: `kimi-k2.6:cloud` primary for EN, `gpt-oss:120b` primary for HI/KN, full chain fallback
  - Endpoint: `POST /api/chat` (JWT-required, same-origin)
- **Auth:** custom magic-link OTP service (`nazar-auth`) issuing HS256 JWTs accepted by Hasura for row-level security
- **Data:** Hasura GraphQL → CloudNativePG Postgres (7 tables, RLS via JWT claim `x-hasura-user-id`)
- **DR screening pipeline:** real ML, end-to-end ✅
  - Model: `rafalosa/diabetic-retinopathy-224-procnorm-vit` (ViT-base, public HF checkpoint)
  - Phase 0 eval on APTOS test split: 81% top-2 accuracy, 89.5% sensitivity for any-DR vs no-DR (sensitivity-tuned threshold P(any DR) > 0.30 in production pushes this to ~95%)
  - Inference latency: ~220 ms / image on NUC CPU (no GPU needed)
  - Service: `nazar-dr-model` (FastAPI + PyTorch CPU) + `nazar-scan` (Fastify, multipart upload, owns 20 Gi PVC for image storage, persists via Hasura with user JWT)
  - Frontend `NazarScan` does real upload to `/api/scan`; `NazarResult` shows real class probabilities + server recommendations. **DEMO MODE flag retired.**
- **E2E Integration Tests** — 20/20 passing (Vitest) ✅
  - Magic-link auth, Hasura GraphQL CRUD with RLS (incl. admin-only `login_otp`), ollama_cloud chatbot, full retina-scan pipeline (upload → classify → persist → image roundtrip → cross-user 404), live site health check
- **Intro/Demo Video** — Live on YouTube ✅
  - How-To Short (53s, 1080×1920): https://youtube.com/shorts/Xhfi6niUU90 — **the only video to share in outreach**
  - An older long-form 2:45 walkthrough (`youtu.be/G620A-YF_bY`) exists but is now considered outdated — do not link in new emails or docs.
  - Built with Remotion 4.0 (custom comps in `video/`) + edge-tts voiceover. The Short uses `en-IN-NeerjaExpressiveNeural` (female Indian English) at +10% rate over an `upbeat.mp3` bg loop, with fresh app screenshots captured via `scripts/capture-app-screenshots.js` (Puppeteer + seeded test user). Published to the **Health Gheware** YouTube channel via Alex agent's OAuth credentials in the `youtube-credentials` Secret in the `alex-gheware` namespace on the NUC.
- **Next phase:** meal-photo analyzer (will need shared object storage tier — MinIO when a second service needs the images), validation against real Indian fundus captures, model upgrade to RETFound if smartphone-image accuracy is insufficient

## Repository Structure

```
ai-for-bharat-2/
├── README.md                           # Comprehensive problem analysis and solution roadmap
├── CLAUDE.md                          # This file - guidance for Claude Code
├── PROJECT_SUMMARY.md                 # Hackathon submission summary
├── DIABETES_FOCUS.md                  # Diabetes-only scope documentation
├── IDEA_SUBMISSION.md                 # Hackathon idea submission content
├── FUNDING_VALIDATION.md              # Funding validation analysis
├── FUNDING_SLIDE_UPDATES.md           # Funding slide update notes
├── MVP_BUDGET_FINAL.md                # Final MVP budget breakdown
├── PROTOTYPE_COST_BREAKDOWN.md        # Detailed prototype cost analysis
├── PROTOTYPE_COST_13DAYS.md           # 13-day prototype cost plan
├── SCREENSHOTS.md                     # Screenshot documentation
├── template.md                        # Quick reference card
│
├── src/                               # React MVP source code
│   ├── main.jsx                      # Entry point (ApolloProvider + AuthProvider + BrowserRouter)
│   ├── App.jsx                       # Auth gate + routing (uses useAuth, no Amplify)
│   ├── index.css                     # TailwindCSS + Nazar design system
│   ├── pages/                        # NazarApp shell + Home/Scan/Result/Chat/Glucose/History tabs (Community removed)
│   ├── components/                   # NazarAuthScreen, OtpLoginForm, ProfileForm, LotusSeverity, IrisLoader, NearbyDoctors, MarigoldCelebration
│   └── lib/
│       ├── auth.jsx                 # AuthProvider, useAuth hook, JWT/token storage, listens for nazarai:session-expired
│       ├── apollo.js                # Apollo Client → /api/graphql; errorLink dispatches session-expired on 401/invalid-jwt
│       ├── queries.js               # GraphQL queries/mutations (Hasura schema) — incl. UPSERT_PROFILE, *_GLUCOSE_READING, LIST_RETINA_SCANS
│       ├── imageQuality.js          # Laplacian-variance blur check + dimension gate for fundus uploads
│       ├── i18n.js                  # Translations (EN, HI, KN)
│       └── location.js              # Geolocation + maps utilities
│
├── services/                          # Containerized backend services (all in nazarai NS)
│   ├── auth/                         # nazar-auth: Fastify, magic-link OTP, HS256 JWT
│   ├── chatbot/                      # nazar-chatbot: Fastify, ollama_cloud client, lang-routed
│   ├── scan/                         # nazar-scan: Fastify, multipart upload, owns 20Gi PVC, calls dr-model + persists to Hasura
│   ├── dr-model/                     # nazar-dr-model: FastAPI + PyTorch (ViT), 5-class DR classifier
│   └── web/                          # nazar-web: nginx serving Vite dist with SPA fallback
│
├── k8s/                               # Kubernetes manifests (applied to k3s-agentgrow)
│   ├── 00-namespace.yaml
│   ├── 01-postgres.yaml             # CNPG Cluster (1 instance, Longhorn 5Gi)
│   ├── 02-hasura.yaml               # Hasura v2 + JWT-mode auth + admin secret
│   ├── 03-auth.yaml                 # nazar-auth Deployment + Service
│   ├── 04-chatbot.yaml              # nazar-chatbot Deployment + Service
│   ├── 05-web.yaml                  # nazar-web Deployment + Service
│   ├── 06-ingress.yaml              # Traefik Ingress + Middleware (path rewrite for Hasura)
│   ├── 07-dr-model.yaml             # nazar-dr-model Deployment + Service (CPU-only, 1-2 Gi RAM)
│   ├── 08-scan.yaml                 # nazar-scan Deployment + Service + PVC (20Gi Longhorn)
│   ├── hasura-perms.json            # Bulk metadata API payload — user-role RLS perms
│   └── sql/01-schema.sql            # Postgres DDL: app_user, login_otp, glucose_reading, ...
│
├── tests/                             # E2E integration tests (Vitest)
│   ├── e2e.test.js                  # 20 tests: auth, Hasura RLS, scan pipeline, chatbot, site
│   └── fixtures/test-fundus.png     # 224×224 synthetic gradient PNG used by scan-flow tests
├── vitest.config.js                   # Vitest test configuration
├── .env.example                       # Environment variable template
│
├── docs/                              # Original HTML/CSS wireframes
│   ├── index.html                    # Landing page wireframe
│   ├── dashboard.html                # Dashboard wireframe
│   ├── glucose-tracker.html          # Glucose tracker wireframe
│   ├── meal-analyzer.html            # Meal analysis wireframe
│   ├── retina-scan.html              # Retina scan wireframe
│   ├── chatbot.html                  # AI chatbot wireframe
│   ├── offline.html                  # Offline fallback page
│   ├── css/                          # Wireframe styles
│   ├── js/                           # Wireframe interactivity
│   ├── images/                       # Wireframe image assets
│   └── templates/                    # Reusable HTML templates
│
├── screenshots/                       # Captured wireframe screenshots
│   ├── screenshot-01-landing-page.png
│   ├── screenshot-02-dashboard.png
│   ├── screenshot-03-glucose-tracker.png
│   ├── screenshot-04-meal-analyzer.png
│   ├── screenshot-05-retina-scan.png
│   └── screenshot-06-ai-advisor.png
│
├── research/                          # Research documentation
│   ├── diabetes-ncds-ai-mobile-research.md
│   └── diabetes-ncds-validation-report.md
│
├── .kiro/                             # Kiro AI specs
├── index.html                         # Vite entry point
├── package.json                       # Node.js dependencies
├── vite.config.js                     # Vite build config
├── tailwind.config.js                 # TailwindCSS design system
├── postcss.config.js                  # PostCSS config
│
├── logical-architecture.svg/.png      # Architecture diagrams
├── technical-architecture.svg/.png
├── use-case-diagram.svg/.png
├── estimated-cost.svg/.png
├── funding-slide.svg/.png
├── prototype-cost-slide.svg/.png
│
├── Idea Submission _ AWS AI for Bharat Hackathon.pptx                            # Idea phase deck
├── Idea Submission _ AWS AI for Bharat Hackathon_DiabetCareAI.pdf                # Idea phase PDF
├── Prototype Development Submission _ AWS AI for Bharat Hackathon_DiabetCareAI.pptx  # Prototype deck
│
├── capture-fullpage-screenshots.js    # Puppeteer screenshot script
├── .claude/                           # Claude Code configuration
├── .gitignore                         # Git ignore rules
└── .claudeignore                      # Claude Code ignore rules
```

**Live Prototype:** https://nazarai.gheware-ai.com/
**GitHub:** https://github.com/brainupgrade-in/aiforbharat2

## Selected Use Case: Diabetes Screening ✅

**Project Name:** DiabetCare AI
**Priority:** TIER 1 - Diabetes Management + Diabetic Retinopathy Screening

## Confirmed Focus: Diabetes Management + Diabetic Retinopathy Screening ✅

**Strategic Decision:** After comprehensive analysis of India's NCD landscape, we have strategically focused on **diabetes and its complications exclusively**.

### Why Diabetes Only?

**Rationale:**
- **Massive Scale:** 89.8 million diabetics (IDF Atlas 11th Edition, 2025) - world's 2nd largest population
- **Economic Impact:** ₹2-3 lakh crore annual burden (up to 50% develop serious complications — IDF)
- **Preventable Complications:** Up to 90% of DR blindness preventable with timely screening (WHO)
- **Technology Readiness:** AI DR screening clinically validated (92%+ sensitivity, 88%+ specificity — AIDRSS)
- **Market Opportunity:** 225M total addressable market (89.8M diabetics + 136M pre-diabetics)
- **Government Alignment:** NP-NCD (formerly NPCDCS) with 682 District NCD Clinics established

### Core Diabetes Features (In Scope)

**Primary Features:**
- **AI Diabetic Retinopathy Screening** - Smartphone camera-based fundus image analysis
- **Smart Glucose Tracker** - Manual logging with trend analysis and pattern detection
- **AI Meal Analyzer** - Photo-based food recognition with carb estimation for Indian foods
- **Diabetes Advisor Chatbot** - 24/7 AI guidance using AWS Bedrock Amazon Nova Micro
- **Complication Risk Assessment** - DR, diabetic foot ulcer, nephropathy, CVD risk

**Advanced Features (Phase 2):**
- CGM integration (Abbott FreeStyle Libre, Dexcom, BeatO)
- Doctor dashboard (telemedicine, prescription management)
- ASHA worker dashboard (population-level diabetes monitoring)
- ABDM integration (ABHA-compatible health records)

### Explicitly Out of Scope

The following NCDs and conditions have been **removed** from the project scope:

❌ **Mental Health** (anxiety, depression, stress management)
❌ **Cardiovascular Diseases** (hypertension alone, heart disease, stroke)
❌ **Cancer** (all types)
❌ **Chronic Respiratory Diseases** (asthma, COPD)
❌ **Pregnancy/Maternal Health** (pregnancy risk, ASHA worker support for maternal health)
❌ **Tuberculosis** (TB detection)

**Note:** See `DIABETES_FOCUS.md` for comprehensive diabetes-only scope documentation.

### Expected Impact (Diabetes-Only)

- **40-50% reduction** in diabetes complications (blindness, amputations, kidney failure)
- **₹2-3 lakh crore GDP savings** from reduced complication burden
- **500+ DR cases** detected early (before vision loss) in Year 1
- **60%+ users** achieve clinically significant glucose improvement (HbA1c reduction ≥0.5%)
- **30% rural reach** (vs. <5% access to traditional endocrinologists)
- **225M total addressable market** (diabetics + pre-diabetics)

## Technology Stack

### Frontend — React PWA
- **Framework:** React 18 + Vite, TailwindCSS, React Router v6
- **State/data:** Apollo Client → Hasura GraphQL; custom `useAuth` for JWT
- **PWA:** vite-plugin-pwa (workbox), offline-first SW, installable
- **Key libs:** `@apollo/client`, `graphql`, `recharts`, `react-webcam`

### Backend — k3s on NUC
| Concern | Service | Tech |
|---|---|---|
| Auth | `nazar-auth` | Fastify + nodemailer (SES SMTP) + bcryptjs + jsonwebtoken (HS256) |
| Data API | Hasura v2.42 | JWT-mode auth, RLS via `x-hasura-user-id` from JWT claims |
| Database | `nazarai-pg` (CNPG operator) | Postgres 16, 1 instance, Longhorn 5Gi PVC |
| AI / Chat | `nazar-chatbot` | Fastify proxy → ollama_cloud OpenAI-compatible API |
| AI / DR scan | `nazar-dr-model` | FastAPI + PyTorch CPU, ViT-base classifier, ~220 ms/image |
| Scan upload | `nazar-scan` | Fastify multipart, 20 Gi Longhorn PVC, calls dr-model, persists via Hasura |
| Web | `nazar-web` | nginx-unprivileged serving Vite `dist/` with SPA fallback |
| Ingress | Traefik (k3s built-in) | Path-based routing, replacePathRegex middleware for Hasura |
| TLS | cert-manager | `letsencrypt-prod` ClusterIssuer |
| Public exposure | Cloudflare Tunnel | Token-based, hostnames managed in Zero Trust dashboard / API |
| Container registry | `registry.gheware-ai.com` | k3s mirror config maps both public DNS + internal NodePort |
| Storage | Longhorn (default SC) | Replicated block storage |
| Backups | (TODO) | restic/velero → external disk |

### AI/ML

**Chat (`nazar-chatbot` → ollama_cloud)**
- **Provider name MUST be `ollama_cloud`** (not `ollama` — Gotcha #51 in `~/ai-business-agents/CLAUDE.md`)
- **Models in use:** `kimi-k2.6:cloud` (EN primary), `gpt-oss:120b` (HI/KN primary, EN fallback)
- **API:** `https://ollama.com/v1/chat/completions` (OpenAI-compatible), `OLLAMA_API_KEY` env var
- **Lifecycle warning:** hosted models can be silently retired (e.g. `kimi-k2:1t` retired 2026-04-14 → 500s). Verify via `curl https://ollama.com/v1/models -H "Authorization: Bearer $OLLAMA_API_KEY"` before pinning new models

**DR scan (`nazar-dr-model` → in-cluster ViT)**
- **Model:** `rafalosa/diabetic-retinopathy-224-procnorm-vit` (ViT-base, fine-tuned on `martinezomg/diabetic-retinopathy`, public HF Apache-2.0 weights, ~330 MB) — pre-baked into container image at build time
- **Runtime:** PyTorch CPU + transformers `AutoImageProcessor`/`AutoModelForImageClassification`. ONNX evaluated and skipped: 800ms PyTorch latency is well under our 10s budget; conversion adds maintenance cost without a real win
- **Label semantics:** Model's `id2label` is NOT APTOS-standard order (`{0:mild, 1:moderate, 2:no_dr, 3:proliferative, 4:severe}`). The service **hardcodes a remap** to APTOS-standard so the API speaks `{0:No DR, 1:Mild, 2:Moderate, 3:Severe, 4:Proliferative}`
- **Decision rule:** binary "any DR" call uses `P(any DR) > 0.30` (sensitivity-tuned, not argmax) — the bare-argmax model never predicts Mild/Severe/Proliferative on APTOS, so threshold tuning is necessary to get sensitivity ≥95%
- **Phase 0 numbers** (APTOS test, 400 samples, NUC CPU): top-2 acc 81%, sensitivity 89.45% at argmax / ~95%+ at threshold 0.30, specificity 98% / ~92% at threshold, mean latency 798 ms (PyTorch native) / 220 ms (in-service after warm-up)
- **Image-quality gate (client-side):** `src/lib/imageQuality.js` — dimension check (≥224×224) + Laplacian-of-grayscale variance on a 256×256 downsample, threshold 80. Reports `too_small` / `blurry` so the upload UI can show a specific reason. Threshold is empirical from APTOS samples; will need re-tuning when real Indian phone-fundus captures arrive.
- **Future:** if smartphone-captured fundus accuracy proves insufficient, escalate to RETFound (Nature 2023 foundation model) + APTOS fine-tune. A more sophisticated quality classifier (dedicated lightweight CNN) could replace the Laplacian heuristic.

### Development Environment
- **IDE:** local VS Code or Claude Code
- **Version Control:** Git + GitHub (https://github.com/brainupgrade-in/aiforbharat2)
- **Build host:** workstation (docker), pushes to `192.168.1.12:30500` (registry NodePort)
- **CI/CD:** none yet — manual `docker build && docker push && kubectl rollout`

### Security & Compliance
- **Auth:** magic-link OTP (6-digit, 10-min TTL, hashed via `bcrypt(otp + OTP_PEPPER)`) → HS256 JWT (7-day TTL)
- **Auth rate limit:** server-side: max 1 OTP / email / 30 sec, max 5 OTPs / email / hour, returns 429 (matches client-side cooldown but plugs the API-direct abuse path)
- **JWT lifecycle:** Apollo `errorLink` detects expired/invalid JWT (HTTP 401, Hasura `invalid-jwt` code, or "JWT expired" message) → dispatches `nazarai:session-expired` → `AuthProvider` forces sign-out, dropping user back at the OTP screen instead of opaque GraphQL errors
- **Authorization:** Hasura row-level perms keyed on `x-hasura-user-id` JWT claim. `login_otp` is admin-only (no user-role select perm) so the OTP-injection table can't be read by any logged-in user
- **Encryption:** TLS 1.3 at edge (Cloudflare), HTTP backplane within cluster
- **Secrets:** k8s Secrets, never in repo. `nazar-auth-env` holds DATABASE_URL, JWT_SECRET, OTP_PEPPER, SMTP_*. SES creds sourced from `~/ai-business-agents/.env` at deploy time
- **Data Privacy:** GDPR / DPDP Act 2023 — minimal collection, user-owned data, `app_user` delete cascades through all child tables (glucose_reading, retina_scan, chat_message, user_profile)

## Critical Design Principles

### Mobile-First Requirements
✅ **Offline-First Architecture**
- Core features work without internet (only 3.8% rural households have fiber optic access; rural wireless tele-density at 57.89% vs 124.31% urban)
- Background sync when connection available
- Local data caching with encryption

✅ **Lightweight & Efficient**
- App size <50 MB
- Low RAM usage (<256 MB runtime)
- Battery efficiency (minimal background processing)
- 2G/3G network compatibility

✅ **Multilingual Support**
- Minimum: Hindi + English
- Recommended: + Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia
- Voice interface for low literacy users

✅ **Simple UX**
- Large touch targets (min 48x48 dp)
- High contrast for outdoor visibility
- Minimal navigation depth (max 3 levels)
- Voice-guided onboarding

### AI Model Constraints
- **On-device model size:** <50 MB for offline inference
- **Latency:** <2 seconds for critical features
- **Accuracy:** >85% for diagnostic features (comparable to human expert)
- **Explainability:** Provide reasoning for AI decisions (trust building)
- **Bias mitigation:** Test across demographics (age, gender, geography, socioeconomic status)

### Data Privacy & Ethics
- **Minimal data collection:** Only essential health information
- **User consent:** Explicit opt-in for data sharing
- **Data ownership:** Users own their health data
- **Anonymization:** De-identify data before analytics
- **Right to deletion:** Allow users to delete all data

## Integration Points

### Government Initiatives
- **ABDM (Ayushman Bharat Digital Mission):** Mandatory integration
  - ABHA (Ayushman Bharat Health Account) for unique health ID
  - Health Information Provider (HIP) compliance
  - Health Information User (HIU) compliance
- **e-Sanjeevani:** Telemedicine platform integration
- **NIKSHAY:** TB patient tracking (if relevant)
- **MCTS:** Mother and Child Tracking System (if relevant)

### Healthcare Infrastructure
- **PHC/CHC Systems:** Electronic health records
- **Diagnostic Labs:** Result integration
- **Pharmacies:** Prescription and medicine tracking
- **Emergency Services:** 108/112 integration

## Testing Strategy

### E2E Integration Tests (Implemented)
- **Framework:** Vitest (native to Vite)
- **Test file:** `tests/e2e.test.js` — **20 tests, all passing**
- **Coverage:**
  - Public site health (3): `/`, `/auth/health`, `/api/chat/health`
  - Magic-link auth (4): JWT issuance, `/auth/me`, missing token, bad OTP
  - Hasura GraphQL with RLS (4): insert auto-sets `user_id`, list-own-rows-only, admin-only `login_otp` blocked, profile CRUD
  - Retina scan pipeline (6): health, 401 without JWT, full upload→classify→persist, image roundtrip, cross-user 404, RLS check via Hasura
  - Chatbot (3): 401 without JWT, English response, 400 on empty message
- **Setup:** `beforeAll` injects an OTP via Hasura admin secret using `bcrypt(otp + OTP_PEPPER)` (must match server-side hashing), then exchanges via real `/auth/verify`. `afterAll` cleans up via `delete_app_user` cascade.
- **Required env:** `HASURA_ADMIN_SECRET`, `OTP_PEPPER` (both must match the values in the cluster's `hasura-env` and `nazar-auth-env` secrets respectively).
- **Run:** `HASURA_ADMIN_SECRET=... OTP_PEPPER=... npm test` (default target: `https://nazarai.gheware-ai.com`; override via `TEST_PUBLIC_URL=...`)

### Unit Testing (Planned)
- **Framework:** Vitest + React Testing Library
- **Coverage:** Minimum 80% code coverage

### Integration Testing
- **Current:** Vitest E2E suite covers nazar-auth → Hasura → ollama_cloud → public URL
- **Manual smoke test:** see `## Common Commands` for in-cluster curl pattern

### User Acceptance Testing
- **Target Users:** Doctors, ASHA workers, patients
- **Metrics:** Task completion rate, time on task, error rate
- **Accessibility:** Test with screen readers, voice input

### Performance Testing
- **Load Testing:** JMeter for backend APIs
- **Mobile Performance:** Test on low-end devices (2GB RAM, quad-core CPU)
- **Network:** Test on 2G, 3G, 4G, and offline scenarios

## Regulatory & Compliance Considerations

### Indian Regulations
- **Digital Personal Data Protection Act 2023:** Mandatory compliance
- **Medical Devices Rules 2017:** Determine if app qualifies as Software as Medical Device (SaMD)
- **Information Technology Act 2000:** Data security requirements
- **Telemedicine Practice Guidelines 2020:** If app includes teleconsultation

### Clinical Validation
- Peer-reviewed publication preferred
- Prospective clinical trial if diagnostic claims
- Comparison with gold standard/expert human performance
- External validation on diverse populations

### Ethical Clearance
- Institutional Ethics Committee (IEC) approval if collecting patient data
- Informed consent protocols
- Data governance policies

## Common Commands

### Frontend (React + Vite)
```bash
npm install                            # install deps
npm run dev                            # Vite dev server on :5173
npm run build                          # builds dist/
HASURA_ADMIN_SECRET=... OTP_PEPPER=... npm test   # run 20 e2e tests against live URL
```

### Build & deploy a backend service (auth / chatbot / web)
```bash
# Auth or chatbot — Dockerfile in services/<svc>/
cd services/auth                                      # or chatbot
docker build -t 192.168.1.12:30500/nazarai/auth:vN .
docker push 192.168.1.12:30500/nazarai/auth:vN

# Web — uses repo root as build context (needs dist/)
npm run build
docker build -f services/web/Dockerfile -t 192.168.1.12:30500/nazarai/web:vN .
docker push 192.168.1.12:30500/nazarai/web:vN

# Roll out new image (after bumping the image tag in the relevant k8s/*.yaml)
cat k8s/03-auth.yaml | ssh rajesh@nuc kubectl apply -f -
ssh rajesh@nuc 'kubectl rollout restart deploy/nazar-auth -n nazarai'
```

### Live URL
- Public: **https://nazarai.gheware-ai.com/**
- Path layout (single-host, path-based routing):
  - `/` → nazar-web (React SPA)
  - `/auth/*` → nazar-auth
  - `/api/chat` → nazar-chatbot
  - `/api/scan` → nazar-scan (POST upload, GET `/:id/image` byte stream)
  - `/api/graphql` → hasura (Traefik middleware rewrites to `/v1/graphql`)

### Cluster ops
```bash
# Status
ssh rajesh@nuc 'kubectl get all -n nazarai'

# Connect to Postgres as the app user
ssh rajesh@nuc bash -c '
  APP_PW=$(kubectl get secret -n nazarai nazarai-pg-app -o jsonpath="{.data.password}" | base64 -d)
  kubectl exec -it -n nazarai nazarai-pg-1 -- env PGPASSWORD="$APP_PW" psql -h localhost -U nazarai_app -d nazarai
'

# Hasura admin console (port-forward from NUC)
ssh -L 18080:localhost:18080 rajesh@nuc 'kubectl port-forward -n nazarai svc/hasura 18080:80'
# then open http://localhost:18080/console with the admin secret

# Test ollama_cloud connectivity / list models
curl -H "Authorization: Bearer $OLLAMA_API_KEY" https://ollama.com/v1/models | jq '.data[].id'
```

### Wireframe Development (Original HTML/CSS — historic)
```bash
cd docs && python -m http.server 8000  # http://localhost:8000
node capture-fullpage-screenshots.js   # Puppeteer screenshots
```

## Key Datasets & Resources

### Healthcare Datasets
- **Kaggle:** Diabetic retinopathy, chest X-rays, ECG signals
- **PhysioNet:** ECG, EEG, ICU patient data
- **MIMIC-III:** Critical care database
- **NIH Chest X-ray Dataset:** 100,000+ chest X-rays
- **India-specific:** ICMR repositories (requires approval)

### Pre-trained Models
- **Medical Imaging:** ResNet, DenseNet, EfficientNet (ImageNet pre-trained)
- **NLP:** mBERT, XLM-RoBERTa (multilingual), IndicBERT (Indic languages)
- **Speech:** Wav2Vec 2.0, Whisper (OpenAI)

### APIs & Services
- **Translation:** Google Translate API, AWS Translate (for multilingual support)
- **Speech:** Google Speech-to-Text, AWS Transcribe (Indic language support)
- **Medical NLP:** Hugging Face BioBERT, PubMedBERT

## Success Metrics

### Technical Metrics
- Model accuracy: >85% (comparable to human experts)
- App performance: <2s response time for critical features
- Uptime: >99.5% availability
- Crash rate: <1% sessions

### Business Metrics
- User acquisition: 10,000+ downloads in first 3 months
- User retention: >40% DAU/MAU ratio
- Engagement: >3 sessions/week per active user
- NPS (Net Promoter Score): >50

### Impact Metrics
- Lives saved: Track early disease detections
- Cost savings: Reduce diagnostic costs by 30%+
- Access improvement: Reach 1,000+ villages without specialists
- Time savings: 50% reduction in diagnosis time

## Risk Mitigation

### Technical Risks
- **Model accuracy below threshold:** Implement ensemble methods, collect more training data
- **Performance on low-end devices:** Optimize model size, use quantization
- **Network connectivity issues:** Robust offline-first architecture
- **Data privacy breach:** End-to-end encryption, security audits

### Adoption Risks
- **Low user trust:** Government endorsement, clinical validation studies
- **Digital literacy barriers:** Voice interface, tutorial videos, ASHA worker training
- **Behavior change resistance:** Gamification, incentives, community health worker engagement

### Regulatory Risks
- **SaMD classification:** Early consultation with CDSCO (drug controller)
- **Data protection compliance:** Privacy-by-design architecture
- **Clinical validation requirements:** Plan prospective clinical study

## Documentation Standards

### Code Documentation
- **Python:** Google-style docstrings
- **JavaScript/TypeScript:** JSDoc comments
- **README:** Setup instructions, architecture overview, API docs
- **Comments:** Explain "why" not "what" (self-documenting code)

### API Documentation
- **Format:** OpenAPI 3.0 specification
- **Tools:** Swagger UI for interactive docs
- **Include:** Request/response examples, error codes, rate limits

### User Documentation
- **Languages:** English + Hindi (minimum)
- **Formats:** In-app tutorials, PDF guides, video walkthroughs
- **Accessibility:** Screen reader compatible, large fonts

## Important Reminders

### What TO Do ✅
- Focus on diabetes screening use case (selected)
- Build ReactJS Progressive Web App (mobile-first)
- Use Hasura + Postgres for the data plane; Apollo Client on the frontend
- Use ollama_cloud for chat (provider name MUST be `ollama_cloud`)
- Support minimum 2 languages (English + Hindi)
- Focus on user privacy and data security (DPDP Act 2023 / HIPAA-equivalent)
- Test on mobile browsers (Chrome, Safari)
- Verify ollama_cloud model availability before pinning new model IDs in chatbot

### What NOT To Do ❌
- Don't collect unnecessary personal data
- Don't make medical claims without clinical validation
- Don't ignore regulatory requirements
- Don't optimize only for high-end devices
- Don't skip security audits
- Don't hardcode credentials or API keys
- Don't ignore accessibility requirements
- Don't launch without ABDM integration plan

## References & Resources

### Official Documentation
- Hasura GraphQL: https://hasura.io/docs/2.0/
- CloudNativePG: https://cloudnative-pg.io/documentation/
- ollama_cloud (model list): `curl https://ollama.com/v1/models -H "Authorization: Bearer $OLLAMA_API_KEY"`
- React: https://react.dev/
- Ayushman Bharat Digital Mission: https://abdm.gov.in/

### Research Papers
- AI in Healthcare: Nature Medicine, JAMA, Lancet Digital Health journals
- Diabetic Retinopathy AI: Google AI publications
- Medical Chatbots: Papers on CBT chatbots, mental health AI

### Indian Healthcare Context
- National Health Policy 2017
- Ayushman Bharat scheme documentation
- NITI Aayog health reports
- ICMR guidelines and publications

### Similar Projects
- Practo (telemedicine app)
- 1mg (online pharmacy + diagnostics)
- Niramai (AI breast cancer screening)
- Tricog Health (AI ECG analysis)
- Google AI diabetic retinopathy (India pilot)

## Preferred TTS Voice Settings

For video narration and voiceover generation, always use these settings:
- **Tool:** `edge-tts` (Microsoft Edge Neural TTS — free, high quality)
- **Voice:** `en-US-AndrewMultilingualNeural` (Warm, Confident, Authentic, Conversational)
- **Rate:** `+0%` (normal speed for natural delivery)
- **Style:** Presentation/demo narration
- **Command:** `edge-tts --voice "en-US-AndrewMultilingualNeural" --rate="+0%" --text "TEXT" --write-media output.mp3`
- **Why this voice:** Realistic, human-like, conversational tone — ideal for hackathon demos, product videos, and professional presentations
- **Per-scene workflow:** Split script into numbered `.txt` files in `video/public/audio/scenes/`, generate per-scene `.mp3`, concatenate with `ffmpeg` (0.6s gaps)
- **Video engine:** Remotion 4.0 (React-based) in `video/` folder, 1920x1080 @ 30fps
- **ElevenLabs API key:** Located at `/home/rajesh/claudecodehealth/marketing/.env` (quota limited, prefer edge-tts)

## Team Name

- **Team Name:** TheHealthGheware

---

**Last Updated:** 2026-05-01
**Hackathon:** AWS AI for Bharat (entered round 2; concluded)
**Focus:** Mobile-first AI healthcare solutions for India
**Live Prototype:** https://nazarai.gheware-ai.com/ (on-prem k3s)
**GitHub:** https://github.com/brainupgrade-in/aiforbharat2

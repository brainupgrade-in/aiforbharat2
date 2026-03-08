# Prototype Submission Review — Action Items

> **Progress tracked in:** `todo/progress-tracker.md` (updated 2026-03-08)

**Reviewed:** 2026-03-08
**Submission Deck:** `Prototype Development Submission _ AWS AI for Bharat Hackathon_DiabetCareAI.pptx`
**Live Prototype:** https://main.d3vwqyp1h0elbo.amplifyapp.com/
**Team:** TheHealthGheware | Leader: Rajesh Gheware

---

## CRITICAL — Submission Blockers

### 1. Demo Video Missing (Slide 13)
- **Status:** ❌ NOT DONE
- **Requirement:** Slide 13 explicitly says `[TO BE ADDED — Record and upload to YouTube/Drive before submission]`
- **Action:** Record a 3-minute demo video covering: login → home → scan workflow → results (patient + doctor mode) → community dashboard → multilingual toggle → high contrast mode
- **Upload to:** YouTube (unlisted) or Google Drive (public link)
- **Update:** Paste link into Slide 13 of the PPTX

### 2. AI Integration Not Implemented (Core Differentiator)
- **Status:** ⏳ PARTIALLY DONE — Demo Mode approach implemented, Bedrock endpoint ready
- The deck (Slides 3, 4, 8, 11) claims specific AI capabilities as solution features:

| Claimed Feature | Deck Slide | Actual Status |
|---|---|---|
| Amazon Rekognition Custom Labels (DR screening) | 3, 4, 8 | **Demo Mode** — simulated results with clear "DEMO MODE" banner |
| AWS Bedrock Claude 3 Haiku (chatbot) | 3, 4, 8 | ✅ **UI built** — `NazarChat.jsx` with Bedrock endpoint ready (`VITE_BEDROCK_ENDPOINT`), demo fallback |
| AWS Bedrock Nova Pro (meal analysis) | 3, 4, 8 | **Not built** — page exists but no AI |
| Bedrock Knowledge Bases (RAG) | 8 | **Not built** |
| S3 storage for images | 8 | **Not built** — images not uploaded to S3 |
| Lambda functions | 8 | **Not built** — MVP uses direct AppSync→DynamoDB |

- **Risk:** Judges will test the live prototype. Simulated DR results with no actual AI will be immediately obvious.
- **Action (minimum viable):**
  - [x] ~~Integrate AWS Bedrock Claude 3 Haiku for the chatbot page~~ → `NazarChat.jsx` created with Bedrock endpoint + demo fallback
  - [ ] Integrate AWS Bedrock for DR scan analysis (send fundus image to a vision model, get classification, ~4-6 hours)
  - [x] ~~OR clearly label simulated features as "Demo Mode" in the UI and deck~~ → Done: DR scan, DR results, and chatbot all show "DEMO MODE" badges

### 3. Performance Claims Unvalidated (Slide 11)
- **Status:** ⏳ PARTIALLY DONE — PWA added (should improve Lighthouse PWA score)
- **Claims made:**
  - "92%+ sensitivity, 88%+ specificity" for DR screening — **no model trained, no validation done**
  - "Lighthouse Score: Target 90+" — **not tested**
  - "First Contentful Paint: <1.5s on 4G" — **not measured**
  - "500+ Indian dishes recognized" — **no food database or model**
  - "WCAG 2.1 AA compliant" — **not audited**
- **Action:**
  - [ ] Run Lighthouse audit on the live prototype and include actual scores
  - [ ] Either remove specific accuracy claims or qualify them as "target" / "based on published literature"
  - [ ] Run WCAG accessibility check (axe-core or Lighthouse accessibility audit)

---

## HIGH PRIORITY — Feature Gaps

### 4. Glucose Tracker Page (Slide 4 Feature)
- **Status:** ✅ DONE
- **Changes:**
  - [x] Created `NazarGlucose.jsx` — full glucose tracker in Nazar design system
  - [x] Wired to DynamoDB via Amplify Data (dynamic import of `aws-amplify/data`)
  - [x] Trend chart with Recharts (reference lines at 100/140 mg/dL)
  - [x] Status badges (High/Low/Normal), cloud sync indicator, multilingual (EN/HI/KN)
  - [x] Accessible via "Glucose" tab in 5-tab bottom navigation

### 5. Meal Analyzer Page (Slide 4 Feature)
- **Status:** Page exists (`MealAnalyzer.jsx`) but no AI
- **Action:**
  - [ ] At minimum: add photo upload to S3 + send to Bedrock vision model for food identification
  - [ ] OR mark as "Coming Soon" in the UI

### 6. Chatbot Page (Slide 4 Feature)
- **Status:** ✅ DONE (UI + Bedrock-ready, demo fallback active)
- **Changes:**
  - [x] Created `NazarChat.jsx` with Nazar design system styling
  - [x] Bedrock integration via configurable `VITE_BEDROCK_ENDPOINT` env var
  - [x] Demo mode with 5 rich response categories (glucose, breakfast, exercise, retina, general)
  - [x] "DEMO MODE" badge when Bedrock not connected
  - [x] Multilingual greetings and suggested questions (EN/HI/KN)
  - [x] Accessible via "AI Chat" tab in 5-tab bottom navigation
  - [ ] Deploy Lambda function for Bedrock endpoint (architecture ready, needs deployment)

### 7. Offline/PWA Capabilities (Slide 4, 11)
- **Status:** ✅ DONE
- **Changes:**
  - [x] Added `vite-plugin-pwa` with Workbox service worker
  - [x] PWA manifest generated at build time (name, icons, theme color)
  - [x] Runtime caching for Google Fonts (CacheFirst) and AppSync API (NetworkFirst)
  - [x] Service worker auto-updates; `sw.js` + workbox generated in dist/
  - [x] App installable on mobile Chrome

---

## MEDIUM PRIORITY — Deck & Documentation Fixes

### 8. Slide 6 — Wireframe/Prototype Screenshots Outdated
- **Status:** Need to verify screenshots match the current React MVP (not old wireframes)
- **Action:**
  - [ ] Capture fresh screenshots of the live React MVP (all screens)
  - [ ] Replace wireframe screenshots in deck with actual MVP screenshots
  - [ ] Include screenshots of: Auth screen, Home, Scan workflow, Results, Community, Language switcher

### 9. Slide 10 — Prototype Snapshots
- **Status:** Same as above — must show actual running prototype
- **Action:**
  - [ ] Capture mobile-viewport screenshots (375x812 iPhone size)
  - [ ] Show real user flow with sample data

### 10. Team Name Inconsistency
- **Status:** ✅ DONE
- **Changes:**
  - [x] Standardized to "TheHealthGheware" across all files
  - [x] Updated: PROJECT_SUMMARY.md, README.md, template.md, TECH_STACK.md
  - [x] Updated: All `.kiro/` spec files (steering.md, system-architecture, security-compliance)

### 11. Project Name Inconsistency
- **Status:** ✅ DONE (no change needed)
- **Decision:** "Nazar AI" is the primary name (matches live app). "DiabetCare AI" is the subtitle in the deck. Both are acceptable and consistent.

### 12. Slide 9 — Cost Diagram
- **Status:** References ₹87,000 MVP budget but need to verify diagram is current
- **Action:**
  - [ ] Verify cost slide matches `MVP_BUDGET_FINAL.md`
  - [ ] Include actual AWS costs incurred during prototype development

---

## LOW PRIORITY — Nice to Have

### 13. GitHub Repository Cleanup
- **Status:** Only 6 commits, repo is 1.5 GB (node_modules likely included)
- **Action:**
  - [ ] Verify `.gitignore` excludes `node_modules/` and `dist/`
  - [ ] Add meaningful commit messages for any new features
  - [ ] Add a proper README with setup instructions on GitHub

### 14. Complication Risk Assessment (Slide 4 Feature)
- **Status:** Not implemented
- **Action:**
  - [ ] Low priority — can be marked as Phase 2 in the deck
  - [ ] Or add a simple risk calculator form (age, duration, HbA1c, BP → risk score)

### 15. S3 Image Storage
- **Status:** Fundus images and meal photos are not stored anywhere
- **Action:**
  - [ ] Add Amplify Storage (S3) for scan image upload
  - [ ] Required for real DR screening workflow

### 16. ABDM Integration Readiness
- **Status:** Mentioned in Slide 12 (roadmap) — acceptable as future plan
- **Action:** No immediate action needed, but ensure export buttons are functional stubs

---

## Recommended Prioritization (Pre-Submission Sprint)

**If you have 1 day:**
1. Record demo video (30 min)
2. Fix team/project name consistency in deck (15 min)
3. Update prototype screenshots in deck (30 min)
4. Add "Demo Mode" labels to simulated features in UI (30 min)
5. Run Lighthouse audit and update Slide 11 with real numbers (15 min)

**If you have 3 days:**
- All of the above, plus:
6. Integrate Bedrock Claude 3 Haiku chatbot (4-6 hours)
7. Wire Glucose Tracker to DynamoDB (2-3 hours)
8. Add PWA manifest + service worker (2-3 hours)

**If you have 5+ days:**
- All of the above, plus:
9. Integrate Bedrock for DR scan analysis (4-6 hours)
10. Integrate Bedrock Nova Pro for meal analysis (4-6 hours)
11. Add S3 storage for images (2-3 hours)
12. Full Lighthouse optimization to 90+ (4-6 hours)

---

## Summary Scorecard

| Category | Before | After | Notes |
|---|---|---|---|
| **Live Prototype** | 7/10 | **8/10** | +Chatbot, +Glucose tracker, +PWA, +Demo Mode labels |
| **AWS Service Usage** | 4/10 | **5/10** | +DynamoDB wired for glucose; Bedrock endpoint ready but not deployed |
| **Deck Completeness** | 8/10 | 8/10 | Still missing demo video link and updated screenshots |
| **Documentation** | 9/10 | **10/10** | +`.kiro/` specs aligned with codebase, +progress tracker |
| **Feature Coverage** | 5/10 | **7/10** | +Glucose tracker (DynamoDB), +AI chatbot (demo), +PWA/offline |
| **AI Integration** | 2/10 | **4/10** | Chatbot UI ready for Bedrock; Demo Mode clearly labeled; no live AI yet |
| **Mobile/Accessibility** | 7/10 | **8/10** | +PWA installable, +service worker caching |
| **Innovation** | 8/10 | 8/10 | Unchanged — strong concept |

**Overall Assessment:** Significant progress on feature coverage (chatbot, glucose tracker, PWA) and documentation alignment. The #1 remaining risk is still no live AI — deploying the Bedrock Lambda endpoint for the chatbot would be the highest-impact next step. Demo video is the other critical blocker.

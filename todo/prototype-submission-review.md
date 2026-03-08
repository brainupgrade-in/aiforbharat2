# Prototype Submission Review — Action Items

> **Progress tracked in:** `todo/progress-tracker.md` (updated 2026-03-08)

**Reviewed:** 2026-03-08
**Submission Deck:** `Prototype Development Submission _ AWS AI for Bharat Hackathon_DiabetCareAI.pptx`
**Live Prototype:** https://main.d3vwqyp1h0elbo.amplifyapp.com/
**Team:** TheHealthGheware | Leader: Rajesh Gheware

---

## CRITICAL — Submission Blockers

### 1. Demo Video Missing (Slide 13)
- **Status:** NOT DONE
- **Requirement:** Slide 13 explicitly says `[TO BE ADDED — Record and upload to YouTube/Drive before submission]`
- **Action:** Record a 3-minute demo video covering: login → home → scan workflow → results (patient + doctor mode) → community dashboard → multilingual toggle → high contrast mode
- **Upload to:** YouTube (unlisted) or Google Drive (public link)
- **Update:** Paste link into Slide 13 of the PPTX

### 2. AI Integration Not Implemented (Core Differentiator)
- **Status:** ALL AI SERVICES ARE "PLANNED" — NONE ARE LIVE
- The deck (Slides 3, 4, 8, 11) claims specific AI capabilities as solution features, but:

| Claimed Feature | Deck Slide | Actual Status |
|---|---|---|
| Amazon Rekognition Custom Labels (DR screening) | 3, 4, 8 | **Simulated** — random results, no model trained |
| AWS Bedrock Claude 3 Haiku (chatbot) | 3, 4, 8 | **Not built** — page exists but no Bedrock integration |
| AWS Bedrock Nova Pro (meal analysis) | 3, 4, 8 | **Not built** — page exists but no AI |
| Bedrock Knowledge Bases (RAG) | 8 | **Not built** |
| S3 storage for images | 8 | **Not built** — images not uploaded to S3 |
| Lambda functions | 8 | **Not built** |

- **Risk:** Judges will test the live prototype. Simulated DR results with no actual AI will be immediately obvious.
- **Action (minimum viable):**
  - [ ] Integrate AWS Bedrock Claude 3 Haiku for the chatbot page (simplest AI integration, ~2-4 hours)
  - [ ] Integrate AWS Bedrock for DR scan analysis (send fundus image to a vision model, get classification, ~4-6 hours)
  - [ ] OR clearly label simulated features as "Demo Mode" in the UI and deck

### 3. Performance Claims Unvalidated (Slide 11)
- **Status:** Claims not backed by evidence
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
- **Status:** Page file exists (`GlucoseTracker.jsx`) but not connected to DynamoDB
- **Action:**
  - [ ] Wire glucose logging form to Amplify Data (DynamoDB `GlucoseReading` model already defined)
  - [ ] Display logged readings in a list/chart
  - [ ] This is the easiest feature to make functional since the data model is ready

### 5. Meal Analyzer Page (Slide 4 Feature)
- **Status:** Page exists (`MealAnalyzer.jsx`) but no AI
- **Action:**
  - [ ] At minimum: add photo upload to S3 + send to Bedrock vision model for food identification
  - [ ] OR mark as "Coming Soon" in the UI

### 6. Chatbot Page (Slide 4 Feature)
- **Status:** Page exists (`Chatbot.jsx`) but no Bedrock integration
- **Action:**
  - [ ] Integrate Bedrock Claude 3 Haiku via Lambda function
  - [ ] System prompt: diabetes advisor, multilingual, India-specific
  - [ ] This is a strong demo feature — prioritize this

### 7. Offline/PWA Capabilities (Slide 4, 11)
- **Status:** React app has NO service worker or PWA manifest in the `src/` build
- The `docs/` folder has `manifest.json` and `service-worker.js` but these are for the old wireframe site
- **Action:**
  - [ ] Add PWA manifest to the React app (`vite-plugin-pwa`)
  - [ ] Add service worker for offline caching
  - [ ] Test installability on mobile Chrome

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
- **Status:** Deck says "TheHealthGheware" but PROJECT_SUMMARY.md says "Vision Guardians"
- **Action:**
  - [ ] Pick one team name and use it consistently everywhere

### 11. Project Name Inconsistency
- **Status:** Multiple names used across documents:
  - "DiabetCare AI" (deck, IDEA_SUBMISSION.md)
  - "Nazar AI" (React app, PROJECT_SUMMARY.md)
  - "Nazar AI (DiabetCare AI)" (some docs)
- **Action:**
  - [ ] Settle on primary name — the live app is branded "Nazar AI"
  - [ ] Update deck to reflect "Nazar AI" as primary with "DiabetCare AI" as subtitle/secondary if needed

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

| Category | Score | Notes |
|---|---|---|
| **Live Prototype** | 7/10 | Deployed, good UI, but AI features are simulated |
| **AWS Service Usage** | 4/10 | Only Amplify + Cognito + DynamoDB live; Bedrock/Rekognition/S3/Lambda not integrated |
| **Deck Completeness** | 8/10 | All slides present, well-structured; missing demo video link |
| **Documentation** | 9/10 | Extensive docs, research, cost analysis, specs |
| **Feature Coverage** | 5/10 | DR scan (simulated), home, community live; glucose/meal/chatbot/offline not functional |
| **AI Integration** | 2/10 | No actual AI running — this is the biggest gap for an AI hackathon |
| **Mobile/Accessibility** | 7/10 | Responsive, multilingual, high contrast; no PWA/offline |
| **Innovation** | 8/10 | Strong concept, India-specific, well-researched problem |

**Overall Assessment:** Strong concept and documentation, but the prototype needs real AI integration to be competitive in an AI hackathon. The #1 risk is judges testing the live app and finding no actual AI behind the features.

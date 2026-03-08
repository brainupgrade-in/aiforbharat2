# MVP Prototype Budget - Final

**Timeline:** 13 Days (Rapid Sprint)
**Total Cost:** ₹87,000
**Team:** Volunteer (Hackathon Participants)
**Funding:** Bootstrapped
**Status:** React MVP deployed — [https://main.d3vwqyp1h0elbo.amplifyapp.com/](https://main.d3vwqyp1h0elbo.amplifyapp.com/)
**Last Updated:** 2026-03-08

---

## Cost Breakdown

| Category | Amount | Details |
|----------|--------|---------|
| **👥 Team** | **₹0** | Volunteer hackathon participants (4-5 developers + 1 clinical advisor) |
| **☁️ AWS Infrastructure** | **₹50,000** | Bedrock + Rekognition + Amplify + DynamoDB + S3 + RDS (13 days) |
| **🗂️ Tools & Datasets** | **₹35,000** | Indian food database (₹20K) + Testing devices (₹15K) |
| **🔧 Miscellaneous** | **₹2,000** | Domain name, project tools |
| **TOTAL** | **₹87,000** | |

**Note:** AWS Activate credits may offset some/all AWS costs if application is approved post-hackathon selection.

---

## AWS Infrastructure Breakdown (₹50,000)

| Service | 13-Day Usage | Cost |
|---------|--------------|------|
| AWS Amplify Hosting | Build minutes + hosting | ₹5,000 |
| AWS Bedrock API | Claude 3 Haiku + Nova Pro (5M tokens) | ₹10,000 |
| Amazon Rekognition Custom Labels | Training (1 hour) + Inference (500 images) | ₹15,000 |
| Amazon S3 | Fundus images + meal photos storage | ₹5,000 |
| Amazon DynamoDB | User data, glucose logs (on-demand) | ₹5,000 |
| Amazon RDS PostgreSQL | Indian food database (db.t3.micro) | ₹5,000 |
| CloudWatch + Lambda | Monitoring + serverless functions | ₹5,000 |
| **TOTAL** | | **₹50,000** |

---

## 13-Day Sprint Schedule

| Days | Milestone | Budget Focus |
|------|-----------|--------------|
| **1-2** | AWS setup, authentication | Infrastructure setup |
| **3-4** | Core UI, dashboard | Amplify hosting begins |
| **5-6** | Glucose tracker | DynamoDB usage starts |
| **7-8** | AI chatbot (Bedrock) | Bedrock API calls |
| **9-10** | Meal analyzer (Nova Pro) | Bedrock + RDS active |
| **11** | DR screening (Rekognition) | Rekognition training (peak cost) |
| **12** | Testing & bug fixes | Testing devices |
| **13** | Demo video & submission | Documentation |

---

## Cost Comparison

| Metric | MVP (13 Days) | Production (6 Months) | Seed Round (18 Months) |
|--------|---------------|----------------------|------------------------|
| **Cost** | ₹87,000 | ₹1.02 Cr | ₹2.5 Cr |
| **Team** | Volunteers | 6 FTE | 8-10 FTE |
| **Users** | 50 testers | 10,000 | 500,000 |
| **Features** | Core 4 | Full platform | Full + advanced |
| **Goal** | Validate | Launch | Scale |

**Cost Efficiency:** MVP is **117x cheaper** than production (₹87K vs ₹1.02 Cr)

---

## What ₹87,000 Gets You

### ✅ Working MVP Features:

1. **AI Diabetic Retinopathy Screening**
   - Smartphone fundus image upload
   - Amazon Rekognition Custom Labels detection
   - Risk classification (5 levels)
   - >85% accuracy target

2. **Smart Glucose Tracker**
   - Manual glucose logging
   - Trend charts (Recharts)
   - Pattern detection (hypo/hyper alerts)
   - HbA1c estimation

3. **AI Meal Analyzer**
   - Photo upload (meal photos)
   - AWS Bedrock Nova Pro food recognition
   - Indian food database (100+ foods with GI)
   - Carb estimation & glucose spike prediction

4. **Diabetes Advisor Chatbot**
   - AWS Bedrock Claude 3 Haiku
   - Multilingual (English + Hindi)
   - 24/7 diabetes guidance
   - Conversation history

### ✅ Hackathon Deliverables:

- Working demo (deployed on AWS Amplify)
- Demo video (3-5 minutes)
- Presentation deck (investor-ready)
- Documentation (README, architecture diagrams)
- User testing results (30-50 patients)

---

## What ₹87,000 Does NOT Include

❌ Clinical validation study (1,000 patients) - ₹15-20L
❌ CDSCO SaMD approval - ₹3-5L
❌ ABDM integration - ₹5-10L
❌ Full-time team salaries - ₹42L (6 months)
❌ Marketing & partnerships - ₹13L
❌ Production infrastructure (500K users) - ₹6L AWS/year
❌ CGM integration - ₹5-8L
❌ Doctor/ASHA dashboards - ₹8-12L

**Total Post-Hackathon Investment:** ₹1.02 Cr (requires ₹2.5 Cr seed funding)

---

## Funding Strategy

### Phase 1: MVP (₹87K) - CURRENT
- **Source:** Personal investment (bootstrapped)
- **Timeline:** 13 days
- **Goal:** Validate concept, win hackathon

### Phase 2: Transition (₹5-10L) - IF HACKATHON WON
- **Source:** Hackathon prize
- **Timeline:** Months 2-3
- **Goal:** User testing expansion (100 patients), bug fixes, polish

### Phase 3: Production (₹1.02 Cr)
- **Sources:**
  - BIRAC grant: ₹50L (non-dilutive)
  - NITI Aayog: ₹25L (non-dilutive)
  - Angel/seed: ₹50-75L (10-15% equity)
- **Timeline:** Months 4-6
- **Goal:** Clinical validation, CDSCO approval, 10K users

### Phase 4: Scale (₹2.5 Cr seed round)
- **Source:** Seed funding (20% equity)
- **Timeline:** Months 7-18
- **Goal:** 500K users, government partnerships, revenue

---

## Risk Mitigation

### Risk 1: AWS Costs Higher Than Expected
- **Mitigation:** Monitor daily with AWS Budgets, optimize Bedrock usage
- **Contingency:** Apply for AWS Activate credits post-selection
- **Buffer:** ₹20K extra budget available if needed

### Risk 2: Indian Food Database Creation Expensive
- **Mitigation:** Start with top 50 foods (₹10K), expand later
- **Contingency:** Use free public GI data (ICMR, NIN)
- **Buffer:** Can reduce to ₹10K if needed

### Risk 3: Testing Devices Not Sufficient
- **Mitigation:** Use personal smartphones, borrow from testers
- **Contingency:** Use emulators for basic testing
- **Buffer:** ₹15K should cover 2-3 mid-range phones

### Risk 4: 13 Days Too Aggressive
- **Mitigation:** Strict scope (only 4 core features), daily standups
- **Contingency:** Extend by 2-3 days if critical bug found
- **Buffer:** Volunteer team flexible on timeline

---

## Success Metrics (13 Days)

### Technical:
- ✅ MVP deployed on AWS Amplify (public URL)
- ✅ All 4 core features functional
- ✅ DR detection >85% accuracy
- ✅ Chatbot response <3 seconds
- ✅ PWA installable on mobile

### User:
- ✅ 30-50 patient testers
- ✅ 60%+ task completion rate
- ✅ Positive feedback (3+ NPS)

### Business:
- ✅ Demo video ready (3-5 min)
- ✅ Pitch deck finalized
- ✅ Hackathon submitted on time
- ✅ ₹87K budget not exceeded

---

## Post-13-Day Plan

**If MVP Validates Concept:**

**Week 3-4:**
- User testing expansion (100 patients)
- Bug fixes and performance optimization
- AWS Activate credits application

**Month 2-3:**
- Apply for BIRAC grant (₹50L)
- Angel investor outreach
- Clinical validation study design

**Month 4-6:**
- Clinical validation (1,000 patients)
- CDSCO SaMD application
- Raise ₹2.5 Cr seed funding

**Month 7-18:**
- Production launch (10,000 users)
- Government partnerships (NPCDCS)
- Scale to 500K users

---

## Why ₹87,000 Budget Works

### 1. **Volunteer Team = ₹0 Labor Cost**
- Saves ₹2-3L that contract team would cost
- Hackathon participants motivated by prize/equity
- Full-time for 13 days = high productivity

### 2. **Focused Scope = Lower AWS Costs**
- 13 days vs 6 months = 93% less cloud usage time
- Only 4 core features (not 12+ features)
- Testing volume low (50 users vs 10K)

### 3. **Open Source Datasets = Free**
- Kaggle DR dataset (35,126 images) = ₹0
- Saves ₹5-10L proprietary dataset creation
- Community-validated quality

### 4. **Lean Approach = Fast Validation**
- Prove concept before ₹1 Cr investment
- 13-day sprint vs 6-month build
- ROI: ₹2.5 Cr funding ÷ ₹87K = **29x return**

---

## Competitive Benchmark

### Competitor MVP Costs:

| Company | MVP Cost | Time to MVP | Our Advantage |
|---------|----------|-------------|---------------|
| **BeatO** | ₹2-3 Cr | 12 months | We: 117x cheaper, 28x faster |
| **Fitterfly** | ₹5 Cr | 18 months | We: 575x cheaper, 42x faster |
| **Sugar.fit** | ₹1.5 Cr | 9 months | We: 172x cheaper, 21x faster |
| **Remidio** | ₹8-10 Cr | 24 months | We: 1,150x cheaper, 55x faster |
| **DiabetCare AI** | **₹87,000** | **13 days** | **Lean MVP approach** |

**Key Insight:** We're 117-1,150x more capital efficient by:
- Building MVP first (not full product)
- Using AWS AI services (no model training from scratch)
- Volunteer team (no upfront salaries)
- Open source datasets (no data collection cost)

---

## Budget Allocation Rationale

### Why ₹50K for AWS (57% of budget)?
- **Core enabler:** All 4 features need cloud infrastructure
- **Rekognition training:** ₹15K (most expensive single item)
- **Bedrock API:** ₹10K (chatbot + meal analyzer)
- **Storage & DB:** ₹15K (S3 + DynamoDB + RDS)
- **Hosting:** ₹5K (Amplify)
- **Monitoring:** ₹5K (CloudWatch + Lambda)

### Why ₹35K for Tools/Datasets (40% of budget)?
- **Indian food DB:** ₹20K (unique differentiation, 6-12 months for competitor to replicate)
- **Testing devices:** ₹15K (physical smartphones needed for fundus photography testing)

### Why Only ₹2K for Misc (3% of budget)?
- **Domain:** ₹2K (.ai premium domain)
- **SSL:** ₹0 (AWS provides free)
- **Tools:** ₹0 (Notion, Slack, GitHub free tiers)

**Total Budget:** ₹87K (lean, justified, achievable)

---

## Conclusion

**MVP Budget: ₹87,000**

**Funding Status:** ✅ Bootstrapped (personal investment)

**Timeline:** 13 days (rapid sprint)

**Goal:** Validate AI-powered diabetes management concept

**ROI if successful:** 29x (₹2.5 Cr seed funding ÷ ₹87K MVP cost)

**Risk if failed:** ₹87K loss (vs ₹1 Cr blind production build)

**Next Step:** Day 1 - AWS Cloud9 setup + team kickoff

---

**Last Updated:** 2026-01-25
**Phase:** MVP Prototype (13 Days)
**Total Investment Required:** ₹87,000
**Funding Secured:** ✅ Yes (bootstrapped)

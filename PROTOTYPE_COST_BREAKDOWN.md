# Prototype Development Cost - DiabetCare AI MVP

**Phase:** Hackathon (7 Weeks)
**Deliverable:** Working MVP with core features
**Timeline:** Week 1 (Done) → Week 7 (Demo submission)

---

## Cost Summary

| Scenario | Total Cost | Notes |
|----------|-----------|-------|
| **Volunteer Team** | **₹47,000 - ₹87,000** | Recommended for hackathon |
| **Contract Team** | **₹6.47 - ₹10.87 lakh** | If hiring professional developers |

---

## Detailed Cost Breakdown

### 1. Team Costs

**Option A: Volunteer Team (Recommended for Hackathon)**
- **Cost:** ₹0
- **Team Composition:**
  - 2 Full-stack developers (hackathon participants)
  - 1 ML/AI engineer (hackathon participant)
  - 1 UI/UX designer (hackathon participant)
  - 1 Endocrinologist (advisor/consultant - volunteer)
- **Duration:** 7 weeks (part-time, evenings/weekends)
- **Total:** **₹0**

**Option B: Contract Team (If Not Hackathon)**
- 2 Full-stack developers @ ₹1.5 lakh/month × 2 months = **₹6 lakh**
- 1 ML engineer @ ₹1.5 lakh/month × 2 months = **₹3 lakh**
- 1 UI/UX designer @ ₹50,000/month × 2 months = **₹1 lakh**
- **Total:** **₹10 lakh**

---

### 2. AWS Infrastructure Costs

**Gross AWS Costs:**

| Service | Usage | Cost |
|---------|-------|------|
| **AWS Amplify Hosting** | Build minutes + hosting (7 weeks) | ₹5,000 |
| **AWS Bedrock API** | Claude 3 Haiku + Nova Pro (10M tokens testing) | ₹10,000 |
| **Amazon Rekognition Custom Labels** | Training (1-2 hours) + Inference (1,000 test images) | ₹20,000 |
| **Amazon S3** | Storage for DR images, meal photos, ML models | ₹3,000 |
| **Amazon DynamoDB** | On-demand, testing data (low volume) | ₹2,000 |
| **Amazon RDS PostgreSQL** | db.t3.micro for Indian food database | ₹5,000 |
| **Amazon CloudWatch** | Logs, metrics, monitoring | ₹2,000 |
| **AWS Lambda** | API calls, serverless functions | ₹3,000 |
| **TOTAL AWS** | | **₹50,000** |

**Less: AWS Credits**
- **AWS Activate Credits:** -₹50,000 ($5,000 for startups)
- **Hackathon Credits:** May provide additional credits

**Net AWS Cost:** **₹0 - ₹10,000**

---

### 3. Tools & Datasets

| Item | Cost | Notes |
|------|------|-------|
| **Kaggle DR Dataset** | ₹0 | Free (35,126 fundus images, open source) |
| **Indian Food Database Creation** | ₹20,000 | Nutrition research, GI lab data collection, 100+ foods |
| **Testing Devices** | ₹15,000 | 2-3 smartphones for testing fundus photography, meal photos |
| **TOTAL** | **₹35,000** | |

---

### 4. Miscellaneous

| Item | Cost | Notes |
|------|------|-------|
| **Domain Name (diabetcare.ai)** | ₹2,000/year | .ai domain premium pricing |
| **SSL Certificate** | ₹0 | AWS Amplify provides free SSL/TLS |
| **Project Management Tools** | ₹0 | Notion (free), Slack (free tier) |
| **GitHub** | ₹0 | Free for public repos |
| **TOTAL** | **₹2,000** | |

---

## GRAND TOTAL (7 Weeks MVP)

### Volunteer Team Scenario (Recommended):
```
Team:              ₹0
AWS (net):         ₹0-10,000
Tools & Datasets:  ₹35,000
Miscellaneous:     ₹2,000
─────────────────────────
TOTAL:             ₹47,000 - ₹87,000
```

### Contract Team Scenario:
```
Team:              ₹10,00,000
AWS (net):         ₹0-10,000
Tools & Datasets:  ₹35,000
Miscellaneous:     ₹2,000
─────────────────────────
TOTAL:             ₹10,47,000 - ₹10,87,000
```

---

## Funding Sources (MVP Phase)

### Available Funding:

1. **AWS Activate Credits:** ₹4.2 lakh ($5,000)
   - Covers: All AWS infrastructure costs (Bedrock, Rekognition, Amplify, etc.)
   - Duration: 12-24 months
   - **Status:** Apply after hackathon idea selection

2. **Personal Investment:** ₹50,000 - ₹1 lakh
   - Covers: Domain name, Indian food database, testing devices
   - **Status:** Bootstrapped

3. **Hackathon Prize (If Won):** ₹5-10 lakh
   - Covers: Transition to production, team expansion
   - **Status:** Contingent on winning

4. **Volunteer Team:** ₹0 (saves ₹6-10 lakh)
   - **Status:** Hackathon participants

5. **Open Source Datasets:** ₹0 (saves ₹5-10 lakh)
   - Kaggle DR dataset (35,126 images)
   - **Status:** Already available

### Total Funding Available:
```
AWS Credits:        ₹4.2 lakh
Personal:           ₹0.5-1 lakh
Hackathon Prize:    ₹5-10 lakh (if won)
─────────────────────────────
TOTAL:              ₹4.7 - 15.2 lakh ✓ SUFFICIENT
```

**Conclusion:** MVP is fully funded with AWS credits + minimal personal investment.

---

## Cost Comparison: MVP vs Production

| Metric | MVP (7 Weeks) | Production (6 Months) | Ratio |
|--------|---------------|----------------------|-------|
| **Cost** | ₹0.47-10.87L | ₹1.02 Cr | **10-100x cheaper** |
| **Team** | 4-6 volunteers | 6 full-time | Part-time → Full-time |
| **Users** | 50 testers | 10,000 users | Validation → Scale |
| **Features** | Core 4 features | Full platform | Essential → Complete |
| **AWS Usage** | Testing volume | Production volume | Low → High |
| **Timeline** | 7 weeks | 6 months | Rapid → Comprehensive |
| **Goal** | Prove concept | Launch product | Validation → Market fit |

**Key Insight:** MVP is 10-100x more cost-efficient than jumping directly to production.

---

## What MVP Budget INCLUDES:

✅ **Working prototype** with core features:
- AI Diabetic Retinopathy Screening (Rekognition Custom Labels)
- Smart Glucose Tracker (manual logging, charts)
- AI Meal Analyzer (Bedrock Nova Pro, Indian food DB)
- Diabetes Advisor Chatbot (Bedrock Claude 3 Haiku)

✅ **AWS AI integration:**
- AWS Bedrock (Claude 3 Haiku + Nova Pro)
- Amazon Rekognition Custom Labels (DR detection)
- AWS Amplify Gen 2 (full-stack framework)

✅ **User testing:**
- 20-50 diabetic patient testers
- Usability feedback
- Bug fixes based on feedback

✅ **Documentation:**
- README with screenshots
- Architecture diagrams
- API documentation
- Demo video (3-5 minutes)

✅ **Presentation:**
- Pitch deck finalized
- Business model validated
- Impact metrics calculated

---

## What MVP Budget EXCLUDES (Post-Hackathon):

❌ **Clinical validation study** (1,000 patients) - ₹15-20 lakh
❌ **CDSCO SaMD approval** - ₹3-5 lakh
❌ **ABDM integration** (ABHA login, HIE/HIP/HIU) - ₹5-10 lakh
❌ **Full-time team** (6 FTE for 6 months) - ₹42 lakh
❌ **Marketing & partnerships** - ₹13 lakh
❌ **Production infrastructure** (500K users) - ₹6 lakh AWS
❌ **CGM integration** (Abbott, Dexcom) - ₹5-8 lakh
❌ **Doctor/ASHA dashboards** - ₹8-12 lakh

**Total Post-Hackathon Cost:** ₹1.02 crore (requires ₹1.5-2 Cr seed funding)

---

## Milestone-Based Budget Allocation

### Week 1: ✅ DONE (₹2,000 spent)
- Repository setup
- Wireframes & documentation
- Research validation
- **Spent:** Domain name (₹2,000)

### Week 2-3: AWS Setup & Authentication (₹10,000)
- AWS Cloud9 environment
- AWS Amplify Gen 2 initialization
- Cognito authentication
- **Budget:** ₹10,000 (AWS credits)

### Week 3-4: Glucose Tracker + Chatbot (₹15,000)
- DynamoDB schema
- Bedrock Claude 3 Haiku integration
- UI development
- **Budget:** ₹15,000 (AWS credits + volunteer time)

### Week 5: Meal Analyzer + DR Screening (₹40,000)
- Rekognition Custom Labels training
- Bedrock Nova Pro integration
- Indian food database setup
- **Budget:** ₹40,000 (₹20K AWS + ₹20K food DB)

### Week 6: Testing & Optimization (₹15,000)
- User testing (20-50 patients)
- Performance optimization
- Bug fixes
- **Budget:** ₹15,000 (testing devices)

### Week 7: Documentation & Submission (₹5,000)
- README completion
- Demo video production
- Presentation finalization
- **Budget:** ₹5,000 (volunteer time + tools)

**Total 7-Week Budget:** ₹87,000 (with AWS credits offset)

---

## Cost Efficiency Analysis

### Cost per Feature (MVP):

| Feature | Cost | Breakdown |
|---------|------|-----------|
| **DR Screening** | ₹20,000 | Rekognition training + inference |
| **Glucose Tracker** | ₹5,000 | DynamoDB + UI development |
| **Meal Analyzer** | ₹30,000 | Nova Pro + Indian food DB (₹20K) |
| **AI Chatbot** | ₹10,000 | Bedrock Claude 3 Haiku |
| **Infrastructure** | ₹15,000 | Amplify + S3 + CloudWatch |
| **Testing** | ₹15,000 | Devices + user testing |
| **Misc** | ₹2,000 | Domain, tools |
| **TOTAL** | **₹97,000** | Gross cost (before AWS credits) |

**After AWS Credits:** ₹47,000 (₹50K offset)

### Cost per User (MVP):
- **Users tested:** 50
- **Cost:** ₹47,000
- **Cost per user:** ₹940/user
- **Note:** One-time validation cost, drops to ₹12/user in production (AWS only)

### ROI on MVP Investment:

**If MVP validates concept:**
- Unlock ₹1.5-2 Cr seed funding
- ROI: ₹1.5 Cr / ₹0.47 Lakh = **320x return**
- OR: Save ₹1 Cr by not building full product that fails

**If MVP fails to validate:**
- Loss: ₹47,000-87,000 (minimal)
- Learning: Priceless (what NOT to build)
- Time saved: 6-12 months + ₹1 Cr

**Conclusion:** MVP is a high-ROI, low-risk investment.

---

## Risk Mitigation for Budget Overruns

### Potential Cost Overruns:

**Risk 1: AWS Costs Exceed Budget**
- **Likelihood:** Low (AWS credits cover 12-24 months)
- **Mitigation:**
  - Use AWS Budgets (set alerts at ₹10K, ₹20K, ₹30K)
  - Optimize Bedrock usage (cache responses, rate limiting)
  - Use Haiku (cheaper) instead of Sonnet for chatbot
- **Contingency:** Personal investment buffer (₹50K-1L)

**Risk 2: Indian Food Database Creation Expensive**
- **Likelihood:** Medium (₹20K estimate may be low)
- **Mitigation:**
  - Start with top 50 foods (₹10K)
  - Expand to 100 foods over 3 months
  - Use existing public GI data (ICMR, NIN)
- **Contingency:** Reduce to ₹10K, expand post-funding

**Risk 3: Testing Devices Needed Beyond Budget**
- **Likelihood:** Low
- **Mitigation:**
  - Use personal smartphones
  - Borrow devices from testers
  - Use emulators for basic testing
- **Contingency:** ₹15K should cover 2-3 mid-range phones

**Risk 4: Volunteer Team Drops Out**
- **Likelihood:** Medium
- **Impact:** High (may need contract team = ₹6-10L)
- **Mitigation:**
  - Clear commitment from team (7-week contract)
  - Backup team members identified
  - Split equity/prize money as incentive
- **Contingency:** Hackathon prize covers contract team if needed

**Total Risk Buffer:** ₹50K-1L (personal investment)

---

## Funding Strategy (Post-MVP)

**After MVP Validates Concept (Week 8+):**

### Step 1: Apply for Grants (Non-Dilutive) - ₹75 lakh
1. **BIRAC (Biotechnology Industry Research Assistance Council):** ₹50 lakh
   - Timeline: 3-6 months
   - Requirements: Clinical validation plan, regulatory roadmap

2. **NITI Aayog Innovation Fund:** ₹25 lakh
   - Timeline: 4-8 months
   - Requirements: Social impact metrics, government partnership plan

### Step 2: AWS Activate Expansion - ₹85 lakh credits
- **AWS Activate Portfolio:** $100,000 (₹85 lakh AWS credits)
- Timeline: After seed funding raise
- Covers: 12-24 months of production AWS costs

### Step 3: Pre-Revenue Government Pilots - ₹10-20 lakh
- NPCDCS pilot (1 district, 10,000 screenings @ ₹100) = ₹10 lakh
- Timeline: 3-6 months after MVP

### Step 4: Angel/Seed Round - ₹50-75 lakh (10-15% equity)
- **Valuation:** ₹5-7 Cr (based on MVP traction, government LOIs)
- **Dilution:** 10-15% equity
- **Timeline:** 6-9 months after MVP

### Step 5: CSR Funding - ₹25 lakh (Non-Dilutive)
- Pharma companies (Novo Nordisk, Sanofi): ₹10-15 lakh
- IT companies (TCS, Infosys CSR): ₹10 lakh
- Timeline: 6-12 months

**Total Funding Target (Production):** ₹1.5-2 crore (18-month runway)

---

## Comparison with Competitors

### Startup Cost Benchmarks:

| Company | Initial Funding | Time to MVP | MVP Cost | Our Advantage |
|---------|----------------|-------------|----------|---------------|
| **BeatO** | ₹5 Cr (Seed) | 12 months | ₹2-3 Cr | We: ₹47K, 7 weeks |
| **Fitterfly** | ₹10 Cr (Series A) | 18 months | ₹5 Cr | 100x cheaper MVP |
| **Sugar.fit** | ₹3 Cr (Seed) | 9 months | ₹1.5 Cr | 30x cheaper MVP |
| **Remidio** | ₹15 Cr (Series A) | 24 months | ₹8-10 Cr | 170x cheaper MVP |
| **DiabetCare AI** | **₹0.47-10.87L** | **7 weeks** | **₹0.47-10.87L** | **Lean MVP approach** |

**Key Insight:** We're 30-170x more capital efficient by building MVP first, validating, then raising.

---

## Conclusion

### Why This Budget Works:

✅ **Lean & Focused:** Only essential features (DR + Glucose + Meals + Chatbot)
✅ **AWS Credits:** 100% cloud costs covered ($5,000 Activate credits)
✅ **Volunteer Team:** ₹0 upfront (vs. ₹6-10L contract team)
✅ **Open Source:** Free datasets (Kaggle DR - 35K images)
✅ **Rapid Validation:** 7 weeks (vs. 12-24 months competitors)
✅ **Low Risk:** ₹47K-87K total investment (not ₹1 Cr blind build)
✅ **High ROI:** Unlock ₹1.5-2 Cr funding OR save ₹1 Cr failed product

### Next Steps:

1. ✅ **Week 1 Done:** Wireframes, documentation, research
2. **Week 2-3:** AWS setup, authentication, glucose tracker
3. **Week 4:** AI chatbot (Bedrock integration)
4. **Week 5:** Meal analyzer + DR screening (Rekognition training)
5. **Week 6:** User testing (20-50 diabetic patients)
6. **Week 7:** Demo video, presentation, submission

---

**Budget Status:** ✅ **FULLY FUNDED**

- AWS Credits: ₹4.2 lakh (covers 100% cloud costs)
- Personal Investment: ₹47K-87K (affordable for bootstrapped startup)
- Total Available: ₹4.7-15.2 lakh (including potential hackathon prize)

**Ready to build! 🚀**

---

**Last Updated:** 2026-01-25
**Phase:** MVP (Hackathon - 7 Weeks)
**Next Milestone:** Week 2 - AWS Amplify Setup

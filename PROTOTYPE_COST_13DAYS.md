# Prototype Development Cost - 13 Days MVP

**Hackathon Timeline:** 13 Days (Rapid Prototype)
**Deliverable:** Working MVP with core AI features
**Target:** AWS AI for Bharat Hackathon 2026
**Status:** React MVP deployed — [https://main.d3vwqyp1h0elbo.amplifyapp.com/](https://main.d3vwqyp1h0elbo.amplifyapp.com/)
**Last Updated:** 2026-03-08

---

## Updated Cost Summary (13 Days)

| Scenario | Total Cost | Notes |
|----------|-----------|-------|
| **Volunteer Team** | **₹37,000** | Recommended for hackathon |
| **Contract Team** | **₹3.37 lakh** | If hiring professional developers |

---

## Detailed Cost Breakdown

### 1. Team Costs (13 Days Full-Time)

**Option A: Volunteer Team (Recommended)**
- **Cost:** ₹0
- **Team Composition:**
  - 2 Full-stack developers (hackathon participants)
  - 1 ML/AI engineer (hackathon participant)
  - 1 UI/UX designer (hackathon participant)
  - 1 Endocrinologist (advisor - volunteer)
- **Duration:** 13 days full-time (intensive sprint)
- **Total:** **₹0**

**Option B: Contract Team**
- 2 Full-stack developers @ ₹6,000/day × 13 days = **₹1,56,000**
- 1 ML engineer @ ₹7,000/day × 13 days = **₹91,000**
- 1 UI/UX designer @ ₹4,000/day × 13 days = **₹52,000**
- **Total:** **₹2,99,000 (~₹3 lakh)**

---

### 2. AWS Infrastructure Costs

**Gross AWS Costs (13 Days):**

| Service | Usage | Cost |
|---------|-------|------|
| **AWS Amplify Hosting** | Build minutes + hosting (13 days) | ₹5,000 |
| **AWS Bedrock API** | Claude 3 Haiku + Nova Pro (5M tokens) | ₹8,000 |
| **Amazon Rekognition Custom Labels** | Training (1 hour) + Inference (500 images) | ₹12,000 |
| **Amazon S3** | Storage for images, models | ₹2,000 |
| **Amazon DynamoDB** | On-demand testing | ₹2,000 |
| **Amazon RDS PostgreSQL** | db.t3.micro | ₹3,000 |
| **Amazon CloudWatch + Lambda** | Logs, metrics, functions | ₹3,000 |
| **TOTAL AWS** | | **₹35,000** |

**Less: AWS Activate Credits**
- **AWS Activate:** -₹35,000 (covers all MVP costs)

**Net AWS Cost:** **₹0**

---

### 3. Tools & Datasets

| Item | Cost | Notes |
|------|------|-------|
| **Kaggle DR Dataset** | ₹0 | Free (35,126 fundus images) |
| **Indian Food Database** | ₹20,000 | Nutrition data for 100+ foods |
| **Testing Devices** | ₹15,000 | 2-3 smartphones for testing |
| **TOTAL** | **₹35,000** | |

---

### 4. Miscellaneous

| Item | Cost |
|------|------|
| **Domain Name** | ₹2,000 |
| **SSL Certificate** | ₹0 (AWS Amplify free) |
| **Tools (Notion, Slack)** | ₹0 (free tiers) |
| **TOTAL** | **₹2,000** |

---

## GRAND TOTAL (13 Days MVP)

### Volunteer Team Scenario (Recommended):
```
Team (13 days):    ₹0
AWS (net):         ₹0 (covered by Activate credits)
Tools & Datasets:  ₹35,000
Miscellaneous:     ₹2,000
─────────────────────────
TOTAL:             ₹37,000
```

### Contract Team Scenario:
```
Team (13 days):    ₹3,00,000
AWS (net):         ₹0
Tools & Datasets:  ₹35,000
Miscellaneous:     ₹2,000
─────────────────────────
TOTAL:             ₹3,37,000
```

---

## 13-Day Sprint Schedule

**Day 1-2: Setup & Foundation**
- AWS Cloud9 environment setup
- AWS Amplify Gen 2 initialization
- GitHub repository structure
- Team onboarding

**Day 3-4: Authentication & Core UI**
- Amplify Auth (Cognito)
- React UI with TailwindCSS
- Dashboard layout
- PWA setup

**Day 5-6: Glucose Tracker**
- DynamoDB schema
- Glucose logging UI
- Charts (Recharts)
- Pattern detection

**Day 7-8: AI Chatbot**
- AWS Bedrock integration (Claude 3 Haiku)
- Chat UI
- Multilingual support (English + Hindi)

**Day 9-10: Meal Analyzer**
- AWS Bedrock Nova Pro integration
- Indian food database setup (PostgreSQL)
- Meal photo upload (S3)
- Carb estimation

**Day 11: DR Screening**
- Amazon Rekognition Custom Labels training
- Fundus image upload
- DR risk classification
- Results display

**Day 12: Testing & Bug Fixes**
- User testing (20-30 patients)
- Performance optimization
- Security audit
- Cross-browser testing

**Day 13: Documentation & Demo**
- README completion
- Demo video recording
- Presentation finalization
- Hackathon submission

---

## Cost Comparison: 13 Days vs Production

| Metric | MVP (13 Days) | Production (6 Months) | Ratio |
|--------|---------------|----------------------|-------|
| **Cost** | ₹0.37-3.37L | ₹1.02 Cr | **30-280x cheaper** |
| **Team** | 4-5 people | 6 FTE | Volunteers → Full-time |
| **Users** | 30-50 testers | 10,000 users | Validation → Scale |
| **Features** | Core 4 | Full platform | Essential → Complete |
| **Timeline** | 13 days | 6 months | Sprint → Launch |

---

## Funding Sources (Covers 100% of MVP Cost)

**Available Funding:**

1. **AWS Activate Credits:** ₹4.2 lakh ($5,000)
   - Covers: All AWS costs + buffer
   - Status: Apply after hackathon selection

2. **Personal Investment:** ₹37,000
   - Covers: Tools, datasets, domain
   - Status: Bootstrapped

3. **Hackathon Prize:** ₹5-10 lakh (if won)
   - Use for: Production transition
   - Status: Contingent

**Total Available: ₹4.57-14.57 lakh**

**Conclusion:** ✅ **FULLY FUNDED** (₹37K needed, ₹4.57L+ available)

---

## Key Advantages of 13-Day Sprint

### 1. **Speed to Market**
- 13 days (vs 7 weeks = 49 days)
- **73% faster** than original plan
- Validates concept in 2 weeks

### 2. **Lower Cost**
- ₹37K (vs ₹47K for 7-week plan)
- **21% cheaper** due to:
  - Less AWS usage (13 days vs 49 days)
  - Smaller testing scope (30 vs 50 users)
  - Focused features only

### 3. **Higher Intensity**
- Full-time for 13 days (vs part-time 7 weeks)
- Better team focus and momentum
- Faster iteration cycles

### 4. **Ideal for Hackathon**
- Most hackathons are 1-2 week events
- Aligns with AWS AI for Bharat timeline
- Demonstrates rapid prototyping capability

---

## What 13 Days INCLUDES:

✅ **Working MVP** with AWS AI integration:
- AI Diabetic Retinopathy Screening (Rekognition)
- Smart Glucose Tracker (DynamoDB + Charts)
- AI Meal Analyzer (Bedrock Nova Pro)
- Diabetes Chatbot (Bedrock Claude 3 Haiku)

✅ **User Validation:**
- 30-50 diabetic patient testers
- Usability feedback
- Core feature testing

✅ **Hackathon Deliverables:**
- Working demo (deployed on AWS Amplify)
- Demo video (3-5 minutes)
- Presentation deck
- Documentation (README, architecture)

---

## What 13 Days EXCLUDES (Post-Hackathon):

❌ Clinical validation study (1,000 patients)
❌ CDSCO SaMD approval
❌ ABDM integration
❌ CGM integration
❌ Doctor/ASHA dashboards
❌ Production infrastructure (500K users)
❌ Marketing campaigns
❌ Government partnerships

**These require:** ₹1.02 Cr production budget (6-12 months)

---

## Risk Mitigation for 13-Day Sprint

### Challenge 1: Aggressive Timeline
- **Risk:** Features incomplete in 13 days
- **Mitigation:**
  - Strict scope (only 4 core features)
  - Daily standups (track progress)
  - Pre-built components (shadcn/ui, Amplify templates)
  - Parallel development (frontend + backend)

### Challenge 2: Team Burnout
- **Risk:** Full-time for 13 days is intense
- **Mitigation:**
  - Volunteer team (motivated by hackathon)
  - Clear daily goals (achievable targets)
  - Rest on Day 7 (mid-sprint break)
  - Pair programming (shared load)

### Challenge 3: AWS Learning Curve
- **Risk:** Team unfamiliar with Bedrock/Rekognition
- **Mitigation:**
  - AWS documentation study (Days 1-2)
  - Amazon Q Developer (AI code assistant)
  - AWS tutorials (Amplify Gen 2, Bedrock)
  - Fallback to simpler AWS services if needed

---

## Success Metrics (13 Days)

**Technical:**
- ✅ MVP deployed on AWS Amplify
- ✅ All 4 core features functional
- ✅ DR detection >85% accuracy (vs 92% production target)
- ✅ Chatbot response <3 seconds
- ✅ PWA installable on mobile

**User:**
- ✅ 30+ patient testers
- ✅ 60%+ task completion rate
- ✅ 3+ NPS score (neutral to positive)

**Business:**
- ✅ Demo video ready
- ✅ Pitch deck finalized
- ✅ Hackathon submitted on time

---

## Post-13-Day Roadmap

**If Hackathon Won (Prize: ₹5-10L):**

**Weeks 3-4 (Post-submission):**
- User testing expansion (100 patients)
- Bug fixes and polish
- Performance optimization

**Months 2-3:**
- Apply for BIRAC grant (₹50L)
- AWS Activate Portfolio ($100K credits)
- Angel investor outreach

**Months 4-6:**
- Clinical validation study (1,000 patients)
- CDSCO SaMD application
- Raise ₹1.5-2 Cr seed funding

**Months 7-12:**
- Production launch (10,000 users)
- Government partnerships (NPCDCS)
- Revenue generation (B2G + B2C)

---

## Conclusion

**13-Day MVP Budget: ₹37,000 - ₹3.37 lakh**

**Why This Works:**
- ✅ AWS credits cover 100% cloud costs
- ✅ Volunteer team = ₹0 upfront
- ✅ Focused scope (4 features only)
- ✅ 13-day sprint = high intensity, low cost
- ✅ Validates concept before ₹1 Cr production investment

**Funding Status:** ✅ **SECURED**
- Need: ₹37K
- Have: ₹4.57L+ (AWS credits + personal)
- **12x overfunded**

**Ready to execute! 🚀**

---

**Timeline:**
- **Days 1-13:** Build MVP (₹37K-3.37L)
- **Months 2-6:** Validate + raise funding (₹1.5-2 Cr)
- **Months 7-18:** Production launch (₹2.5 Cr seed round)

**Next Step:** Start Day 1 - AWS Cloud9 setup + team kickoff meeting

---

**Last Updated:** 2026-01-25
**Phase:** Hackathon MVP (13 Days)
**Budget:** ₹37,000 (Volunteer) | ₹3.37L (Contract)

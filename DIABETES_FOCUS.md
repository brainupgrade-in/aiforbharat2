# Diabetes-Only Focus Document

## Project Scope: DiabetCare AI

**Last Updated:** 2026-03-08
**Status:** React MVP Deployed — [https://main.d3vwqyp1h0elbo.amplifyapp.com/](https://main.d3vwqyp1h0elbo.amplifyapp.com/)
**Target NCD:** Diabetes Mellitus (Type 1 & Type 2) ONLY

---

## Executive Decision: Why Diabetes Only?

### Strategic Rationale

After comprehensive analysis of India's NCD landscape, we have strategically narrowed our focus to **diabetes and its complications exclusively**. This decision is based on:

1. **Massive Scale:** 89.8 million diabetics ([IDF Atlas 11th Edition, 2025](https://diabetesatlas.org/)) - world's 2nd largest population
2. **Economic Impact:** ₹2-3 lakh crore annual burden (40-50% develop complications)
3. **Preventable Complications:** Up to 90% of blindness from diabetic retinopathy is preventable with timely screening and treatment ([WHO](https://www.emro.who.int/noncommunicable-diseases/highlights/eyes-on-diabetes.html))
4. **Technology Readiness:** AI DR screening is clinically validated (92%+ sensitivity, 88%+ specificity)
5. **Market Opportunity:** 225M total addressable market (89.8M diabetics + 136M pre-diabetics)
6. **Government Alignment:** NP-NCD (formerly NPCDCS) with 682 District NCD Clinics established ([NHM](https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=1048&lid=604))

### Removed from Scope

The following NCDs and conditions have been **explicitly removed** from the project scope:

❌ **Cardiovascular Diseases** (hypertension, heart disease, stroke)
❌ **Cancer** (all types)
❌ **Chronic Respiratory Diseases** (asthma, COPD)
❌ **Mental Health** (anxiety, depression - completely separate use case)
❌ **Pregnancy/Maternal Health** (pregnancy risk assessment, ASHA worker support)
❌ **Tuberculosis** (TB detection)

**Blood Pressure Monitoring:** Originally included in research, but **deprioritized** to maintain diabetes-only focus. May be reconsidered in Phase 3 if diabetes + hypertension comorbidity tracking is required.

---

## In-Scope Diabetes Features

### Primary Features (MVP)

1. **Diabetic Retinopathy (DR) Screening** ✅ IMPLEMENTED
   - Smartphone camera fundus image capture with optical guide overlay
   - Multi-step workflow: patient ID → camera → quality check → analysis → results
   - Risk classification: No DR, Mild NPDR, Moderate NPDR, Severe NPDR, Proliferative DR
   - Patient mode (simplified) + Doctor mode (clinical details with lesion analysis)
   - Lotus flower severity indicator (0-4 petals)
   - GPS-based nearby doctor finder + WhatsApp result sharing
   - AI analysis pipeline: Amazon Rekognition Custom Labels (integration in progress)
   - Target: Sensitivity >92%, Specificity >88% (based on AIDRSS study)

2. **Glucose Tracker** ✅ DATA MODEL READY
   - Manual blood glucose entry (fasting, post-meal, random)
   - HbA1c estimation from average glucose
   - Trend visualization (7-day, 30-day, 90-day)
   - Pattern detection (hypo/hyperglycemia, dawn phenomenon)
   - Export reports for doctors

3. **AI Meal Analyzer** ✅
   - Photo-based food recognition (AWS Bedrock Nova Pro)
   - Carbohydrate estimation for Indian foods
   - Glycemic index (GI) database (100+ traditional foods)
   - Post-meal glucose prediction
   - Nutrition tracking

4. **AI Diabetes Advisor Chatbot** ✅
   - AWS Bedrock Claude 3 Haiku
   - Multilingual (English + Hindi minimum)
   - 24/7 diabetes education and guidance
   - Medication reminders
   - **NOT a replacement for doctors** (clear disclaimers)

5. **Complication Risk Assessment** ✅
   - Diabetic retinopathy (via AI screening)
   - Diabetic foot ulcer risk (questionnaire-based)
   - Diabetic nephropathy risk (based on duration, BP, glucose control)
   - Cardiovascular risk calculator (diabetes-specific)

### Secondary Features (Phase 2 - Post-MVP)

6. **CGM Integration**
   - Support for Abbott FreeStyle Libre, Dexcom, BeatO Active CGM
   - Real-time glucose monitoring
   - Predictive alerts (hypo/hyperglycemia)
   - Time-in-range (TIR) tracking

7. **Doctor Dashboard**
   - Healthcare provider portal
   - View patient glucose trends
   - Review DR screening results
   - Telemedicine integration (eSanjeevani)

8. **ASHA Worker Dashboard**
   - Community health worker training
   - Population-level diabetes screening
   - High-risk patient identification
   - Integration with NPCDCS programs

9. **ABDM Integration**
   - Ayushman Bharat Health Account (ABHA) compatible
   - Health Information Provider (HIP) compliance
   - Interoperable health records

---

## Target Users (Diabetes-Specific)

### Primary Users

1. **Type 2 Diabetics (85-90% of cases)**
   - Age: 30-70 years
   - Urban + Rural
   - Self-managing with oral medications
   - Need: Glucose tracking, complication screening, lifestyle guidance

2. **Pre-Diabetics (136 million in India)**
   - Age: 25-60 years
   - At risk of developing diabetes
   - Need: Prevention guidance, lifestyle modification, risk assessment

3. **Type 1 Diabetics (941,000 in India)**
   - Age: Children, adolescents, young adults
   - Insulin-dependent
   - Need: Advanced glucose tracking, CGM integration, tight control

### Secondary Users

4. **Family Caregivers**
   - Help elderly diabetics manage glucose
   - Monitor complications
   - Coordinate doctor visits

5. **Healthcare Providers**
   - Endocrinologists, diabetologists
   - General physicians managing diabetes
   - Ophthalmologists (DR screening referrals)

6. **ASHA Workers / Community Health Workers**
   - Rural diabetes screening
   - Patient education
   - NPCDCS program implementation

---

## Clinical Conditions Covered (Diabetes-Specific)

### Primary Condition

**Diabetes Mellitus:**
- Type 1 Diabetes (Insulin-dependent)
- Type 2 Diabetes (Non-insulin-dependent, most common)
- Gestational Diabetes (pregnancy-related, future consideration)
- Pre-diabetes / Impaired Glucose Tolerance

### Diabetes Complications (In Scope)

**Microvascular Complications:**
1. **Diabetic Retinopathy** (PRIMARY FOCUS)
   - Non-proliferative DR (NPDR): Mild, Moderate, Severe
   - Proliferative DR (PDR)
   - Diabetic Macular Edema (DME)
   - **AI Detection:** Amazon Rekognition Custom Labels

2. **Diabetic Nephropathy (Kidney Disease)**
   - Risk assessment based on:
     - Diabetes duration
     - Blood pressure control
     - Glucose control (HbA1c)
     - Albuminuria (if available)
   - **No AI imaging** (requires lab tests)
   - **Risk calculator + education**

3. **Diabetic Neuropathy (Nerve Damage)**
   - Peripheral neuropathy (numbness, tingling in feet)
   - Autonomic neuropathy (digestive, cardiovascular issues)
   - **Symptom checker questionnaire**
   - **Foot ulcer risk assessment**

**Macrovascular Complications:**
4. **Cardiovascular Disease Risk**
   - Diabetes-specific CVD risk calculator
   - Based on: Age, diabetes duration, smoking, BP, cholesterol, HbA1c
   - **Educational content only** (not CVD diagnosis)

5. **Diabetic Foot Ulcers**
   - Risk assessment questionnaire:
     - Loss of sensation?
     - Previous ulcers?
     - Foot deformities?
     - Poor circulation?
   - **Future:** Image-based foot ulcer detection (Phase 3)

### Explicitly Out of Scope

❌ Non-diabetes conditions (hypertension alone, heart disease alone, cancer, respiratory diseases, mental health)
❌ Infectious diseases (TB, COVID-19)
❌ Maternal health (unless gestational diabetes)
❌ Chronic kidney disease (unless diabetic nephropathy)
❌ Generic health tracking (steps, sleep) - only if relevant to diabetes management

---

## Technology Stack (Diabetes-Optimized)

### AI/ML Models (Diabetes-Specific)

1. **Diabetic Retinopathy Detection:**
   - **Platform:** Amazon Rekognition Custom Labels
   - **Training Data:** Kaggle Diabetic Retinopathy Detection dataset (35,126 images)
   - **Labels:** 5 classes (No DR, Mild, Moderate, Severe, Proliferative)
   - **Target Accuracy:** >92% sensitivity, >88% specificity
   - **Deployment:** Cloud-based (requires internet for image upload)

2. **Meal Recognition & Carb Estimation:**
   - **Platform:** AWS Bedrock - Amazon Nova Pro (multimodal LLM)
   - **Indian Food Database:** PostgreSQL with 100+ traditional foods
   - **Fields:** Food name, carbohydrates (g), glycemic index, portion sizes
   - **Examples:** Roti, rice, dal, sabzi, idli, dosa, paratha, biryani, etc.

3. **Glucose Prediction:**
   - **Input Features:** Current glucose, meal carbs, meal GI, time since last meal, insulin/medication
   - **Model:** Lightweight ML model (XGBoost or simple LSTM)
   - **Prediction:** Post-meal glucose at 1-hour, 2-hour
   - **Deployment:** On-device (TensorFlow Lite) for offline capability

4. **Diabetes Chatbot:**
   - **Platform:** AWS Bedrock - Claude 3 Haiku (fast, cost-effective)
   - **RAG:** Bedrock Knowledge Bases with diabetes education content
   - **Languages:** English, Hindi (Phase 1), +8 regional languages (Phase 2)
   - **Capabilities:**
     - Diabetes education ("What is diabetes?", "How to control blood sugar?")
     - Medication adherence coaching
     - Complication awareness
     - Lifestyle recommendations (diet, exercise)
     - **NOT:** Medical diagnosis, prescription changes

### Data Models (Diabetes-Specific)

**DynamoDB Tables:**

1. **User**
   - userId, email, phone, name, age, gender
   - diabetesType (Type1, Type2, PreDiabetes)
   - diagnosisDate, currentMedications
   - preferences (language, units mg/dL or mmol/L)

2. **GlucoseReading**
   - userId, timestamp, glucoseValue (mg/dL)
   - readingType (Fasting, PostMeal, Random, Bedtime)
   - mealId (optional, link to meal if post-meal)
   - notes

3. **Meal**
   - userId, timestamp, mealType (Breakfast, Lunch, Dinner, Snack)
   - photoUrl (S3), foodItems[], totalCarbs, estimatedGI
   - predictedGlucose (1hr, 2hr)

4. **DRScreening**
   - userId, timestamp, fundusImageUrl (S3)
   - eye (Left, Right)
   - drGrade (NoDR, Mild, Moderate, Severe, Proliferative)
   - confidence, recommendation
   - reviewedByDoctor (optional)

5. **ComplicationRisk**
   - userId, timestamp
   - retinopathyRisk, nephropathyRisk, neuropathyRisk, cvdRisk
   - riskFactors, recommendations

**PostgreSQL Tables:**

1. **IndianFoodDatabase**
   - foodId, foodName (English + Hindi)
   - category (Grains, Vegetables, Fruits, Dairy, Proteins, Sweets)
   - carbsPer100g, gi (Glycemic Index), gl (Glycemic Load)
   - regionalVariation (North, South, East, West)

---

## Success Metrics (Diabetes-Specific)

### Clinical Outcomes (12 Months)

1. **Glucose Control:**
   - Users with estimated HbA1c reduction ≥0.5%: **60%+**
   - Users achieving target glucose range (70-180 mg/dL): **50%+**
   - Hypoglycemia episodes reduced: **30%**

2. **Complication Detection:**
   - DR cases detected early (before vision loss): **500+**
   - Foot ulcer risk identified: **200+**
   - Nephropathy risk flagged: **300+**
   - Users referred to specialists: **5,000+**

3. **Behavioral Change:**
   - Users logging glucose daily: **70%+ (retention)**
   - Meal tracking compliance: **50%+**
   - DR screening uptake: **30% of user base**

### Access & Equity (12 Months)

4. **Rural Reach:**
   - Rural users: **30%** (vs. <5% access to endocrinologists)
   - Districts covered: **50+** out of 766
   - ASHA workers trained: **1,000+**

5. **Affordability:**
   - Free tier users: **90%** (450,000 out of 500,000)
   - Cost per user vs. traditional care: **₹120/year vs. ₹17,113/year** (140x cheaper)

6. **Accessibility:**
   - Languages supported: **10+** (vs. English-only alternatives)
   - Offline capability: **100%** for glucose tracker, 80% for chatbot

### Economic Impact (12 Months)

7. **Healthcare Savings:**
   - Complications prevented: **200+** (amputations, blindness, dialysis)
   - Direct medical cost savings: **₹500-1,000 crore**
   - Productivity improvement: **₹2,000-5,000 crore** (estimated from 1M users)

8. **User Engagement:**
   - Daily active users: **3,000+** (30% DAU/MAU)
   - Average session duration: **5-8 minutes**
   - Glucose logs per user: **30+/month**
   - Chatbot conversations: **50,000+ messages/month**

---

## Competitive Positioning (Diabetes-Only)

### Key Competitors

| Competitor | Focus | Strength | Our Advantage |
|------------|-------|----------|---------------|
| **BeatO** | Glucose monitoring + coaching | Smart glucometers, CGM ecosystem | Free DR screening, AI meal analysis |
| **Fitterfly** | Digital therapeutics (DTx) | Clinical results (1.96% HbA1c reduction) | 10x cheaper (₹999/year vs. ₹15,000-30,000) |
| **Sugar.fit** | CGM + nutrition | Abbott partnership, personalized plans | Offline-first, smartphone-based DR screening |
| **Remidio** | AI DR screening only | CDSCO approved, clinical validation | Integrated platform (DR + glucose + meals + chatbot) |
| **1mg/PharmEasy** | Medicine delivery + basic tracking | Existing user base, pharmacy network | Advanced AI features (Bedrock, Rekognition) |
| **Wellthy CARE** | Diabetes DTx | 0.84% HbA1c reduction (high-engagement) | Free tier, multilingual, offline capability |

### Unique Differentiation

✅ **Only integrated platform** with DR screening + glucose tracking + meal analysis + AI chatbot
✅ **Only solution** with smartphone camera-based DR screening (no expensive fundus camera hardware)
✅ **Only solution** optimized for Indian food database (100+ traditional foods with GI data)
✅ **Most affordable** comprehensive diabetes platform (₹999/year vs. ₹15,000-30,000 competitors)
✅ **Offline-first** architecture for rural India (only 3.8% rural households have fiber optic access — [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2040566))
✅ **ABDM-ready** for government integration (NPCDCS, NPCB programs)

---

## Regulatory Path (Diabetes-Specific)

### Medical Device Classification

**DR Screening Component:**
- **Classification:** Software as a Medical Device (SaMD) - **Class C** (Moderate Risk)
- **Regulatory Authority:** CDSCO (Central Drugs Standard Control Organization)
- **Requirement:** Registration under Medical Devices Rules 2017
- **Timeline:** 6-15 months for approval
- **Precedent:** Remidio Medios DR (India's first AI ophthalmic software, approved September 2024)

**Glucose Tracker + Meal Analyzer:**
- **Classification:** Wellness Tool - **Class A** (Low Risk) or **Exempt**
- **Rationale:** Retrospective glucose logging, educational meal analysis (not real-time diagnostic)
- **Requirement:** May not require full medical device registration

**Strategy:**
1. Position DR screening as "decision support tool" (not standalone diagnostic)
2. Always recommend professional ophthalmologist confirmation
3. Early consultation with CDSCO for classification clarity
4. Phased approach: Launch wellness features (glucose tracker) first, add DR screening after approval

### Data Privacy Compliance

**Digital Personal Data Protection Act 2023:**
- **Status:** Rules notified November 13, 2025
- **Full Compliance Deadline:** May 13, 2027
- **Requirements:**
  - Explicit user consent for health data collection
  - Data minimization (collect only necessary data)
  - Right to access, correction, deletion
  - Breach notification within 72 hours
  - Consent Manager registration (for HIE)
  - Structured data management protocols

**Implementation:**
- Privacy-by-design architecture
- End-to-end encryption (AES-256 at rest, TLS 1.3 in transit)
- User controls for data sharing (ABDM consent framework)
- Anonymization for analytics and research
- Regular security audits and penetration testing

---

## Integration with Government Programs

### NPCDCS Integration

**National Programme for Prevention and Control of Cancer, Diabetes, CVD and Stroke:**
- **Coverage:** 682 District NCD Clinics and 5,408 CHC NCD Clinics established ([NHM](https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=1048&lid=604))
- **Opportunity:**
  - DR screening for 89.8M diabetics (target: 5M screenings/year)
  - Digital health records integration
  - ASHA worker training on diabetes awareness
  - Population health analytics for program planning

**Pricing Model:**
- ₹50-100 per DR screening (vs. ₹500-1,500 traditional fundus photography)
- Bulk contracts with state health departments
- Revenue potential: 5M screenings × ₹100 = ₹500 crore annual market

### NPCB Integration

**National Programme for Control of Blindness and Visual Impairment:**
- **Focus:** Diabetic retinopathy as major cause of blindness
- **Synergy:** NPCDCS detects diabetics → NPCB screens for DR
- **Infrastructure:** Community Health Centers for screening, district hospitals for management
- **Target:** 3.35-4.55 million people at risk of vision-threatening DR

### ABDM Integration

**Ayushman Bharat Digital Mission:**
- **ABHA (Health ID):** 79.91 crore accounts (August 2025)
- **Health Records:** 67.19 crore linked (August 2025)
- **Facilities Registered:** 4.18 lakh health facilities
- **Integration Points:**
  - ABHA login for DiabetCare AI
  - Share glucose trends, DR screening results with doctors
  - Health Information Exchange (HIE) via consent managers
  - Telemedicine integration (eSanjeevani)

---

## Go-to-Market Strategy (Diabetes-Only)

### Phase 1: MVP Launch (Months 1-3)

**Target:** 10,000 users

**Channels:**
1. **Direct to Consumer (D2C):**
   - SEO for "diabetes app India", "diabetic retinopathy screening"
   - Content marketing (diabetes education blog in Hindi + English)
   - Social media (diabetes awareness campaigns)
   - Referrals from endocrinologists

2. **Government Pilots:**
   - Partner with 2-3 district NCD clinics
   - ASHA worker training in 5-10 villages
   - Free screenings at government health camps

3. **Corporate Pilots:**
   - 2-3 companies with employee diabetes programs
   - Free 3-month trial for HR evaluation

### Phase 2: Scale (Months 4-12)

**Target:** 500,000 users

**Channels:**
1. **Government Expansion:**
   - NPCDCS contracts in 5 states
   - 1,000 ASHA workers trained
   - Integration with state health department portals

2. **Insurance Partnerships:**
   - 3 health insurers offering app as value-added service
   - Diabetes-specific insurance plans with app bundling

3. **Corporate Wellness:**
   - 50 companies, 5,000 employees each = 250,000 users
   - Outcome-based pricing (HbA1c improvement bonuses)

4. **Pharmacy Partnerships:**
   - In-app medicine ordering (1mg, PharmEasy, Netmeds)
   - QR codes on diabetes medication packaging
   - Diabetologist referral network

### Phase 3: National Scale (Year 2)

**Target:** 5 million users

**Channels:**
1. **Pan-India Government:**
   - All 28 states + 8 UTs
   - 5,000 PHCs/CHCs equipped for DR screening
   - Integration with National Health Mission

2. **Telemedicine Integration:**
   - eSanjeevani platform integration
   - Diabetes specialist teleconsultation marketplace

3. **International Expansion:**
   - Bangladesh, Pakistan, Nepal, Sri Lanka (similar diabetes burden)
   - WHO collaboration for diabetes prevention programs

---

## Future Roadmap (Diabetes-Only)

### Year 1: Foundation

- ✅ Core features: DR screening, glucose tracker, meal analyzer, chatbot
- ✅ 500,000 users (90% free tier, 10% premium)
- ✅ 5 state government partnerships
- ✅ Clinical validation study (1,000 patients)
- ✅ CDSCO approval for DR screening

### Year 2: Scale & Integration

- 🎯 5 million users
- 🎯 ABDM integration (ABHA login, HIE)
- 🎯 CGM integration (Abbott FreeStyle Libre, Dexcom, BeatO)
- 🎯 Telemedicine marketplace (video consultations)
- 🎯 Advanced analytics (digital twin, personalized recommendations)

### Year 3: Advanced Features

- 🎯 10 million users
- 🎯 Diabetic foot ulcer image-based detection (computer vision)
- 🎯 Continuous glucose forecasting (1-4 hours ahead using ML)
- 🎯 Closed-loop coaching (real-time meal recommendations based on CGM)
- 🎯 Regional expansion (South Asia)

### Year 4-5: Ecosystem Leadership

- 🎯 50 million users across India + South Asia
- 🎯 API platform for third-party integrations
- 🎯 Research collaborations with ICMR, AIIMS
- 🎯 WHO endorsement for diabetes prevention programs
- 🎯 Become de facto standard for digital diabetes care in India

---

## Key Performance Indicators (KPIs)

### Product Metrics

- **DR Screening Accuracy:** >92% sensitivity, >88% specificity (validated against ophthalmologist)
- **Meal Recognition Accuracy:** >80% for top 50 Indian foods
- **Glucose Prediction RMSE:** <15 mg/dL for 1-hour post-meal prediction
- **Chatbot Response Quality:** >85% user satisfaction, <5% inappropriate responses
- **App Performance:** Lighthouse score >90, <2s page load

### User Engagement

- **Daily Active Users (DAU):** 30% of Monthly Active Users (MAU)
- **Glucose Logging Frequency:** 70% users log ≥20 days/month
- **DR Screening Uptake:** 30% of users complete ≥1 screening in first 3 months
- **Chatbot Usage:** 50% users interact with chatbot ≥2 times/week
- **Retention:** 40% users active at 90 days, 25% at 12 months

### Business Metrics

- **User Acquisition Cost (UAC):** <₹500 per user (target: ₹300)
- **Customer Lifetime Value (LTV):** ₹2,000 (free tier: ₹500 from govt contracts, premium: ₹5,000)
- **LTV/CAC Ratio:** >4x (healthy SaaS benchmark)
- **Revenue per User (ARPU):** ₹120/year (blended free + premium)
- **Gross Margin:** >70% (software-only, AWS auto-scaling)

### Impact Metrics

- **Complications Prevented:** 200+ in Year 1 (amputations, blindness, dialysis)
- **Lives Saved:** 50+ (diabetic ketoacidosis early detection, complication prevention)
- **Healthcare Cost Savings:** ₹500-1,000 crore in Year 1
- **Productivity Gains:** ₹2,000-5,000 crore in Year 1 (better glucose control → reduced absenteeism)

---

## Frequently Asked Questions (Diabetes-Only)

**Q: Why diabetes only? Why not other NCDs?**
A: Diabetes has the largest addressable market (89.8M + 136M pre-diabetics), proven AI technology (DR screening >92% accuracy), and clear government integration path (NPCDCS). Focus allows us to build the best diabetes platform rather than a mediocre multi-disease platform.

**Q: Will you add blood pressure monitoring later?**
A: Possibly in Year 2-3 if diabetes + hypertension comorbidity tracking becomes critical for CVD risk assessment. But it will remain secondary to core diabetes features.

**Q: What about mental health support for diabetics (depression is common)?**
A: Out of scope for now. DiabetCare AI focuses on diabetes management and complications. Mental health is a separate, equally complex domain requiring dedicated solution.

**Q: Can the app diagnose diabetes?**
A: **NO.** DiabetCare AI is for diabetes **management** (existing diabetics) and **screening** (DR, risk assessment). Diabetes diagnosis requires clinical lab tests (fasting glucose, HbA1c, OGTT) and doctor evaluation.

**Q: Is the DR screening accurate enough to replace ophthalmologist?**
A: **NO.** It's a **screening tool** (92% sensitivity, 88% specificity), not diagnostic. Users with referable DR are always recommended to consult ophthalmologist for confirmation and treatment. Think of it like mammography (screening) vs. biopsy (diagnosis).

**Q: How does the app make money?**
A: Freemium model (90% free, 10% premium at ₹999/year), government contracts (₹50-100 per DR screening), corporate wellness (₹200-500 per employee), insurance partnerships (value-added service fees).

**Q: What if I don't have a smartphone camera for DR screening?**
A: DR screening requires camera. But glucose tracker, meal analyzer (manual entry), and chatbot work on any smartphone. We're exploring partnerships with PHCs/CHCs that have fundus cameras for patients without smartphones.

**Q: Does the app work offline?**
A: **Glucose tracker:** 100% offline. **Chatbot:** 80% offline (basic responses cached, advanced queries need internet). **Meal analyzer:** Requires internet for photo upload to AWS Bedrock. **DR screening:** Requires internet for image upload to Rekognition.

**Q: Is my health data safe?**
A: Yes. End-to-end encryption (AES-256 at rest, TLS 1.3 in transit), DPDP Act 2023 compliant, user controls all sharing, option to delete all data anytime. Health data never sold to third parties.

**Q: Can I share my glucose data with my doctor?**
A: Yes. Export as PDF, or share via ABDM (ABHA account) once integrated. Doctor dashboard (Phase 2) allows authorized healthcare providers to view trends.

**Q: Is this app only for Type 2 diabetes?**
A: No. Type 1, Type 2, and pre-diabetics can all use it. Type 1 diabetics will benefit most from CGM integration (Phase 2). Pre-diabetics can use for prevention and risk assessment.

---

**Document Owner:** Product Team
**Review Frequency:** Monthly
**Next Review:** 2026-02-25

---

## Appendix: Diabetes-Specific Terminology

**Glossary:**

- **HbA1c:** Glycated hemoglobin, 3-month average glucose (target: <7%)
- **Fasting Glucose:** Blood sugar after 8-hour fast (normal: <100 mg/dL)
- **Post-Prandial Glucose:** Blood sugar 2 hours after meal (target: <180 mg/dL)
- **Hypoglycemia:** Low blood sugar (<70 mg/dL), can cause dizziness, confusion
- **Hyperglycemia:** High blood sugar (>180 mg/dL), long-term damage
- **Glycemic Index (GI):** How quickly food raises blood sugar (low <55, medium 56-69, high >70)
- **Diabetic Retinopathy (DR):** Eye damage from diabetes, leading cause of blindness
- **NPDR:** Non-proliferative diabetic retinopathy (early stage)
- **PDR:** Proliferative diabetic retinopathy (advanced, new abnormal blood vessels)
- **CSDME:** Clinically significant diabetic macular edema (swelling in macula)
- **CGM:** Continuous Glucose Monitor (sensor measures glucose every 5-15 minutes)
- **SMBG:** Self-Monitoring of Blood Glucose (fingerstick glucometer)
- **DTx:** Digital Therapeutics (evidence-based software for disease management)
- **NPCDCS:** National Programme for Prevention and Control of Cancer, Diabetes, CVD and Stroke
- **ABDM:** Ayushman Bharat Digital Mission (India's national digital health ecosystem)
- **ABHA:** Ayushman Bharat Health Account (unique 14-digit health ID)

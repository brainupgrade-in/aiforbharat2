# Nazar AI (DiabetCare AI) — Project Summary

## One-Liner
AI-powered diabetic retinopathy screening and diabetes management PWA that brings specialist-level eye care to 225 million Indians — from any smartphone, in any village, offline.

---

## The Problem

India has 89.8 million diabetics — the world's second-largest population — yet 75-80% of doctors are concentrated in urban areas serving only 31-37% of the population. The result: 43% of Indian diabetics remain undiagnosed (IDF Atlas 11th Edition, 2025), with many first diagnosed when complications are already present, 3 million Indians have vision-threatening diabetic retinopathy (DR), and the annual economic burden exceeds ₹2-3 lakh crore. Traditional DR screening costs ₹500-1,500 per visit, requires specialized fundus cameras available only in urban clinics, and is completely inaccessible to the 65% of Indians living in rural areas.

## The Solution

**Nazar AI** (also known as DiabetCare AI) is a mobile-first Progressive Web App (PWA) that combines AI-powered diabetic retinopathy screening with comprehensive daily diabetes management — requiring zero hardware and zero clinic visits.

### Current Status: React MVP Deployed

**Live Prototype:** [https://main.d3vwqyp1h0elbo.amplifyapp.com/](https://main.d3vwqyp1h0elbo.amplifyapp.com/)
**GitHub:** [https://github.com/brainupgrade-in/aiforbharat2](https://github.com/brainupgrade-in/aiforbharat2)

### Implemented Features (Live)

1. **Branded Authentication** — Immersive login screen with animated eye, impact stats (89M diabetics, 43% undiagnosed, 90% blindness preventable), and testimonial carousel. Email-based auth via Amazon Cognito.

2. **AI Diabetic Retinopathy Screening** — Multi-step workflow: patient ID entry → live camera feed with optical guide overlay → photo capture/upload → AI analysis (simulated) → severity classification (No DR to Proliferative DR, 5 grades). Includes photo quality assessment.

3. **Dual Result Views** — Patient mode shows simplified results with Lotus flower severity indicator and marigold celebration animation (for No DR). Doctor mode shows clinical details: lesion analysis (microaneurysms, hemorrhages, neovascularization), DR grade, confidence score, and EHR export button.

4. **GPS-Based Doctor Finder** — Automatic location detection via browser geolocation + OpenStreetMap reverse geocoding. Generates Google Maps links for nearby ophthalmologists/eye hospitals. WhatsApp sharing of scan results with location.

5. **Community Impact Dashboard** — State leaderboard (top 10 Indian states by scan volume), local village statistics with PIN code, success stories with multilingual testimonials.

6. **Multilingual Support** — Full UI translated in English, Hindi (हिन्दी), and Kannada (ಕನ್ನಡ) with language switcher. Custom i18n system covering all screens.

7. **High Contrast Mode** — Accessibility toggle for outdoor visibility and low-vision users.

8. **Home Dashboard** — Animated greeting, scan CTA, last scan card, streak counter, 7-day blood sugar sparkline chart, community stats.

### Planned Features (Phase 2)

- **Smart Glucose Tracker** — Manual logging with trend analysis (data model ready in Amplify)
- **AI Meal Analyzer** — Photo-based Indian food recognition with carb estimation (AWS Bedrock Nova Pro)
- **Diabetes Advisor Chatbot** — 24/7 AI guidance using AWS Bedrock Claude 3 Haiku
- **Complication Risk Assessment** — DR, diabetic foot ulcer, nephropathy, CVD risk
- **CGM Integration** — Abbott FreeStyle Libre, Dexcom, BeatO
- **ABDM Integration** — ABHA-compatible health records

## Why AI is Required

- India has a 20+ lakh healthcare professional shortage — AI replaces specialist visits for 70-80% of routine diabetes monitoring and screening.
- 43% of Indian diabetics are undiagnosed (IDF Atlas 11th Edition, 2025), and many are first diagnosed when complications are already present — AI enables early detection 2-3 years before irreversible damage when treatment is still effective and affordable (₹5,000-10,000 vs ₹3-5 lakh for late-stage intervention).
- No existing solution combines DR screening, glucose management, and Indian food analysis in one platform. AI is the only way to deliver specialist-level, personalized care at population scale without proportional workforce growth.

## How AWS Services Are Used

| AWS Service | Purpose | Status |
|---|---|---|
| **AWS Amplify Gen 2** | Full-stack serverless backend (TypeScript, CI/CD, hosting) | ✅ Deployed (ap-south-1) |
| **Amazon Cognito** | Authentication (email signup/login, user pools) | ✅ Live |
| **Amazon DynamoDB** | User profiles, glucose readings, scan results, chat history | ✅ Schema deployed |
| **AWS AppSync** | GraphQL API layer (auto-generated, real-time) | ✅ Live |
| **CloudFront CDN** | Low-latency PWA delivery across India | ✅ Live |
| **Amazon Rekognition Custom Labels** | Diabetic retinopathy detection from fundus images | 🔄 Planned |
| **AWS Bedrock — Claude 3 Haiku** | 24/7 multilingual diabetes advisor chatbot | 🔄 Planned |
| **AWS Bedrock — Amazon Nova Pro** | Photo-based Indian meal analysis with carb estimation | 🔄 Planned |
| **AWS Bedrock Knowledge Bases** | RAG-powered diabetes education content retrieval | 🔄 Planned |
| **Amazon S3** | Retina scan and meal photo storage | 🔄 Planned |
| **AWS Lambda** | Serverless business logic (meal analyzer, DR risk calculator) | 🔄 Planned |
| **AWS CloudTrail** | Audit logging for healthcare compliance | 🔄 Planned |

## Technology Stack (Implemented)

- **Frontend:** React 18.3.1 + Vite 6.0 + TailwindCSS 3.4 (custom Nazar design system with Baloo 2 + Noto Sans fonts)
- **Backend:** AWS Amplify Gen 2 (Cognito, DynamoDB, AppSync GraphQL) — deployed in ap-south-1 (Mumbai)
- **UI Components:** Custom React components — LotusSeverity, IrisLoader, MarigoldCelebration, NearbyDoctors, NazarAuthScreen
- **i18n:** Custom translation system (EN, HI, KN) with variable interpolation
- **Geolocation:** Browser Geolocation API + OpenStreetMap Nominatim reverse geocoding
- **Maps:** Google Maps deeplinks for doctor search and navigation
- **Sharing:** WhatsApp deeplinks for result sharing
- **Security:** AES-256 encryption, TLS 1.3, owner-based row-level authorization, HIPAA-eligible AWS services

## Differentiation from Existing Solutions

| Factor | Existing Solutions | Nazar AI |
|---|---|---|
| DR Screening | Clinic-only, ₹500-1,500/scan, urban only | Smartphone-based, free, anywhere |
| Hardware Required | Glucometer (₹2K-10K), CGM, fundus camera | Zero — any smartphone |
| Indian Food Support | Western databases, generic | 500+ Indian dishes, regional cuisines |
| Offline Support | Requires internet | Works on 2G/3G, offline-first |
| Annual Cost | ₹17,113-20,000 (Fitterfly, Twin Health) | ₹0 (free tier) — ₹999 (premium) |
| Languages | English only | Hindi + English + Kannada (expanding to 10 languages) |
| Doctor Finder | Manual search | GPS-based with Google Maps + WhatsApp sharing |

## Expected Impact

- **40-50% reduction** in diabetes complications (blindness, amputations, kidney failure)
- **₹2-3 lakh crore GDP savings** from reduced complication burden
- **500+ DR cases** detected early (before vision loss) in Year 1
- **60%+ users** achieve clinically significant glucose improvement
- **30% rural reach** vs. <5% access to traditional endocrinologists
- **225M total addressable market** (89.8M diabetics + 136M pre-diabetics)

## Team

**Team Name:** TheHealthGheware
**Team Leader:** Rajesh Gheware — 25+ years at JPMorgan Chase, Deutsche Bank, Morgan Stanley. 5,000+ professionals trained. [rajeshgheware.github.io](https://rajeshgheware.github.io)

---

*Built for the AWS AI for Bharat Hackathon — Prototype Development Phase*
*Last Updated: 2026-03-08*

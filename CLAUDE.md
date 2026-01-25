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
4. **Late Detection**: 60-70% disease cases diagnosed at advanced stages
5. **Treatment Gap**: 83% mental health treatment gap, 60% TB detection gap

## Repository Structure

```
ai-for-bharat-2/
├── README.md                           # Comprehensive problem analysis and solution roadmap
├── CLAUDE.md                          # This file - guidance for Claude Code
├── TECH_STACK.md                      # Detailed technical stack documentation
├── docs/                              # GitHub Pages wireframes (HTML/CSS/JS)
│   ├── index.html                    # Landing page wireframe
│   ├── dashboard.html                # Dashboard wireframe
│   ├── glucose-tracker.html          # Glucose tracker wireframe
│   ├── meal-analyzer.html            # Meal analysis wireframe
│   ├── retina-scan.html              # Retina scan wireframe
│   ├── chatbot.html                  # AI chatbot wireframe
│   ├── css/
│   │   └── wireframe.css            # Wireframe styling
│   ├── js/
│   │   └── wireframe.js             # Wireframe interactivity
│   └── images/                       # Wireframe assets
├── .claude/                           # Claude Code configuration
│   └── settings.local.json           # Local settings
└── Idea Submission _ AWS AI for Bharat Hackathon.pptx  # Presentation deck
```

**NOTE:** Only the `docs/` folder is pushed to GitHub for wireframe hosting via GitHub Pages.

## Selected Use Case: Diabetes Screening ✅

**Project Name:** DiabetCare AI
**Priority:** TIER 1 - Diabetes Management + Diabetic Retinopathy Screening

## Confirmed Focus: Diabetes Management + Diabetic Retinopathy Screening ✅

**Strategic Decision:** After comprehensive analysis of India's NCD landscape, we have strategically focused on **diabetes and its complications exclusively**.

### Why Diabetes Only?

**Rationale:**
- **Massive Scale:** 89.8 million diabetics (2024 IDF Atlas) - world's 2nd largest population
- **Economic Impact:** ₹2-3 lakh crore annual burden (40-50% develop complications)
- **Preventable Complications:** 80% of blindness from diabetic retinopathy is preventable
- **Technology Readiness:** AI DR screening clinically validated (92%+ sensitivity, 88%+ specificity)
- **Market Opportunity:** 225M total addressable market (89.8M diabetics + 136M pre-diabetics)
- **Government Alignment:** NPCDCS active in 500+ districts

### Core Diabetes Features (In Scope)

**Primary Features:**
- **AI Diabetic Retinopathy Screening** - Smartphone camera-based fundus image analysis
- **Smart Glucose Tracker** - Manual logging with trend analysis and pattern detection
- **AI Meal Analyzer** - Photo-based food recognition with carb estimation for Indian foods
- **Diabetes Advisor Chatbot** - 24/7 AI guidance using AWS Bedrock Claude 3 Haiku
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

## Technology Stack (FINALIZED)

### Frontend - ReactJS Progressive Web App (PWA)
- **Framework:** React 18.x with Vite
- **UI Library:** TailwindCSS + shadcn/ui (or Material-UI)
- **Language:** JavaScript/TypeScript
- **PWA Features:** Service Workers, offline support, installable
- **State Management:** Context API / Redux Toolkit
- **Routing:** React Router v6
- **Key Libraries:**
  - `aws-amplify` - AWS integration
  - `@aws-amplify/ui-react` - Pre-built Amplify components
  - `react-webcam` - Camera access for retina scans
  - `recharts` - Data visualization
  - `react-i18next` - Internationalization
  - `workbox` - PWA/offline support

**Why ReactJS over Flutter?**
- ✅ Faster development (familiar tech stack)
- ✅ No app store deployment delays (instant web access)
- ✅ Instant updates (no app store approval)
- ✅ Better SEO and discoverability
- ✅ Single codebase for all devices
- ✅ Lower cost ($0 vs $99/year Apple + $25 Google)

### Backend - AWS Amplify Gen 2
- **Infrastructure:** AWS Amplify (full-stack TypeScript framework)
- **Authentication:** Amazon Cognito (email, phone OTP, Google OAuth)
- **Database:** Amazon DynamoDB (via Amplify Data)
- **Storage:** Amazon S3 (via Amplify Storage) for retina scans and meal photos
- **APIs:** GraphQL via AWS AppSync (auto-generated from schema)
- **Functions:** AWS Lambda for custom business logic
- **Hosting:** AWS Amplify Hosting with CloudFront CDN

**Why Amplify?**
- ✅ Rapid full-stack development in TypeScript
- ✅ Built-in auth, database, storage, APIs
- ✅ Type-safe end-to-end
- ✅ Auto-scaling serverless architecture
- ✅ CI/CD out-of-the-box

### AI/ML - AWS Bedrock + Amazon Rekognition
- **Primary AI:** AWS Bedrock Foundation Models
  - **Claude 3 Haiku** - Diabetes advisor chatbot (fast, cost-effective)
  - **Claude 3 Sonnet** - Complex medical explanations, weekly reports
  - **Amazon Nova Pro** - Meal photo analysis and food recognition
  - **Bedrock Knowledge Bases** - RAG for diabetes education content
- **Computer Vision:** Amazon Rekognition Custom Labels
  - Diabetic retinopathy detection from fundus images
  - Custom model trained on Kaggle DR dataset (35K images)
- **Why Bedrock?**
  - ✅ No model training required (pre-trained foundation models)
  - ✅ Multilingual out-of-the-box (Hindi, Tamil, Telugu)
  - ✅ HIPAA eligible for healthcare data
  - ✅ Pay-per-token pricing (cost-effective)
  - ✅ Fast time-to-market

### Development Environment
- **IDE:** AWS Cloud9 (cloud-based IDE) or local VS Code
- **AI Assistant:** Amazon Q Developer for code suggestions
- **Version Control:** Git + GitHub
- **CI/CD:** AWS Amplify CI/CD (automatic deployment on git push)

### Data & Analytics
- **Database:** DynamoDB (NoSQL), RDS PostgreSQL (relational needs)
- **Analytics:** Amazon QuickSight, CloudWatch
- **ML Pipeline:** SageMaker Pipelines
- **Model Monitoring:** SageMaker Model Monitor

### Security & Compliance
- **Encryption:** AES-256 for data at rest, TLS 1.3 for data in transit
- **Data Privacy:** GDPR/HIPAA-equivalent compliance
- **Authentication:** Multi-factor authentication, biometric support
- **Audit Logging:** AWS CloudTrail

## Development Workflow

### Phase 1: Research & Validation (Weeks 1-2)
1. Choose specific use case from TIER 1 priorities
2. Review existing AI models and datasets
3. Identify regulatory requirements (Medical Devices Rules 2017, SaMD classification)
4. Stakeholder research (interviews with doctors, patients, ASHA workers if possible)
5. Dataset identification (NDHM, ICMR repositories, Kaggle healthcare datasets)

### Phase 2: MVP Development (Weeks 3-5)
1. UI/UX design for low digital literacy users
2. Core AI model development and training
3. Mobile app development with Flutter
4. Offline-first architecture implementation
5. Regional language integration (i18n/l10n)
6. Security implementation

### Phase 3: Testing & Validation (Week 6)
1. Unit testing and integration testing
2. Model accuracy validation
3. User acceptance testing (UAT)
4. Performance optimization
5. Security audit

### Phase 4: Documentation & Presentation (Week 7)
1. Code documentation
2. API documentation
3. User guides (English + Hindi minimum)
4. Deployment guide
5. Presentation deck finalization

## Critical Design Principles

### Mobile-First Requirements
✅ **Offline-First Architecture**
- Core features work without internet (30% rural India has intermittent connectivity)
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

### Unit Testing
- **Framework:** pytest for Python, flutter_test for Flutter
- **Coverage:** Minimum 80% code coverage
- **AI Models:** Test accuracy, precision, recall, F1-score

### Integration Testing
- **API Testing:** Postman/Newman for REST APIs
- **Database:** Test data integrity and migrations
- **Cloud Services:** Test AWS service integrations

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

### Development (ReactJS + Amplify)
```bash
# Install dependencies
npm install

# Start local development server
npm run dev                            # Vite dev server on localhost:5173

# AWS Amplify setup
npm create amplify@latest             # Initialize new Amplify project
npx ampx sandbox                      # Run local Amplify sandbox (auth, data, storage)

# Deploy to Amplify cloud
npx ampx sandbox --once               # Deploy cloud sandbox
git push origin main                  # Triggers Amplify CI/CD

# Build for production
npm run build                         # Creates dist/ folder
npm run preview                       # Preview production build locally

# Testing
npm run test                          # Run Jest unit tests
npm run test:e2e                      # Run Playwright E2E tests
npm run lint                          # ESLint check
```

### Wireframe Development (GitHub Pages)
```bash
# Create wireframes in docs/ folder
cd docs
python -m http.server 8000            # Test wireframes locally at http://localhost:8000

# Push to GitHub (only docs/ folder)
git add docs/
git commit -m "Add wireframes"
git push origin main

# Enable GitHub Pages
# Go to: Settings → Pages → Source: Deploy from branch → Branch: main → Folder: /docs
# Access at: https://<username>.github.io/ai-for-bharat-2/
```

### AWS Bedrock (AI Development)
```bash
# Install AWS SDK
npm install @aws-sdk/client-bedrock-runtime

# Test Bedrock model from CLI
aws bedrock-runtime invoke-model \
  --model-id anthropic.claude-3-haiku-20240307-v1:0 \
  --body '{"anthropic_version":"bedrock-2023-05-31","max_tokens":1024,"messages":[{"role":"user","content":"Explain diabetes in simple terms"}]}' \
  --cli-binary-format raw-in-base64-out \
  output.json

# View response
cat output.json | jq -r '.content[0].text'
```

### Amazon Rekognition (DR Detection)
```bash
# Train custom labels model
aws rekognition create-project --project-name diabetic-retinopathy

# Upload labeled dataset to S3
aws s3 sync ./dr-dataset s3://your-bucket/dr-training-data/

# Create dataset
aws rekognition create-dataset \
  --project-arn arn:aws:rekognition:us-east-1:123456789012:project/diabetic-retinopathy/1234567890 \
  --dataset-type TRAIN \
  --dataset-source '{"GroundTruthManifest":{"S3Object":{"Bucket":"your-bucket","Name":"manifest.json"}}}'

# Train model (takes 1-2 hours)
aws rekognition create-project-version \
  --project-arn <project-arn> \
  --version-name v1 \
  --output-config '{"S3Bucket":"your-bucket","S3KeyPrefix":"output/"}'

# Start model endpoint
aws rekognition start-project-version \
  --project-version-arn <version-arn> \
  --min-inference-units 1

# Test detection
aws rekognition detect-custom-labels \
  --project-version-arn <version-arn> \
  --image '{"S3Object":{"Bucket":"your-bucket","Name":"test-image.jpg"}}' \
  --min-confidence 70
```

### Data Preparation (DR Dataset)
```bash
# Download Kaggle dataset
kaggle competitions download -c diabetic-retinopathy-detection
unzip diabetic-retinopathy-detection.zip -d ./data

# Preprocess retina images (resize, normalize)
python scripts/preprocess_retina.py \
  --input ./data/train \
  --output ./data/processed \
  --resize 512x512 \
  --format jpg

# Generate Rekognition manifest
python scripts/generate_manifest.py \
  --input ./data/processed \
  --labels ./data/trainLabels.csv \
  --output ./data/manifest.json
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
- **Dart/Flutter:** DartDoc comments
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
- Use AWS Amplify for rapid backend development
- Leverage AWS Bedrock for AI (no model training)
- Create wireframes in docs/ folder for GitHub Pages
- Support minimum 2 languages (English + Hindi)
- Focus on user privacy and data security (HIPAA-equivalent)
- Test on mobile browsers (Chrome, Safari)
- Use AWS Cloud9 or Amazon Q Developer for development

### What NOT To Do ❌
- Don't collect unnecessary personal data
- Don't make medical claims without clinical validation
- Don't ignore regulatory requirements
- Don't optimize only for high-end devices
- Don't skip security audits
- Don't hardcode credentials or API keys
- Don't ignore accessibility requirements
- Don't launch without ABDM integration plan

## Quick Start Guide

### Diabetes Screening MVP (7-Week Plan)

**Week 1: Setup & Wireframes**
1. Create GitHub repository structure
2. Build HTML/CSS/JS wireframes in `docs/` folder
3. Enable GitHub Pages for wireframe sharing
4. Set up AWS Cloud9 development environment
5. Initialize AWS Amplify project with React + Vite

**Week 2: Authentication & Core UI**
1. Implement Amplify Auth (email, phone OTP, Google OAuth)
2. Build responsive React UI (TailwindCSS)
3. Create dashboard with navigation
4. Implement PWA manifest and service worker
5. Test offline functionality

**Week 3: Glucose Tracker**
1. Define Amplify Data schema (User, GlucoseReading models)
2. Build glucose logging UI (manual entry)
3. Create glucose history chart (recharts)
4. Implement trend analysis
5. Test data sync

**Week 4: AI Chatbot (Bedrock)**
1. Integrate AWS Bedrock (Claude 3 Haiku)
2. Build chat UI with conversation history
3. Implement diabetes advisor chatbot
4. Add multilingual support (Hindi)
5. Test chatbot responses

**Week 5: Meal Analyzer & Retina Scan**
1. Build meal photo upload (S3 Storage)
2. Integrate Bedrock Nova Pro for food recognition
3. Train Rekognition Custom Labels on DR dataset
4. Implement retina scan upload and analysis
5. Display DR risk level with explanation

**Week 6: Testing & Optimization**
1. User testing with 20+ diabetic patients
2. Performance optimization (Lighthouse >90)
3. Security audit (OWASP checklist)
4. Accessibility testing (WCAG 2.1 AA)
5. Cross-browser testing

**Week 7: Documentation & Submission**
1. Complete README with screenshots
2. Create demo video (3-5 minutes)
3. Finalize presentation deck
4. Write TECH_STACK.md (completed ✅)
5. Submit to AWS AI for Bharat Hackathon

## References & Resources

### Official Documentation
- AWS AI/ML Services: https://aws.amazon.com/machine-learning/
- Flutter: https://flutter.dev/docs
- TensorFlow Lite: https://www.tensorflow.org/lite
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

---

**Last Updated:** 2026-01-25
**Hackathon:** AWS AI for Bharat
**Focus:** Mobile-first AI healthcare solutions for India

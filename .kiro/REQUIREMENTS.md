# DiabetCare AI - Requirements Specification

## Table of Contents
- [Overview](#overview)
- [Functional Requirements](#functional-requirements)
- [Non-Functional Requirements](#non-functional-requirements)
- [User Stories](#user-stories)
- [Acceptance Criteria](#acceptance-criteria)
- [Constraints and Assumptions](#constraints-and-assumptions)

---

## Overview

DiabetCare AI is a mobile-first Progressive Web App (PWA) designed to prevent diabetes complications and blindness in India's 89.8 million diabetics through AI-powered diabetic retinopathy screening and personalized glucose management.

**Target Users:**
- Diabetic patients (Type 1 and Type 2)
- Pre-diabetic individuals
- Healthcare professionals (doctors, ophthalmologists)
- ASHA workers (community health workers)

**Primary Goals:**
- Detect diabetic retinopathy 2-3 years before vision loss
- Reduce diabetes complications by 40-50%
- Provide 24/7 AI-powered diabetes guidance in regional languages
- Achieve ₹2-3 lakh crore GDP savings from reduced complication burden

---

## Functional Requirements

### FR1: User Authentication & Profile Management

**FR1.1 User Registration**
- System SHALL allow users to register using email or phone number
- System SHALL send OTP for verification (SMS/email)
- System SHALL support Google OAuth 2.0 for social sign-in
- System SHALL collect basic profile information: name, age, gender, diabetes type, diagnosis date

**FR1.2 User Authentication**
- System SHALL support email/password login
- System SHALL support phone number + OTP login
- System SHALL implement multi-factor authentication (MFA) with SMS/TOTP
- System SHALL enforce password complexity (min 8 chars, uppercase, number, special char)
- System SHALL lock accounts after 5 failed login attempts

**FR1.3 Profile Management**
- Users SHALL be able to update profile information
- Users SHALL be able to link ABHA (Ayushman Bharat Health Account) ID
- Users SHALL be able to set notification preferences
- Users SHALL be able to delete their account and all associated data

### FR2: Glucose Tracking

**FR2.1 Manual Glucose Logging**
- Users SHALL be able to log blood glucose readings manually
- System SHALL capture: glucose value (mg/dL or mmol/L), timestamp, meal context (fasting, pre-meal, post-meal, bedtime)
- Users SHALL be able to add notes to glucose readings
- System SHALL validate glucose values (range: 20-600 mg/dL)

**FR2.2 Glucose History & Trends**
- System SHALL display glucose history in tabular and chart formats
- System SHALL provide trend analysis: 7-day, 30-day, 90-day views
- System SHALL calculate average glucose, standard deviation, time in range (70-180 mg/dL)
- System SHALL estimate HbA1c based on average glucose (GMI - Glucose Management Indicator)

**FR2.3 Glucose Pattern Detection**
- System SHALL identify hypo/hyperglycemia patterns using ML algorithms
- System SHALL detect dawn phenomenon (early morning high glucose)
- System SHALL detect post-meal spikes consistently above target
- System SHALL provide personalized recommendations based on patterns

**FR2.4 Glucose Alerts**
- System SHALL send alerts for critically low glucose (<70 mg/dL)
- System SHALL send alerts for critically high glucose (>250 mg/dL)
- System SHALL send reminders to log glucose if no reading in 24 hours
- Users SHALL be able to configure alert thresholds

### FR3: Diabetic Retinopathy (DR) Screening

**FR3.1 Retina Image Upload**
- Users SHALL be able to capture/upload fundus images using smartphone camera
- System SHALL support JPEG/PNG formats, max file size 10MB
- System SHALL validate image quality (resolution min 512x512, brightness, focus)
- System SHALL reject low-quality images with feedback to user

**FR3.2 DR Detection**
- System SHALL analyze retina images using Amazon Rekognition Custom Labels
- System SHALL classify DR severity: No DR, Mild NPDR, Moderate NPDR, Severe NPDR, PDR
- System SHALL achieve ≥92% sensitivity and ≥88% specificity (validated on test dataset)
- System SHALL return results within 30 seconds

**FR3.3 DR Results Display**
- System SHALL display DR classification with confidence score
- System SHALL provide visual explanation (heatmap highlighting abnormalities)
- System SHALL provide actionable recommendations based on severity
- System SHALL recommend doctor consultation for Moderate+ DR
- System SHALL store DR scan history with timestamps

**FR3.4 DR Alerts**
- System SHALL send immediate alerts for Severe NPDR or PDR detection
- System SHALL notify linked doctors/ophthalmologists for high-risk cases
- System SHALL recommend re-screening intervals: 12 months (No DR), 6 months (Mild), 3 months (Moderate+)

### FR4: AI Meal Analyzer

**FR4.1 Food Image Upload**
- Users SHALL be able to capture/upload meal photos
- System SHALL support JPEG/PNG formats, max file size 5MB
- System SHALL accept multiple food items in a single image

**FR4.2 Food Recognition**
- System SHALL identify Indian dishes using AWS Bedrock Amazon Nova Pro
- System SHALL recognize ≥500 regional dishes (North/South/East/West Indian cuisine)
- System SHALL detect multiple food items in a single image
- System SHALL estimate portion sizes (small, medium, large, or grams)

**FR4.3 Nutritional Analysis**
- System SHALL estimate total carbohydrates per meal (grams)
- System SHALL estimate calories, protein, fat, fiber
- System SHALL look up nutritional data from Indian Food Composition Database
- System SHALL provide glycemic index (GI) and glycemic load (GL) for identified foods

**FR4.4 Meal Logging**
- System SHALL auto-populate meal log with recognized foods
- Users SHALL be able to edit/confirm recognized foods
- System SHALL timestamp meals (breakfast, lunch, dinner, snack)
- System SHALL correlate meals with post-meal glucose readings (if logged)

**FR4.5 Meal Recommendations**
- System SHALL suggest healthier alternatives for high-carb meals
- System SHALL recommend portion adjustments based on glucose trends
- System SHALL provide carb-counting tips for insulin users

### FR5: AI Diabetes Advisor Chatbot

**FR5.1 Conversational Interface**
- Users SHALL interact with AI chatbot via text input
- System SHALL use AWS Bedrock Claude 3 Haiku for responses
- System SHALL maintain conversation context (last 10 messages)
- System SHALL respond within 5 seconds

**FR5.2 Multilingual Support**
- System SHALL support English and Hindi (minimum)
- System SHALL support Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam (recommended)
- Users SHALL be able to switch languages mid-conversation
- System SHALL auto-detect language from user input

**FR5.3 Diabetes Guidance**
- Chatbot SHALL answer questions about diabetes management
- Chatbot SHALL provide medication reminders and dosage information
- Chatbot SHALL explain lab test results (HbA1c, lipid profile, kidney function)
- Chatbot SHALL offer lifestyle advice (diet, exercise, stress management)
- Chatbot SHALL NOT provide medical diagnosis (disclaimer displayed)

**FR5.4 Retrieval-Augmented Generation (RAG)**
- System SHALL use Bedrock Knowledge Base for accurate diabetes information
- Knowledge base SHALL include: ADA/IDF guidelines, ICMR diabetes management protocols, WHO diabetes factsheets
- System SHALL cite sources for medical information

**FR5.5 Chat History**
- System SHALL store chat history for user reference
- Users SHALL be able to search past conversations
- Users SHALL be able to delete chat history

### FR6: Health Dashboard

**FR6.1 Overview Metrics**
- Dashboard SHALL display current glucose status (last reading, trend arrow)
- Dashboard SHALL display HbA1c estimate (GMI)
- Dashboard SHALL display time in range (TIR) percentage (last 7/30 days)
- Dashboard SHALL display days since last DR scan
- Dashboard SHALL display complication risk score (0-100)

**FR6.2 Data Visualization**
- Dashboard SHALL show glucose trend chart (last 7 days)
- Dashboard SHALL show meal vs. glucose correlation chart
- Dashboard SHALL show weekly activity summary
- Dashboard SHALL show medication adherence rate

**FR6.3 Personalized Insights**
- System SHALL generate weekly health reports
- System SHALL highlight achievements (e.g., "5 days in target range")
- System SHALL identify areas for improvement
- System SHALL provide actionable next steps

### FR7: Complication Risk Assessment

**FR7.1 Risk Calculation**
- System SHALL calculate risk scores for: diabetic retinopathy, diabetic foot ulcer, diabetic nephropathy, cardiovascular disease
- System SHALL use validated risk models (e.g., UKPDS Risk Engine for CVD)
- System SHALL consider factors: HbA1c, diabetes duration, age, blood pressure, cholesterol, smoking status

**FR7.2 Risk Display**
- System SHALL display risk levels: Low, Moderate, High, Very High
- System SHALL show 10-year risk percentages
- System SHALL provide risk reduction strategies

### FR8: Doctor/Clinical Dashboard (Phase 2)

**FR8.1 Patient Management**
- Doctors SHALL be able to view assigned patients
- Doctors SHALL be able to review patient glucose history, DR scans, risk assessments
- Doctors SHALL be able to add clinical notes

**FR8.2 DR Scan Review**
- Doctors SHALL be able to override AI DR classification
- Doctors SHALL be able to mark false positives/negatives for model improvement
- Doctors SHALL be able to recommend treatment plans

**FR8.3 Telemedicine Integration**
- Doctors SHALL be able to schedule video consultations
- System SHALL integrate with third-party video APIs (Twilio, Agora)

### FR9: ASHA Worker Dashboard (Phase 2)

**FR9.1 Population Health Monitoring**
- ASHA workers SHALL view aggregated health metrics for assigned population
- System SHALL highlight high-risk patients requiring intervention
- ASHA workers SHALL be able to mark patients for follow-up

**FR9.2 Health Education**
- ASHA workers SHALL access diabetes education materials in regional languages
- System SHALL provide shareable infographics and videos

### FR10: ABDM Integration

**FR10.1 ABHA Linking**
- Users SHALL be able to link their Ayushman Bharat Health Account (ABHA)
- System SHALL fetch existing health records via ABDM Health Information Exchange (HIE)

**FR10.2 Health Record Sharing**
- Users SHALL be able to share glucose data, DR scans with consented healthcare providers
- System SHALL comply with ABDM consent management framework
- All data sharing SHALL be encrypted and audited

### FR11: Notifications

**FR11.1 Push Notifications**
- System SHALL send glucose reminders, medication reminders, DR screening reminders
- Users SHALL be able to configure notification frequency

**FR11.2 SMS Notifications**
- System SHALL send critical alerts via SMS (high/low glucose, severe DR detection)
- SMS SHALL be sent for 2FA/OTP

**FR11.3 Email Notifications**
- System SHALL send weekly health summary reports via email
- Email SHALL include PDF report attachment

### FR12: Offline Functionality

**FR12.1 Offline Data Entry**
- PWA SHALL allow glucose logging, meal logging, chatbot interaction when offline
- System SHALL queue data for sync when connection available

**FR12.2 Offline Data Viewing**
- Users SHALL be able to view cached glucose history (last 30 days)
- Users SHALL be able to view cached DR scan results

**FR12.3 Background Sync**
- System SHALL auto-sync queued data when internet connection detected
- System SHALL notify user of successful sync

---

## Non-Functional Requirements

### NFR1: Performance

**NFR1.1 Response Time**
- API response time SHALL be <500ms for 95% of requests
- DR detection SHALL complete within 30 seconds
- Chatbot responses SHALL be generated within 5 seconds
- Page load time SHALL be <3 seconds on 3G networks

**NFR1.2 Throughput**
- System SHALL support 10,000 concurrent users
- System SHALL handle 200 requests/second per user
- DR detection SHALL process 100 concurrent scans

**NFR1.3 Scalability**
- System SHALL scale horizontally to support 100,000+ users without performance degradation
- Database SHALL support 10M+ glucose readings
- Storage SHALL support 1M+ retina images

### NFR2: Availability & Reliability

**NFR2.1 Uptime**
- System SHALL maintain 99.5% uptime (max 3.65 hours downtime/month)
- Planned maintenance SHALL be scheduled during low-traffic hours (2-4 AM IST)

**NFR2.2 Fault Tolerance**
- System SHALL deploy across 2+ AWS Availability Zones for redundancy
- System SHALL implement auto-recovery for Lambda function failures
- Database SHALL enable Multi-AZ deployment with automated failover

**NFR2.3 Data Durability**
- S3 SHALL provide 99.999999999% (11 nines) durability for images
- DynamoDB SHALL enable point-in-time recovery (PITR)
- RDS SHALL maintain 7-day automated backups

### NFR3: Security

**NFR3.1 Authentication & Authorization**
- System SHALL enforce HTTPS/TLS 1.3 for all communications
- JWT tokens SHALL expire after 1 hour (refresh tokens valid for 30 days)
- API endpoints SHALL implement role-based access control (RBAC)
- System SHALL comply with AWS IAM least privilege principle

**NFR3.2 Data Encryption**
- Data at rest SHALL be encrypted using AES-256 (DynamoDB, S3, RDS)
- Data in transit SHALL be encrypted using TLS 1.3
- Encryption keys SHALL be managed via AWS KMS

**NFR3.3 Compliance**
- System SHALL comply with India's Digital Personal Data Protection Act 2023
- System SHALL implement HIPAA-equivalent safeguards for health data
- System SHALL comply with GDPR for international users

**NFR3.4 Audit Logging**
- All data access SHALL be logged via AWS CloudTrail
- Logs SHALL be retained for 1 year
- Unauthorized access attempts SHALL trigger alerts

### NFR4: Usability

**NFR4.1 Mobile-First Design**
- UI SHALL be responsive for screen sizes 320px-1920px
- Touch targets SHALL be ≥48x48 dp
- App SHALL be installable as PWA (Add to Home Screen)

**NFR4.2 Accessibility**
- System SHALL comply with WCAG 2.1 Level AA
- UI SHALL support screen readers (VoiceOver, TalkBack)
- Color contrast ratio SHALL be ≥4.5:1
- System SHALL support keyboard navigation

**NFR4.3 Internationalization**
- UI SHALL support RTL languages (Urdu)
- Date/time formats SHALL adapt to locale
- Number formats SHALL support Indian numbering system (lakh, crore)

### NFR5: Maintainability

**NFR5.1 Code Quality**
- Code coverage SHALL be ≥80% for unit tests
- Code SHALL pass ESLint/Pylint with zero errors
- Code SHALL follow Airbnb JavaScript Style Guide / PEP 8 (Python)

**NFR5.2 Documentation**
- All APIs SHALL be documented using OpenAPI 3.0
- README SHALL include setup instructions
- Code SHALL include inline comments for complex logic

**NFR5.3 Monitoring**
- System SHALL implement CloudWatch dashboards for key metrics
- Error rate alarms SHALL trigger at >1% threshold
- Latency alarms SHALL trigger at >2s p99 threshold

### NFR6: Cost Optimization

**NFR6.1 Budget Constraints**
- Monthly AWS cost SHALL NOT exceed ₹60,000 for 10,000 users
- Cost per user SHALL be ≤₹6/month

**NFR6.2 Resource Optimization**
- Lambda functions SHALL use ARM64 (Graviton2) for 20% cost savings
- DynamoDB SHALL use on-demand capacity mode
- S3 images SHALL transition to S3 Glacier after 1 year (lifecycle policy)

### NFR7: Interoperability

**NFR7.1 ABDM Integration**
- System SHALL comply with ABDM FHIR-based APIs
- Health records SHALL use FHIR R4 format

**NFR7.2 Data Export**
- Users SHALL be able to export data in CSV, JSON, PDF formats
- Exported data SHALL include glucose logs, DR reports, meal logs

---

## User Stories

### Epic 1: Patient Onboarding

**US1.1: As a new user, I want to register using my phone number so that I can quickly create an account without email.**
- Acceptance Criteria:
  - User enters phone number in E.164 format (+91XXXXXXXXXX)
  - OTP is sent within 10 seconds
  - User enters 6-digit OTP
  - Account is created upon OTP verification

**US1.2: As a diabetic patient, I want to link my ABHA ID so that doctors can access my medical history.**
- Acceptance Criteria:
  - User enters 14-digit ABHA number
  - System validates ABHA via ABDM API
  - User consents to data sharing
  - ABHA is linked to profile

### Epic 2: Glucose Management

**US2.1: As a diabetic, I want to log my glucose readings so that I can track trends over time.**
- Acceptance Criteria:
  - User selects meal context (fasting, pre-meal, post-meal)
  - User enters glucose value (70-400 mg/dL range)
  - Reading is timestamped automatically
  - Reading appears in history within 1 second

**US2.2: As a user, I want to see my 30-day glucose trend so that I understand if my diabetes is well-controlled.**
- Acceptance Criteria:
  - Chart displays last 30 days of glucose readings
  - Target range (70-180 mg/dL) is highlighted in green
  - Average glucose is displayed
  - HbA1c estimate (GMI) is shown

### Epic 3: DR Screening

**US3.1: As a diabetic, I want to upload a retina scan from my phone so that I can check for diabetic retinopathy without visiting a clinic.**
- Acceptance Criteria:
  - User captures photo using smartphone camera
  - Image is validated for quality (resolution, brightness)
  - Low-quality images are rejected with guidance
  - Image uploads successfully to S3

**US3.2: As a user, I want to receive DR results within 30 seconds so that I get immediate feedback.**
- Acceptance Criteria:
  - DR classification (No DR to PDR) is displayed
  - Confidence score is shown (e.g., 94%)
  - Recommendation is provided (e.g., "Consult ophthalmologist within 1 week")
  - Result is saved to history

### Epic 4: AI Assistance

**US4.1: As a non-English speaker, I want to ask diabetes questions in Hindi so that I can get guidance in my native language.**
- Acceptance Criteria:
  - User types question in Hindi (Devanagari script)
  - Chatbot responds in Hindi within 5 seconds
  - Response is medically accurate
  - Source citations are provided (if clinical guideline)

**US4.2: As a diabetic, I want to upload a meal photo so that I know how many carbs I'm consuming.**
- Acceptance Criteria:
  - User uploads photo of meal (e.g., chapati, dal, rice)
  - System identifies all food items
  - Total carbohydrates are estimated (e.g., 65g)
  - Glycemic load is calculated

### Epic 5: Offline Access

**US5.1: As a rural user with intermittent connectivity, I want to log glucose readings offline so that I don't lose data.**
- Acceptance Criteria:
  - User logs glucose reading when offline
  - Data is stored in IndexedDB
  - "Syncing..." indicator appears when online
  - Data syncs to cloud automatically

---

## Acceptance Criteria

### AC1: DR Detection Accuracy
- **GIVEN** a dataset of 1,000 fundus images with expert-labeled ground truth
- **WHEN** the system processes all images
- **THEN** sensitivity SHALL be ≥92% AND specificity SHALL be ≥88%

### AC2: Chatbot Response Quality
- **GIVEN** 100 common diabetes questions
- **WHEN** the chatbot is asked these questions
- **THEN** ≥90% of responses SHALL be rated "helpful" by 3 independent evaluators

### AC3: Mobile Performance
- **GIVEN** a user on a 3G network (2 Mbps)
- **WHEN** the user opens the dashboard
- **THEN** page SHALL load within 3 seconds

### AC4: Offline Sync
- **GIVEN** a user logs 10 glucose readings offline
- **WHEN** internet connection is restored
- **THEN** all 10 readings SHALL sync within 30 seconds

### AC5: Security
- **GIVEN** an API request without valid JWT token
- **WHEN** the request is sent to a protected endpoint
- **THEN** system SHALL return 401 Unauthorized

---

## Constraints and Assumptions

### Technical Constraints

1. **AWS Region**: Deployment limited to ap-south-1 (Mumbai) for low latency to Indian users
2. **Budget**: Monthly AWS cost capped at ₹60,000 for MVP (10K users)
3. **Device Support**:
   - Mobile browsers: Chrome 90+, Safari 14+
   - Desktop browsers: Chrome, Firefox, Edge (latest 2 versions)
   - OS: Android 8+, iOS 14+
4. **DR Model Limitation**: Rekognition Custom Labels requires minimum 2 inference units (~$1/hour) when active
5. **Bedrock Access**: Requires AWS account with Bedrock model access (Claude, Nova) enabled

### Business Assumptions

1. **User Adoption**: Assumes 10,000 active users in Year 1, growing to 100,000 by Year 3
2. **Engagement**: Assumes average user logs glucose 3-4 times/week
3. **DR Scanning**: Assumes 5% of users upload DR scans per month (500 scans/month for 10K users)
4. **Regulatory Approval**: Assumes app does NOT require CDSCO approval as SaMD (Software as Medical Device) since it provides "decision support" not "diagnosis"
5. **Internet Penetration**: Assumes 60% of rural users have 2G/3G access
6. **ABDM Readiness**: Assumes ABDM APIs are stable and accessible for integration

### Data Assumptions

1. **Indian Food Database**: Assumes availability of open-source Indian food nutritional database (IFCT 2017)
2. **DR Training Data**: Assumes access to Kaggle Diabetic Retinopathy dataset (35K images) for model training
3. **Language Models**: Assumes AWS Bedrock supports Hindi, Tamil, Telugu out-of-the-box

### Operational Assumptions

1. **Support**: Assumes email support (no 24/7 live chat for MVP)
2. **Deployment**: Assumes CI/CD via AWS Amplify (auto-deploy on git push to main)
3. **Monitoring**: Assumes manual review of CloudWatch dashboards (no dedicated DevOps engineer)

---

## Out of Scope (MVP)

The following features are **NOT included** in the MVP but may be considered for future releases:

1. **CGM Integration**: Real-time continuous glucose monitoring device integration (Abbott FreeStyle Libre, Dexcom)
2. **Insulin Dosing Calculator**: Automated insulin dose recommendations
3. **Activity Tracking**: Step counter, exercise logging via wearables
4. **Social Features**: Community forums, peer support groups
5. **Gamification**: Badges, streaks, leaderboards
6. **Prescription Management**: E-prescription generation, pharmacy integration
7. **Insurance Integration**: Claims processing, policy management
8. **Multi-Disease Support**: Hypertension, cardiovascular disease beyond diabetes
9. **Voice Interface**: Voice commands for hands-free logging
10. **Smartwatch App**: Native watchOS/WearOS apps

---

**Version:** 1.0
**Last Updated:** 2026-01-25
**Authors:** DiabetCare AI Team
**Reviewers:** AWS AI for Bharat Hackathon Submission

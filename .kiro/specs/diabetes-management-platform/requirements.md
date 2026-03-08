# Requirements Document

## Introduction

Nazar AI (DiabetCare AI) is a mobile-first Progressive Web App (PWA) designed to prevent diabetes complications and blindness in India's 89.8 million diabetics through AI-powered diabetic retinopathy screening, glucose tracking, meal analysis, and personalized diabetes guidance using AWS AI services.

**Live Prototype:** https://main.d3vwqyp1h0elbo.amplifyapp.com/
**Status:** React MVP deployed with Requirement 1 (auth), Requirement 2 (glucose tracker — DynamoDB), Requirement 3 (DR screening UI), Requirement 5 (chatbot — Amazon Nova Micro LIVE), Requirement 6 (dashboard), and multilingual support. 14/14 E2E tests passing (Vitest). Rekognition Custom Labels for DR screening in progress.

## Glossary

- **NazarAI_System** (also DiabetCare_System): The complete diabetes management platform including PWA, backend services, and AI components
- **DR_Scanner**: The diabetic retinopathy detection module using Amazon Rekognition Custom Labels
- **Glucose_Tracker**: The blood glucose monitoring and trend analysis component
- **Meal_Analyzer**: The AI-powered food recognition and carbohydrate estimation system using AWS Bedrock Nova Pro
- **Diabetes_Advisor**: The multilingual chatbot using AWS Bedrock Amazon Nova Micro (APAC inference profile, DEPLOYED via Lambda Function URL)
- **User**: A diabetic patient, pre-diabetic individual, or healthcare professional using the system
- **Fundus_Image**: A photograph of the retina used for diabetic retinopathy screening
- **HbA1c**: Hemoglobin A1c, a measure of average blood glucose over 2-3 months
- **NPDR**: Non-Proliferative Diabetic Retinopathy
- **PDR**: Proliferative Diabetic Retinopathy
- **GI**: Glycemic Index, a measure of how quickly foods raise blood glucose
- **ABHA**: Ayushman Bharat Health Account, India's digital health ID

## Requirements

### Requirement 1

**User Story:** As a diabetic patient, I want to register and authenticate securely, so that I can access personalized diabetes management features.

#### Acceptance Criteria

1. WHEN a user provides email or phone number for registration, THE DiabetCare_System SHALL send an OTP for verification within 10 seconds
2. WHEN a user enters valid credentials, THE DiabetCare_System SHALL authenticate the user and provide access to the dashboard
3. WHEN a user fails authentication 5 times, THE DiabetCare_System SHALL lock the account for 30 minutes
4. WHERE a user chooses Google OAuth, THE DiabetCare_System SHALL authenticate using Google's OAuth 2.0 protocol
5. WHEN a user updates their profile information, THE DiabetCare_System SHALL validate and save the changes immediately

### Requirement 2

**User Story:** As a diabetic patient, I want to log and track my blood glucose readings, so that I can monitor my diabetes control over time.

#### Acceptance Criteria

1. WHEN a user enters a glucose reading between 20-600 mg/dL, THE Glucose_Tracker SHALL save the reading with timestamp and meal context
2. WHEN a user enters an invalid glucose value, THE Glucose_Tracker SHALL reject the entry and display an error message
3. WHEN a user views glucose history, THE Glucose_Tracker SHALL display readings in chart format for 7-day, 30-day, and 90-day periods
4. WHEN glucose readings are available, THE Glucose_Tracker SHALL calculate and display HbA1c estimate using the GMI formula
5. IF a glucose reading is below 70 mg/dL or above 250 mg/dL, THEN THE Glucose_Tracker SHALL send an immediate alert to the user

### Requirement 3

**User Story:** As a diabetic patient, I want to screen for diabetic retinopathy using my smartphone camera, so that I can detect eye complications early without visiting a clinic.

#### Acceptance Criteria

1. WHEN a user uploads a fundus image, THE DR_Scanner SHALL validate image quality with minimum 512x512 resolution
2. WHEN a valid fundus image is processed, THE DR_Scanner SHALL analyze it using Amazon Rekognition Custom Labels and return results within 30 seconds
3. WHEN DR analysis is complete, THE DR_Scanner SHALL classify the result as No DR, Mild NPDR, Moderate NPDR, Severe NPDR, or PDR with confidence score
4. IF Severe NPDR or PDR is detected, THEN THE DR_Scanner SHALL send an immediate alert recommending urgent ophthalmologist consultation
5. WHEN DR results are displayed, THE DR_Scanner SHALL provide actionable recommendations based on severity level

### Requirement 4

**User Story:** As a diabetic patient, I want to analyze my meals using photo recognition, so that I can understand the carbohydrate content and glycemic impact of Indian foods.

#### Acceptance Criteria

1. WHEN a user uploads a meal photo, THE Meal_Analyzer SHALL process it using AWS Bedrock Nova Pro to identify Indian food items
2. WHEN food items are identified, THE Meal_Analyzer SHALL estimate portion sizes and calculate total carbohydrates in grams
3. WHEN nutritional analysis is complete, THE Meal_Analyzer SHALL look up glycemic index values from the Indian Food Composition Database
4. WHEN meal analysis results are ready, THE Meal_Analyzer SHALL display identified foods, carbohydrate content, and predicted glucose impact
5. WHERE multiple food items are detected in one image, THE Meal_Analyzer SHALL provide separate analysis for each item

### Requirement 5

**User Story:** As a diabetic patient, I want to ask diabetes-related questions to an AI advisor in my preferred language, so that I can get 24/7 guidance and education.

#### Acceptance Criteria

1. WHEN a user sends a message to the chatbot, THE Diabetes_Advisor SHALL respond using AWS Bedrock Amazon Nova Micro within 5 seconds
2. WHERE a user selects Hindi as their language, THE Diabetes_Advisor SHALL respond in Hindi using appropriate medical terminology
3. WHEN providing medical information, THE Diabetes_Advisor SHALL cite sources from the Bedrock Knowledge Base containing diabetes guidelines
4. WHEN a user asks for medical diagnosis, THE Diabetes_Advisor SHALL decline and display a disclaimer directing them to consult healthcare professionals
5. WHILE maintaining conversation context, THE Diabetes_Advisor SHALL remember the last 10 messages for coherent dialogue

### Requirement 6

**User Story:** As a diabetic patient, I want to view a comprehensive health dashboard, so that I can quickly understand my current diabetes status and trends.

#### Acceptance Criteria

1. WHEN a user opens the dashboard, THE DiabetCare_System SHALL display current glucose status, HbA1c estimate, and time in range percentage
2. WHEN glucose data is available, THE DiabetCare_System SHALL show a trend chart for the last 7 days with target range highlighted
3. WHEN DR scan history exists, THE DiabetCare_System SHALL display days since last scan and latest risk level
4. WHEN generating weekly reports, THE DiabetCare_System SHALL highlight achievements and identify areas for improvement
5. WHERE complication risk factors are present, THE DiabetCare_System SHALL calculate and display risk scores for retinopathy, nephropathy, and cardiovascular disease

### Requirement 7

**User Story:** As a rural diabetic patient with intermittent internet connectivity, I want to use core features offline, so that I can continue managing my diabetes without constant internet access.

#### Acceptance Criteria

1. WHEN the user is offline, THE DiabetCare_System SHALL allow glucose logging and store data in IndexedDB
2. WHEN internet connection is restored, THE DiabetCare_System SHALL automatically sync queued data to the cloud within 30 seconds
3. WHILE offline, THE DiabetCare_System SHALL provide access to cached glucose history for the last 30 days
4. WHEN offline, THE Diabetes_Advisor SHALL provide basic responses using cached diabetes education content
5. WHERE the user is offline, THE DiabetCare_System SHALL display a clear indicator showing offline status and pending sync items

### Requirement 8

**User Story:** As a healthcare professional, I want to review patient data and DR scan results, so that I can provide informed clinical decisions and override AI classifications when necessary.

#### Acceptance Criteria

1. WHEN a doctor accesses the clinical dashboard, THE DiabetCare_System SHALL display assigned patients with their latest glucose trends and DR scan results
2. WHEN reviewing DR scan results, THE DiabetCare_System SHALL allow doctors to override AI classifications and mark false positives or negatives
3. WHEN a doctor adds clinical notes, THE DiabetCare_System SHALL timestamp and associate them with the patient's record
4. WHERE high-risk patients are identified, THE DiabetCare_System SHALL highlight them for priority review
5. WHEN treatment plans are recommended, THE DiabetCare_System SHALL allow doctors to create and share them with patients

### Requirement 9

**User Story:** As a user, I want to integrate with India's digital health ecosystem, so that I can share my health data with authorized healthcare providers and access existing medical records.

#### Acceptance Criteria

1. WHEN a user links their ABHA ID, THE DiabetCare_System SHALL validate it through ABDM APIs and fetch existing health records
2. WHEN sharing health data, THE DiabetCare_System SHALL implement ABDM consent management framework requiring explicit user approval
3. WHEN data is shared with healthcare providers, THE DiabetCare_System SHALL encrypt all transmissions and maintain audit logs
4. WHERE users export their data, THE DiabetCare_System SHALL provide CSV, JSON, and PDF formats including glucose logs, DR reports, and meal logs
5. WHILE maintaining FHIR R4 compliance, THE DiabetCare_System SHALL format health records for interoperability with other ABDM-compliant systems

### Requirement 10

**User Story:** As a system administrator, I want the platform to maintain high performance and security standards, so that users receive reliable service while their health data remains protected.

#### Acceptance Criteria

1. WHEN processing API requests, THE DiabetCare_System SHALL respond within 500ms for 95% of requests
2. WHEN handling concurrent users, THE DiabetCare_System SHALL support 10,000 simultaneous users without performance degradation
3. WHILE encrypting data, THE DiabetCare_System SHALL use AES-256 for data at rest and TLS 1.3 for data in transit
4. WHEN storing health data, THE DiabetCare_System SHALL comply with India's Digital Personal Data Protection Act 2023
5. IF unauthorized access is attempted, THEN THE DiabetCare_System SHALL log the attempt via AWS CloudTrail and trigger security alerts
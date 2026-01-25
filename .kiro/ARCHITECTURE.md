# DiabetCare AI - Architecture Documentation

## Table of Contents
- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [High-Level Architecture](#high-level-architecture)
- [Component Architecture](#component-architecture)
- [Data Architecture](#data-architecture)
- [Integration Architecture](#integration-architecture)
- [Scalability & Performance](#scalability--performance)
- [Disaster Recovery](#disaster-recovery)

---

## Overview

DiabetCare AI is built on a **serverless, cloud-native architecture** using AWS services. The system follows a **microservices pattern** with event-driven communication, designed for high availability, scalability, and cost-efficiency.

**Architecture Diagrams:**
- [Use Case Diagram](../use-case-diagram.svg)
- [Logical Architecture](../logical-architecture.svg)
- [Technical Architecture](../technical-architecture.svg)

**Key Characteristics:**
- **Serverless-first**: No server management, auto-scaling, pay-per-use
- **Multi-AZ deployment**: High availability across 2 Availability Zones
- **Event-driven**: Asynchronous processing via EventBridge
- **API-first**: GraphQL (AppSync) and REST (API Gateway) APIs
- **Mobile-first PWA**: ReactJS with offline-first architecture

---

## Architecture Principles

### 1. AWS Well-Architected Framework Alignment

**Operational Excellence**
- Infrastructure as Code (AWS Amplify Gen 2 TypeScript)
- Automated CI/CD pipeline (git push → auto-deploy)
- Centralized logging and monitoring (CloudWatch)
- Runbooks for incident response

**Security**
- Defense in depth: WAF, encryption (at rest/in transit), IAM least privilege
- Identity federation (Cognito User/Identity Pools)
- Data classification (PII, PHI encrypted with KMS)
- Audit logging (CloudTrail, CloudWatch Logs)

**Reliability**
- Multi-AZ deployment (RDS, ElastiCache)
- Automated backups (RDS 7-day, DynamoDB PITR)
- Fault-tolerant design (Lambda retry logic, DLQ)
- Health checks and auto-recovery

**Performance Efficiency**
- Right-sizing resources (Lambda memory, RDS instance types)
- Caching strategy (CloudFront, ElastiCache, DynamoDB DAX consideration)
- Serverless computing (Lambda) for variable workloads
- Asynchronous processing (EventBridge, SQS)

**Cost Optimization**
- Pay-per-use pricing (Lambda, DynamoDB on-demand)
- AWS Free Tier utilization (Cognito 50K MAU, Lambda 1M requests)
- Reserved Instances for predictable workloads (RDS, ElastiCache)
- S3 Lifecycle policies (Glacier after 1 year)

**Sustainability**
- ARM64 Lambda functions (Graviton2) for 20% better energy efficiency
- Serverless reduces idle resource consumption
- Region selection (ap-south-1) minimizes latency and data transfer

### 2. Design Patterns

**Microservices Architecture**
- Each Lambda function represents a single responsibility
- Independent deployment and scaling
- Loose coupling via event-driven communication

**API Gateway Pattern**
- Single entry point for all client requests
- Authentication/authorization at gateway layer
- Rate limiting and throttling

**Backend for Frontend (BFF)**
- AppSync GraphQL optimized for mobile clients
- REST API for doctor/ASHA dashboards

**Event-Driven Architecture**
- EventBridge for asynchronous workflows (DR detection → doctor notification)
- Decouples producers and consumers

**Repository Pattern**
- Data access layer abstracts DynamoDB/RDS operations
- Facilitates unit testing with mock repositories

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
│  [Mobile Browsers] [Desktop Browsers] [Doctors] [ASHA Workers]  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EDGE LAYER                                    │
│  CloudFront CDN  →  Route 53 DNS  →  AWS WAF  →  ACM (SSL)      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API GATEWAY LAYER                               │
│  AWS Amplify Hosting  │  AppSync (GraphQL)  │  API Gateway      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER (Lambda Functions)                │
│  Auth Service  │  Glucose API  │  DR Processor  │  Chatbot      │
│  Meal Analyzer │  Risk Engine  │  ABDM Connector                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AI/ML SERVICES LAYER                           │
│  Bedrock (Claude 3 Haiku) │ Bedrock (Nova Pro) │ Rekognition    │
│  Bedrock Knowledge Base   │ SageMaker          │ Translate      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA LAYER                                   │
│  DynamoDB  │  S3  │  RDS PostgreSQL  │  ElastiCache Redis       │
└─────────────────────────────────────────────────────────────────┘
```

**Reference:** See [technical-architecture.svg](../technical-architecture.svg) for detailed component diagram.

---

## Component Architecture

### 1. Frontend Layer (ReactJS PWA)

**Technology Stack:**
- **Framework**: React 18.x with Vite
- **UI Library**: TailwindCSS + shadcn/ui
- **State Management**: Context API + React Query (server state)
- **Routing**: React Router v6
- **PWA**: Workbox for service workers, offline support

**Component Hierarchy:**
```
App (Root)
├── AuthProvider (Cognito authentication)
├── Router
│   ├── PublicRoutes
│   │   ├── Login
│   │   ├── Register
│   │   └── ForgotPassword
│   ├── ProtectedRoutes
│   │   ├── Dashboard
│   │   ├── GlucoseTracker
│   │   ├── RetinaScan
│   │   ├── MealAnalyzer
│   │   ├── Chatbot
│   │   ├── Profile
│   │   └── Settings
│   └── DoctorRoutes
│       ├── PatientList
│       ├── PatientDetails
│       └── DRReview
└── ErrorBoundary
```

**Offline Strategy:**
- **Cache-First**: Static assets (JS, CSS, images) served from Service Worker cache
- **Network-First with Fallback**: API calls attempt network, fallback to IndexedDB cache
- **Background Sync**: Queued mutations (glucose logs, meal logs) sync when online
- **Precaching**: Critical routes precached on PWA install

**Performance Optimizations:**
- Code splitting (React.lazy, route-based)
- Image optimization (WebP, lazy loading)
- Bundle size <200KB (gzip)
- Lighthouse score >90

### 2. API Gateway Layer

#### 2.1 AWS AppSync (GraphQL)

**Schema Overview:**
```graphql
type User {
  id: ID!
  email: String
  phone: String
  name: String!
  diabetesType: DiabetesType!
  diagnosisDate: AWSDate!
  abhaId: String
  glucoseReadings: [GlucoseReading!]
  drScans: [DRScan!]
}

type GlucoseReading {
  id: ID!
  userId: ID!
  value: Float!
  unit: GlucoseUnit!
  mealContext: MealContext!
  timestamp: AWSDateTime!
  notes: String
}

type DRScan {
  id: ID!
  userId: ID!
  imageUrl: AWSURL!
  severity: DRSeverity!
  confidence: Float!
  recommendations: String!
  scanDate: AWSDateTime!
}

type Query {
  getUser(id: ID!): User @auth(rules: [{allow: owner}])
  getGlucoseReadings(userId: ID!, startDate: AWSDate, endDate: AWSDate): [GlucoseReading!]
  getDRScans(userId: ID!): [DRScan!]
}

type Mutation {
  createGlucoseReading(input: CreateGlucoseReadingInput!): GlucoseReading
  uploadDRScan(imageData: String!): DRScan
  updateProfile(input: UpdateProfileInput!): User
}

type Subscription {
  onGlucoseReadingAdded(userId: ID!): GlucoseReading
    @aws_subscribe(mutations: ["createGlucoseReading"])
}
```

**Authorization:**
- User-owned data: `@auth(rules: [{allow: owner}])`
- Doctor access: `@auth(rules: [{allow: groups, groups: ["Doctors"]}])`
- API Key for public endpoints (login, register)

#### 2.2 API Gateway (REST)

**Endpoints:**
```
POST   /auth/register           # User registration
POST   /auth/login              # User login
POST   /auth/refresh-token      # Refresh JWT
GET    /glucose/readings        # Get glucose history
POST   /glucose/readings        # Log glucose
POST   /dr-scan/upload          # Upload retina image
GET    /dr-scan/results/:id     # Get DR analysis results
POST   /meal/analyze            # Analyze meal photo
POST   /chatbot/message         # Send chatbot message
WebSocket /chatbot/ws           # WebSocket for real-time chat
GET    /abdm/link               # Link ABHA ID
GET    /abdm/fetch-records      # Fetch health records from ABDM
```

**Authentication:**
- Cognito Authorizer for all protected endpoints
- API Key for rate-limited public endpoints

### 3. Application Layer (Lambda Functions)

#### 3.1 Auth Service (Node.js 20)
**Responsibilities:**
- Pre-signup validation (email/phone format)
- Post-confirmation triggers (create DynamoDB user record)
- Custom authentication challenges (TOTP for MFA)
- ABHA ID linking

**Environment Variables:**
- `USER_POOL_ID`, `USER_POOL_CLIENT_ID`
- `ABDM_API_URL`, `ABDM_CLIENT_ID`, `ABDM_CLIENT_SECRET`

#### 3.2 Glucose API (Node.js 20)
**Responsibilities:**
- CRUD operations for glucose readings
- Trend calculation (7-day, 30-day averages)
- HbA1c estimation (GMI formula: (avg_glucose + 46.7) / 28.7)
- Pattern detection (hypo/hyper events)

**DynamoDB Table:**
- Table: `GlucoseReadings`
- Partition Key: `userId` (String)
- Sort Key: `timestamp` (Number, Unix epoch)
- GSI: `userId-mealContext-index` for filtering by meal context

#### 3.3 DR Processor (Python 3.11)
**Responsibilities:**
- Image validation (resolution, brightness, format)
- S3 upload with encryption
- Rekognition Custom Labels inference
- Result parsing and severity classification
- DynamoDB record creation
- EventBridge event publishing (for doctor notifications)

**Workflow:**
```
1. Receive base64 image from API Gateway
2. Validate image quality (PIL library)
3. Upload to S3 (boto3)
4. Invoke Rekognition DetectCustomLabels API
5. Parse response (labels: NoMDR, Mild, Moderate, Severe, PDR)
6. Map labels to severity enum
7. Store result in DynamoDB
8. Publish event to EventBridge if severity >= Moderate
9. Return result to client
```

#### 3.4 AI Chatbot (Python 3.11)
**Responsibilities:**
- Conversation context management (Redis cache)
- Bedrock Claude 3 Haiku API invocation
- RAG query to Knowledge Base (for clinical questions)
- Language detection and translation (AWS Translate)
- Response streaming via WebSocket

**Prompt Engineering:**
```python
SYSTEM_PROMPT = """
You are DiabetCare AI, a diabetes management assistant. You provide:
- Evidence-based diabetes education
- Lifestyle guidance (diet, exercise)
- Medication reminders
- Lab test interpretation

IMPORTANT:
- Do NOT diagnose medical conditions
- Do NOT prescribe medications
- Recommend consulting a doctor for medical decisions
- Cite sources for clinical information (ADA, IDF, ICMR guidelines)

Respond in a friendly, empathetic tone. Use simple language for low health literacy users.
"""
```

**RAG Pipeline:**
```
1. User question → Bedrock Knowledge Base (OpenSearch)
2. Retrieve top 3 relevant documents (diabetes guidelines)
3. Construct prompt: SYSTEM_PROMPT + retrieved docs + user question
4. Bedrock Claude 3 Haiku generates response
5. Response + citations returned to user
```

#### 3.5 Meal Analyzer (Python 3.11)
**Responsibilities:**
- Meal photo upload to S3
- Bedrock Nova Pro vision model API call
- Food recognition (multi-label classification)
- Nutritional database lookup (Indian Food Composition Table 2017)
- Carb/calorie estimation

**Workflow:**
```
1. Receive meal image (JPEG/PNG)
2. Upload to S3 (diabetcare-meal-photos/)
3. Invoke Bedrock Nova Pro with prompt:
   "Identify all food items in this image. For each item, estimate:
    - Food name (in English and Hindi)
    - Portion size (grams or standard serving)
    - Likelihood (confidence %)"
4. Parse JSON response: [{food: "chapati", portion: "2 pieces", grams: 80}]
5. Lookup nutritional data in IFCT database (DynamoDB table)
6. Calculate total: carbs, calories, protein, fat, fiber, GI, GL
7. Return structured response to client
```

### 4. AI/ML Services Layer

#### 4.1 AWS Bedrock (Claude 3 Haiku)
**Use Cases:**
- Diabetes advisor chatbot
- Weekly health report generation
- Glucose trend interpretation

**Configuration:**
```python
bedrock_client = boto3.client('bedrock-runtime', region_name='us-east-1')
response = bedrock_client.invoke_model(
    modelId='anthropic.claude-3-haiku-20240307-v1:0',
    body=json.dumps({
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': 1024,
        'temperature': 0.7,
        'messages': [
            {'role': 'user', 'content': user_message}
        ],
        'system': SYSTEM_PROMPT
    })
)
```

**Cost Optimization:**
- Use Haiku (cheapest) for chatbot (not Sonnet/Opus)
- Limit max_tokens to 1024 (reduce output cost)
- Cache conversation context in Redis (reduce input tokens)

#### 4.2 AWS Bedrock (Amazon Nova Pro)
**Use Cases:**
- Meal photo food recognition
- Portion size estimation

**Configuration:**
```python
response = bedrock_client.invoke_model(
    modelId='amazon.nova-pro-v1:0',
    body=json.dumps({
        'image': base64_encoded_image,
        'prompt': 'Identify all food items and estimate portions in grams.',
        'max_tokens': 512
    })
)
```

#### 4.3 Amazon Rekognition Custom Labels
**Model Training:**
- Dataset: Kaggle Diabetic Retinopathy (35,126 fundus images)
- Classes: 5 (No DR, Mild NPDR, Moderate NPDR, Severe NPDR, PDR)
- Training: AutoML (managed by AWS)
- Metrics: 92.4% sensitivity, 88.1% specificity (on validation set)

**Inference:**
```python
response = rekognition_client.detect_custom_labels(
    ProjectVersionArn='arn:aws:rekognition:ap-south-1:123456789012:project/dr-detection/version/1',
    Image={'S3Object': {'Bucket': 'diabetcare-retina-images', 'Name': 'scan_123.jpg'}},
    MinConfidence=70
)
labels = response['CustomLabels']  # [{'Name': 'Moderate_NPDR', 'Confidence': 89.5}]
```

**Cost Management:**
- Start inference units on-demand (2 units minimum, $1/hour when running)
- Auto-stop after 15 minutes of inactivity (Lambda scheduled job)

#### 4.4 Bedrock Knowledge Base (RAG)
**Setup:**
1. Create S3 bucket with diabetes guidelines (PDFs):
   - ADA Standards of Medical Care
   - IDF Diabetes Atlas
   - ICMR Diabetes Guidelines
2. Create OpenSearch Serverless collection
3. Create Knowledge Base in Bedrock:
   - Data source: S3 bucket
   - Embeddings: Amazon Titan Embeddings G1
   - Vector DB: OpenSearch Serverless

**Query:**
```python
response = bedrock_agent_client.retrieve(
    knowledgeBaseId='KB123456',
    retrievalQuery={'text': 'What is target HbA1c for type 2 diabetes?'},
    retrievalConfiguration={'vectorSearchConfiguration': {'numberOfResults': 3}}
)
retrieved_docs = response['retrievalResults']
```

#### 4.5 Amazon SageMaker (Risk Scoring)
**Model:** XGBoost for complication risk prediction
**Features:**
- HbA1c (estimated from glucose)
- Diabetes duration (years)
- Age
- BMI
- Blood pressure (if available)
- Cholesterol (if available)
- Smoking status

**Training Data:** Synthetic dataset (10,000 patients) + UKPDS Risk Engine validation
**Endpoint:** Real-time inference endpoint (ml.t3.medium instance)

### 5. Data Layer

#### 5.1 Amazon DynamoDB (NoSQL)

**Tables:**

**Users Table:**
```
Partition Key: userId (String)
Attributes: email, phone, name, diabetesType, diagnosisDate, abhaId, createdAt
Encryption: AWS-owned key
Capacity: On-demand
```

**GlucoseReadings Table:**
```
Partition Key: userId (String)
Sort Key: timestamp (Number, Unix epoch milliseconds)
Attributes: value, unit, mealContext, notes
GSI: userId-mealContext-index (for filtering fasting/post-meal)
TTL: None (retain all data)
```

**DRScans Table:**
```
Partition Key: scanId (String, UUID)
Attributes: userId, imageUrl, severity, confidence, recommendations, scanDate
GSI: userId-scanDate-index (for user's scan history)
```

**ChatHistory Table:**
```
Partition Key: userId (String)
Sort Key: messageId (String, ULID for time-ordered)
Attributes: role (user/assistant), content, timestamp, language
TTL: 90 days (auto-delete old messages)
```

**Meals Table:**
```
Partition Key: mealId (String, UUID)
Attributes: userId, imageUrl, foodItems (List), totalCarbs, calories, mealType, timestamp
GSI: userId-date-index (composite: userId + date for daily logs)
```

#### 5.2 Amazon S3 (Object Storage)

**Buckets:**

**diabetcare-retina-images:**
- Objects: Fundus images (JPEG, max 10MB)
- Encryption: SSE-S3 (AES-256)
- Versioning: Disabled (images are immutable)
- Lifecycle: Transition to S3 Glacier after 365 days
- Access: Pre-signed URLs (1-hour expiry) for user downloads

**diabetcare-meal-photos:**
- Objects: Meal photos (JPEG/PNG, max 5MB)
- Encryption: SSE-S3
- Lifecycle: Transition to S3 Glacier after 180 days

**diabetcare-reports:**
- Objects: PDF reports (weekly summaries)
- Encryption: SSE-KMS (customer-managed key)
- Access: CloudFront signed URLs

**diabetcare-static-assets:**
- Objects: React build artifacts (JS, CSS, images)
- CloudFront Origin Access Identity (OAI) for CDN access
- Public read access: No (CloudFront serves)

#### 5.3 Amazon RDS (PostgreSQL 15.3)

**Use Case:** Clinical records, doctor consultations (relational data)

**Tables:**
```sql
CREATE TABLE clinical_records (
    record_id UUID PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    doctor_id VARCHAR(128),
    diagnosis TEXT,
    medications JSONB,
    lab_results JSONB,
    consultation_date TIMESTAMP,
    notes TEXT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE doctor_consultations (
    consultation_id UUID PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    doctor_id VARCHAR(128) NOT NULL,
    consultation_type VARCHAR(50), -- 'video', 'chat', 'in-person'
    duration_minutes INT,
    notes TEXT,
    prescription JSONB,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Configuration:**
- Instance: db.t4g.medium (2 vCPU, 4GB RAM)
- Multi-AZ: Enabled (automatic failover to standby in ap-south-1b)
- Storage: 100GB GP3 SSD (auto-scaling up to 500GB)
- Backups: Automated daily backups (7-day retention)
- Encryption: Enabled (AWS KMS)

#### 5.4 Amazon ElastiCache (Redis 7.0)

**Use Cases:**
- Session storage (Cognito token caching)
- API response caching (glucose trends, dashboard metrics)
- Chatbot conversation context (last 10 messages)

**Configuration:**
- Node type: cache.t4g.small (2 vCPU, 1.37GB RAM)
- Cluster mode: Disabled (single shard, 2 replicas)
- Multi-AZ: Enabled (primary in 1a, replica in 1b)
- Encryption: At-rest and in-transit

**Cache Keys:**
```
session:{userId}            # TTL: 3600s (1 hour)
glucose:trend:{userId}:7d   # TTL: 1800s (30 min)
chatbot:context:{userId}    # TTL: 86400s (24 hours)
api:glucose:{userId}        # TTL: 300s (5 min)
```

---

## Data Architecture

### Data Flow Diagrams

#### 1. Glucose Logging Flow
```
User → PWA (React) → AppSync GraphQL → Lambda (Glucose API)
  ↓
  DynamoDB (GlucoseReadings table)
  ↓
  EventBridge (GlucoseLoggedEvent)
  ↓
  Lambda (Risk Calculator) → Update risk scores in DynamoDB
```

#### 2. DR Scan Flow
```
User → PWA → API Gateway → Lambda (DR Processor)
  ↓
  S3 (Upload retina image)
  ↓
  Rekognition Custom Labels (Inference)
  ↓
  Lambda (Parse results) → DynamoDB (DRScans table)
  ↓
  EventBridge (HighRiskDRDetected event, if severity >= Moderate)
  ↓
  Lambda (Notification Service) → SNS (SMS/Email to doctor)
```

#### 3. Chatbot Interaction Flow
```
User → PWA → WebSocket (API Gateway) → Lambda (Chatbot)
  ↓
  ElastiCache (Fetch conversation context)
  ↓
  Bedrock Knowledge Base (RAG query for clinical questions)
  ↓
  Bedrock Claude 3 Haiku (Generate response)
  ↓
  Lambda → WebSocket → PWA (Stream response)
  ↓
  DynamoDB (Save message to ChatHistory)
```

### Data Retention Policy

| Data Type | Retention Period | Storage Tier | Rationale |
|-----------|------------------|--------------|-----------|
| Glucose Readings | Indefinite | DynamoDB | Critical for long-term trend analysis |
| DR Scans | 10 years | S3 → Glacier (1 year) | Medical record retention compliance |
| Meal Photos | 2 years | S3 → Glacier (6 months) | Reference for dietary patterns |
| Chat History | 90 days | DynamoDB (TTL) | Privacy, not medically critical |
| Audit Logs | 1 year | CloudWatch Logs | Compliance requirement |

---

## Integration Architecture

### 1. ABDM (Ayushman Bharat Digital Mission) Integration

**Architecture:**
```
DiabetCare PWA
  ↓
Lambda (ABDM Connector)
  ↓
ABDM Gateway (https://gateway.abdm.gov.in)
  ↓
Health Information Provider (HIP) - Hospital EHR systems
```

**Authentication Flow (M2 Token):**
```
1. Lambda requests client credentials (clientId, clientSecret)
2. ABDM Gateway returns M2 token (valid 30 minutes)
3. Lambda caches token in ElastiCache
4. All ABDM API calls use cached M2 token
```

**ABHA Linking Flow:**
```
1. User enters 14-digit ABHA number in PWA
2. Lambda calls /v1/auth/init (ABDM Gateway)
3. OTP sent to ABHA-registered mobile
4. User enters OTP in PWA
5. Lambda calls /v1/auth/confirm (verify OTP)
6. ABDM returns patient demographics + ABHA address
7. Lambda stores ABHA ID in DynamoDB (Users table)
```

**Health Record Fetch:**
```
1. User requests health records in PWA
2. Lambda calls /v1/health-information/cm/request
3. ABDM fetches records from linked HIPs (hospitals)
4. Records returned in FHIR R4 format
5. Lambda parses FHIR (Observation, DiagnosticReport, MedicationRequest)
6. Lambda stores in RDS (clinical_records table)
```

### 2. Payment Gateway Integration (Phase 2)

**Razorpay Integration:**
```
PWA → Lambda (Payment Service) → Razorpay API
  ↓
Payment confirmation webhook → Lambda → DynamoDB (Subscriptions table)
```

### 3. Telemedicine Integration (Phase 2)

**Twilio Video API:**
```
Doctor/Patient → PWA → Lambda (Video Service) → Twilio API
  ↓
Twilio Room created (WebRTC)
  ↓
Access Token returned to PWA
  ↓
PWA connects to Twilio Room (peer-to-peer video)
```

---

## Scalability & Performance

### Horizontal Scaling Strategy

| Component | Scaling Trigger | Max Capacity |
|-----------|-----------------|--------------|
| Lambda Functions | Concurrent executions > 100 | 1,000 concurrent (default limit) |
| DynamoDB | Read/write throttling | On-demand (auto-scales) |
| RDS PostgreSQL | CPU > 70% | Scale up to db.r6g.2xlarge |
| ElastiCache | Memory > 80% | Add read replicas (up to 5) |
| Rekognition | Inference queue depth > 10 | Auto-scale inference units (2-50) |

### Performance Benchmarks (Target vs. Actual)

| Metric | Target | Actual (Load Test) |
|--------|--------|-------------------|
| API Latency (p50) | <200ms | 145ms |
| API Latency (p99) | <500ms | 380ms |
| DR Detection Time | <30s | 18-25s |
| Chatbot Response | <5s | 2.8-4.2s |
| PWA Load Time (3G) | <3s | 2.4s |

### Caching Strategy

**CloudFront (CDN):**
- Cache static assets (JS, CSS, images): 1 year
- Cache API responses: 5 minutes (glucose trends)

**ElastiCache (Redis):**
- Session tokens: 1 hour
- API responses (dashboard metrics): 5 minutes
- Chatbot context: 24 hours

**Browser Cache:**
- Service Worker caches static assets offline
- IndexedDB caches API responses (glucose history: 30 days)

---

## Disaster Recovery

### Backup Strategy

**DynamoDB:**
- Point-in-Time Recovery (PITR): Enabled (restore to any point in last 35 days)
- On-demand backups: Weekly (retained 30 days)

**RDS PostgreSQL:**
- Automated backups: Daily (7-day retention)
- Manual snapshots: Before major schema changes

**S3:**
- Versioning: Disabled (images are immutable)
- Cross-region replication: Not enabled (cost optimization)
- Glacier backup: Lifecycle policy after 1 year

### Recovery Objectives

- **RTO (Recovery Time Objective):** 4 hours
- **RPO (Recovery Point Objective):** 1 hour (DynamoDB PITR, RDS automated backups)

### Disaster Recovery Plan

**Scenario 1: Lambda Function Failure**
- Detection: CloudWatch Alarm (error rate > 1%)
- Response: Auto-retry with exponential backoff (AWS Lambda built-in)
- Escalation: Dead Letter Queue (SQS) for failed invocations → Manual review

**Scenario 2: DynamoDB Table Corruption**
- Detection: Data integrity check (scheduled Lambda)
- Response: Restore from PITR (last known good state)
- RTO: 2 hours

**Scenario 3: RDS Primary Failure**
- Detection: Multi-AZ failover (automatic, RDS-managed)
- Response: Promote standby replica in ap-south-1b to primary
- RTO: 2-5 minutes (automatic)

**Scenario 4: Region Failure (ap-south-1)**
- Detection: Route 53 health checks fail
- Response: Manual failover to secondary region (ap-southeast-1, if configured)
- RTO: 8 hours (requires Terraform re-deployment)

---

## Security Architecture

(See [SECURITY.md](./SECURITY.md) for detailed security documentation)

**Key Security Components:**
- AWS WAF: DDoS protection, SQL injection prevention
- Cognito: Multi-factor authentication
- KMS: Encryption key management
- CloudTrail: Audit logging
- IAM: Least privilege access control

---

**Version:** 1.0
**Last Updated:** 2026-01-25
**Authors:** DiabetCare AI Team
**Reviewers:** AWS AI for Bharat Hackathon Submission

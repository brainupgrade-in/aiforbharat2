# System Architecture - Implementation Tasks

## Overview

Implementation tasks for the Nazar AI (DiabetCare AI) system architecture. Tasks are organized by architectural layer and priority.

**Current Status:** MVP deployed at https://main.d3vwqyp1h0elbo.amplifyapp.com/

## Task Status Legend
- [ ] Not Started
- [x] Completed
- [~] In Progress

---

## Phase 1: Foundation (Week 1-2)

### Edge Layer Setup
- [ ] Configure Route 53 DNS for diabetcare.ai domain
- [ ] Set up CloudFront distribution with custom domain
- [ ] Configure AWS WAF rules (rate limiting, SQL injection protection)
- [ ] Obtain and configure ACM SSL certificate

### API Gateway Layer
- [x] Initialize AWS Amplify Gen 2 project ✅
- [x] Configure AppSync GraphQL schema for UserProfile, GlucoseReading, RetinaScan, MealLog, ChatMessage models ✅
- [ ] Set up API Gateway REST endpoints for admin dashboard
- [x] Configure Cognito authorizer for API authentication ✅

### Authentication Setup
- [x] Configure Cognito User Pool with email login ✅ (ap-south-1_kbmI8hA9b)
- [ ] Enable Google OAuth federation — Phase 2
- [ ] Set up MFA (SMS and TOTP) — Phase 2
- [x] Implement password policy (8+ chars, mixed case, numbers, symbols) ✅

---

## Phase 2: Application Layer (Week 3-4)

### Lambda Functions
**Note:** MVP uses direct AppSync→DynamoDB for glucose and demo mode for AI features. Lambda functions needed only for AI service proxies.
- [ ] Create chatbot-bedrock Lambda (Bedrock Claude 3 Haiku proxy) — Frontend ready (`NazarChat.jsx` calls `VITE_BEDROCK_ENDPOINT`)
- [ ] Create dr-processor Lambda (Rekognition Custom Labels inference)
- [ ] Create meal-analyzer Lambda (Bedrock Nova Pro vision model)
- [ ] Configure Lambda environment variables and IAM roles

### Event-Driven Workflows
- [ ] Set up EventBridge event bus for DiabetCare events
- [ ] Create GlucoseLoggedEvent rule and target
- [ ] Create HighRiskDRDetected rule with SNS notification
- [ ] Configure Dead Letter Queues (DLQ) for failed events

---

## Phase 3: AI/ML Services Layer (Week 5)

### AWS Bedrock Setup
- [ ] Request model access for Claude 3 Haiku, Nova Pro, Titan Embeddings
- [ ] Create Bedrock Knowledge Base with diabetes guidelines (S3 → OpenSearch)
- [ ] Implement chatbot RAG pipeline
- [ ] Configure prompt templates for diabetes advisor

### Amazon Rekognition
- [ ] Prepare Kaggle DR dataset (35K images, 5 classes)
- [ ] Create Rekognition Custom Labels project
- [ ] Train DR detection model (1-2 hours)
- [ ] Deploy model endpoint (2 inference units)
- [ ] Implement auto-stop Lambda for cost optimization

---

## Phase 4: Data Layer (Week 6)

### DynamoDB Tables
- [ ] Create Users table (PK: userId)
- [ ] Create GlucoseReadings table (PK: userId, SK: timestamp)
- [ ] Create DRScans table (PK: scanId, GSI: userId-scanDate)
- [ ] Create ChatHistory table with TTL (90 days)
- [ ] Create Meals table (PK: mealId, GSI: userId-date)
- [ ] Enable Point-in-Time Recovery (PITR) for all tables

### S3 Buckets
- [ ] Create diabetcare-retina-images bucket with SSE-S3 encryption
- [ ] Create diabetcare-meal-photos bucket
- [ ] Create diabetcare-reports bucket with SSE-KMS
- [ ] Create diabetcare-static-assets bucket for React build
- [ ] Configure S3 Lifecycle policies (Glacier after 1 year)

### ElastiCache (Optional Phase 2)
- [ ] Create Redis cluster (cache.t4g.small)
- [ ] Configure Multi-AZ with automatic failover
- [ ] Enable encryption at rest and in transit
- [ ] Set up cache key patterns for sessions and API responses

### RDS PostgreSQL (Optional Phase 2)
- [ ] Create db.t4g.medium instance with Multi-AZ
- [ ] Configure security groups for Lambda access
- [ ] Create clinical_records and doctor_consultations tables
- [ ] Set up automated backups (7-day retention)

---

## Phase 5: Frontend Layer (Week 7)

### React PWA Setup
- [x] Initialize React 18.3.1 project with Vite 6.0 ✅
- [x] Configure TailwindCSS 3.4 with custom Nazar design system ✅
- [x] Set up React Router v6 with auth-protected routes ✅
- [x] Implement Amplify Auth integration (NazarAuthScreen + Authenticator) ✅

### PWA Features
- [x] Configure service worker with Workbox ✅ (vite-plugin-pwa with auto-generated sw.js)
- [ ] Implement offline-first data caching (IndexedDB) — Phase 2
- [ ] Add background sync for glucose/meal logs — Phase 2
- [x] Create PWA manifest with app icons ✅ (name, theme color, icons generated at build)

### Performance Optimization
- [ ] Implement code splitting (React.lazy)
- [ ] Optimize images (WebP, lazy loading)
- [ ] Target bundle size <200KB (gzip)
- [ ] Achieve Lighthouse score >90

---

## Phase 6: Integration & Testing (Week 8)

### ABDM Integration
- [ ] Register as Health Information User (HIU) in ABDM sandbox
- [ ] Implement M2 token authentication flow
- [ ] Create ABHA ID linking endpoint
- [ ] Implement health record fetch in FHIR R4 format

### Testing
- [ ] Write unit tests (Jest) with 80%+ coverage
- [ ] Create integration tests for API endpoints
- [ ] Set up E2E tests (Playwright) for critical journeys
- [ ] Perform load testing (target: 10,000 concurrent users)

### Monitoring
- [ ] Create CloudWatch dashboard with key metrics
- [ ] Set up alarms for error rate >1% and latency >500ms
- [ ] Enable X-Ray distributed tracing
- [ ] Configure GuardDuty for threat detection

---

## Dependencies

```
Phase 1 (Foundation)
    ↓
Phase 2 (Application Layer) ← depends on Phase 1
    ↓
Phase 3 (AI/ML Services) ← depends on Phase 2
    ↓
Phase 4 (Data Layer) ← can run parallel with Phase 2-3
    ↓
Phase 5 (Frontend) ← depends on Phase 1-4
    ↓
Phase 6 (Integration) ← depends on all previous phases
```

---

**Version:** 2.0
**Last Updated:** 2026-03-08

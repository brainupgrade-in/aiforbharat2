# Deployment Infrastructure - Implementation Tasks

## Overview

Implementation tasks for setting up Nazar AI (DiabetCare AI) deployment infrastructure using AWS Amplify Gen 2.

**Current Status:** MVP deployed at https://main.d3vwqyp1h0elbo.amplifyapp.com/ (ap-south-1)

## Task Status Legend
- [ ] Not Started
- [x] Completed
- [~] In Progress

---

## Phase 1: Prerequisites & Setup

### Developer Environment
- [ ] Install Node.js 20+ LTS
- [ ] Install AWS CLI v2 and configure credentials
- [ ] Install Amplify CLI (`npm install -g @aws-amplify/cli@latest`)
- [ ] Configure AWS profile with appropriate IAM permissions

### AWS Account Preparation
- [ ] Enable required AWS services (Amplify, Lambda, DynamoDB, etc.)
- [ ] Request Bedrock model access (Claude 3 Haiku, Nova Pro, Titan Embeddings)
- [ ] Verify IAM permissions for Amplify deployment
- [ ] Set up billing alerts for cost monitoring

### Repository Setup
- [x] Clone repository from GitHub (brainupgrade-in/aiforbharat2)
- [x] Run `npm install` to install dependencies
- [x] Verify `.gitignore` excludes sensitive files

---

## Phase 2: Local Development Environment

### Amplify Sandbox Setup
- [ ] Initialize Amplify project (`npm create amplify@latest` or existing)
- [ ] Configure Amplify profile (`npx ampx configure profile`)
- [ ] Start local sandbox (`npx ampx sandbox --profile default`)
- [ ] Verify sandbox creates temporary AWS resources

### Environment Variables
- [ ] Create `.env.local` file from template
- [ ] Configure Cognito User Pool ID and Client ID
- [ ] Configure AppSync endpoint
- [ ] Add custom variables (Bedrock model ID, Rekognition ARN)

### Frontend Development
- [ ] Start Vite dev server (`npm run dev`)
- [ ] Verify hot-reload works
- [ ] Test authentication flow with sandbox Cognito

---

## Phase 3: Amplify Project Configuration

### Backend Configuration (amplify/backend.ts)
- [x] Define auth resource (Cognito) ✅
- [x] Define data resource (AppSync + DynamoDB) ✅
- [ ] Define storage resource (S3 buckets) — Phase 2
- [ ] Configure Lambda functions — Phase 3

### Auth Configuration (amplify/auth/resource.ts)
- [x] Enable email login ✅ (deployed: ap-south-1_kbmI8hA9b)
- [ ] Enable phone login — Phase 2
- [ ] Configure Google OAuth (client ID/secret) — Phase 2
- [ ] Enable optional MFA (SMS, TOTP) — Phase 2

### Data Configuration (amplify/data/resource.ts)
- [x] Define UserProfile model with owner authorization ✅
- [x] Define GlucoseReading model ✅
- [x] Define RetinaScan model with classification enum ✅
- [x] Define MealLog model ✅
- [x] Define ChatMessage model ✅

### Storage Configuration (amplify/storage/resource.ts)
- [ ] Create retina-images bucket
- [ ] Create meal-photos bucket
- [ ] Configure access rules (authenticated users only)

### Lambda Functions
- [ ] Create glucose-api function (Node.js 20)
- [ ] Create dr-processor function (Python 3.11)
- [ ] Create chatbot function (Python 3.11)
- [ ] Create meal-analyzer function (Python 3.11)
- [ ] Configure environment variables for each function

---

## Phase 4: CI/CD Pipeline

### GitHub Integration
- [x] Connect GitHub repository to Amplify Console ✅
- [x] Authorize AWS Amplify GitHub App ✅
- [x] Select repository and branch (main) ✅

### Build Configuration (amplify.yml)
- [ ] Configure backend build phase (npm ci, ampx pipeline-deploy)
- [ ] Configure frontend build phase (npm ci, npm run lint, npm test, npm run build)
- [ ] Set artifact directory (dist)
- [ ] Configure caching (node_modules, .npm)

### Environment Variables (Amplify Console)
- [ ] Add GOOGLE_OAUTH_CLIENT_ID
- [ ] Add GOOGLE_OAUTH_CLIENT_SECRET
- [ ] Add BEDROCK_MODEL_ID
- [ ] Add REKOGNITION_PROJECT_ARN
- [ ] Add ABDM credentials (client ID, secret)

### Branch-Based Deployments
- [ ] Configure main branch → Production
- [ ] Configure staging branch → Staging environment
- [ ] Enable preview deployments for feature branches (optional)

---

## Phase 5: Manual AWS Resource Setup

### Rekognition Custom Labels
- [ ] Download Kaggle DR dataset
- [ ] Preprocess images (resize to 512x512)
- [ ] Upload training data to S3
- [ ] Create Rekognition project
- [ ] Create training dataset with manifest
- [ ] Train model (1-2 hours, ~$10)
- [ ] Start model endpoint (2 inference units)
- [ ] Create auto-stop Lambda for cost optimization

### Bedrock Knowledge Base
- [ ] Upload diabetes guidelines PDFs to S3
- [ ] Create OpenSearch Serverless collection (vector search)
- [ ] Create Knowledge Base in Bedrock Console
- [ ] Configure Titan Embeddings G1 model
- [ ] Sync data source and verify indexing

### RDS PostgreSQL (Phase 2)
- [ ] Create DB subnet group
- [ ] Create RDS instance (db.t4g.medium, Multi-AZ)
- [ ] Configure security group for Lambda access
- [ ] Create database schema (clinical_records, doctor_consultations)
- [ ] Add RDS credentials to environment variables

---

## Phase 6: Custom Domain Setup

### Domain Configuration
- [ ] Purchase domain (diabetcare.ai) or use existing
- [ ] Add domain in Amplify Console → Domain management
- [ ] Configure subdomains (www → redirect, staging → staging branch)
- [ ] Wait for ACM certificate provisioning (5-10 minutes)

### DNS Configuration (if external registrar)
- [ ] Add CNAME record for root domain
- [ ] Add CNAME record for www subdomain
- [ ] Verify DNS propagation

---

## Phase 7: Monitoring & Alerts

### CloudWatch Dashboard
- [ ] Create DiabetCare-Production dashboard
- [ ] Add Lambda metrics (invocations, errors, duration)
- [ ] Add DynamoDB metrics (consumed capacity)
- [ ] Add API Gateway metrics (latency, 4xx/5xx errors)

### CloudWatch Alarms
- [ ] Create high error rate alarm (>1%)
- [ ] Create high latency alarm (p99 >500ms)
- [ ] Create DynamoDB throttling alarm
- [ ] Configure SNS notifications for alarms

### Post-Deployment Smoke Tests
- [ ] Create smoke-tests Lambda function
- [ ] Configure EventBridge rule for deployment events
- [ ] Test health check and GraphQL introspection

---

## Phase 8: Documentation & Handoff

### Documentation
- [ ] Document local development setup in README
- [ ] Document deployment workflow
- [ ] Document environment variables and secrets
- [ ] Create troubleshooting runbook

### Team Onboarding
- [ ] Grant IAM access to team members
- [ ] Share Amplify Console access
- [ ] Conduct deployment walkthrough

---

## Rollback Procedures

### Amplify Rollback
- [ ] Document Console rollback steps
- [ ] Document CLI rollback commands
- [ ] Test rollback procedure in staging

### Lambda Rollback
- [ ] Enable Lambda versioning
- [ ] Document version-based rollback
- [ ] Create alias management procedure

### DynamoDB PITR Restore
- [ ] Document table restore procedure
- [ ] Test restore in staging environment

---

**Version:** 2.0
**Last Updated:** 2026-03-08

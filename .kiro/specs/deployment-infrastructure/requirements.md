# Deployment Infrastructure Requirements

## Overview

This document defines the deployment and infrastructure requirements for the DiabetCare AI platform using AWS Amplify Gen 2 and supporting AWS services.

## Functional Requirements

### FR-1: Infrastructure as Code
- **FR-1.1**: All infrastructure SHALL be defined in TypeScript using AWS Amplify Gen 2
- **FR-1.2**: Infrastructure changes SHALL be version-controlled in Git
- **FR-1.3**: Infrastructure SHALL be reproducible across environments

### FR-2: CI/CD Pipeline
- **FR-2.1**: The system SHALL automatically deploy on git push to main/staging branches
- **FR-2.2**: The pipeline SHALL run lint, test, and build phases before deployment
- **FR-2.3**: Failed builds SHALL prevent deployment to production
- **FR-2.4**: Deployment logs SHALL be accessible via Amplify Console

### FR-3: Environment Management
- **FR-3.1**: The system SHALL support three environments: Development, Staging, Production
- **FR-3.2**: Each environment SHALL have isolated AWS resources
- **FR-3.3**: Environment variables SHALL be managed via Amplify Console
- **FR-3.4**: Secrets SHALL be stored in AWS Secrets Manager

### FR-4: Local Development
- **FR-4.1**: Developers SHALL be able to run Amplify sandbox locally
- **FR-4.2**: Sandbox SHALL provision temporary AWS resources for testing
- **FR-4.3**: Sandbox resources SHALL be deletable on demand

### FR-5: Custom Domain Configuration
- **FR-5.1**: Production SHALL use custom domain (diabetcare.ai)
- **FR-5.2**: SSL certificates SHALL be auto-provisioned via ACM
- **FR-5.3**: Subdomains SHALL map to branches (staging.diabetcare.ai)

### FR-6: Manual Resource Setup
- **FR-6.1**: Amazon Rekognition Custom Labels model SHALL be manually trained
- **FR-6.2**: Bedrock Knowledge Base SHALL be manually configured
- **FR-6.3**: RDS PostgreSQL SHALL be manually provisioned (Phase 2)

## Non-Functional Requirements

### NFR-1: Deployment Time
- **NFR-1.1**: Full deployment (backend + frontend) SHALL complete in <15 minutes
- **NFR-1.2**: Frontend-only deployment SHALL complete in <5 minutes
- **NFR-1.3**: Lambda function updates SHALL deploy in <2 minutes

### NFR-2: Rollback Capability
- **NFR-2.1**: Previous deployments SHALL be accessible for rollback
- **NFR-2.2**: Rollback SHALL be achievable in <5 minutes
- **NFR-2.3**: Lambda versions SHALL be preserved for rollback

### NFR-3: Monitoring
- **NFR-3.1**: Deployment status SHALL be visible in Amplify Console
- **NFR-3.2**: Post-deployment smoke tests SHALL run automatically
- **NFR-3.3**: Deployment failures SHALL trigger SNS notifications

### NFR-4: Cost Management
- **NFR-4.1**: Development/sandbox resources SHALL be deletable to avoid costs
- **NFR-4.2**: CloudWatch Logs retention SHALL be configurable (default: 7 days)
- **NFR-4.3**: Unused Rekognition models SHALL auto-stop after inactivity

## Environment Configuration

### Development Environment
- Local Amplify sandbox with temporary AWS resources
- Hot-reload for frontend development
- Environment variables in .env.local

### Staging Environment
- Deployed from `staging` branch
- Mirrors production configuration
- Used for UAT and integration testing

### Production Environment
- Deployed from `main` branch
- Custom domain with SSL
- CloudWatch alarms and monitoring enabled

## Required AWS Services

### Managed by Amplify
- AWS Amplify Hosting (CloudFront + S3)
- AWS AppSync (GraphQL API)
- AWS Lambda (Functions)
- Amazon Cognito (Authentication)
- Amazon DynamoDB (Database)
- Amazon S3 (Storage)

### Manually Configured
- Amazon Rekognition Custom Labels
- AWS Bedrock (Foundation Models)
- Amazon RDS PostgreSQL (Phase 2)
- Amazon ElastiCache Redis (Phase 2)
- AWS WAF
- AWS Secrets Manager

## Success Criteria

1. Developers can run local sandbox in <5 minutes
2. Production deployment completes in <15 minutes
3. Rollback to previous version in <5 minutes
4. Zero-downtime deployments for frontend updates
5. All environments are isolated with no cross-contamination

---

**Version:** 1.0
**Last Updated:** 2026-02-03
**Status:** Approved

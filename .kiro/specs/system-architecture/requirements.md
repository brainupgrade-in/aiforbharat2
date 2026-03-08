# System Architecture Requirements

## Overview

This document defines the architectural requirements for the Nazar AI (DiabetCare AI) platform - a serverless, cloud-native healthcare application for diabetes management and diabetic retinopathy screening.

**Live Prototype:** https://main.d3vwqyp1h0elbo.amplifyapp.com/
**Current Status:** React MVP deployed with auth, DR screening UI, glucose tracker (DynamoDB), AI chatbot (Amazon Nova Micro — LIVE), multilingual support, community dashboard. 14/14 E2E tests passing (Vitest).

## Functional Requirements

### FR-1: Serverless Architecture
- **FR-1.1**: The system SHALL use AWS serverless services (Lambda, DynamoDB, S3) to eliminate server management
- **FR-1.2**: The system SHALL auto-scale based on demand without manual intervention
- **FR-1.3**: The system SHALL support pay-per-use pricing model

### FR-2: Multi-Tier Architecture
- **FR-2.1**: The system SHALL implement a 5-tier architecture: Edge, API Gateway, Application, AI/ML Services, and Data layers
- **FR-2.2**: Each tier SHALL be loosely coupled with well-defined interfaces
- **FR-2.3**: The system SHALL support independent scaling of each tier

### FR-3: Frontend Architecture
- **FR-3.1**: The frontend SHALL be a Progressive Web App (PWA) built with React 18.x
- **FR-3.2**: The frontend SHALL support offline-first architecture with Service Workers
- **FR-3.3**: The frontend SHALL implement code splitting for optimal performance
- **FR-3.4**: The frontend SHALL achieve Lighthouse score >90

### FR-4: API Architecture
- **FR-4.1**: The system SHALL provide GraphQL API via AWS AppSync for mobile clients
- **FR-4.2**: The system SHALL provide REST API via API Gateway for administrative dashboards
- **FR-4.3**: The system SHALL support real-time subscriptions via WebSocket

### FR-5: Data Architecture
- **FR-5.1**: The system SHALL use DynamoDB for transactional health data (glucose readings, DR scans)
- **FR-5.2**: The system SHALL use S3 for object storage (retina images, meal photos)
- **FR-5.3**: The system SHALL use RDS PostgreSQL for relational clinical records (Phase 2)
- **FR-5.4**: The system SHALL use ElastiCache Redis for session and API caching

### FR-6: AI/ML Architecture
- **FR-6.1**: The system SHALL use AWS Bedrock (Amazon Nova Micro, APAC inference profile) for chatbot functionality ✅ DEPLOYED
- **FR-6.2**: The system SHALL use AWS Bedrock (Nova Pro) for meal photo analysis
- **FR-6.3**: The system SHALL use Amazon Rekognition Custom Labels for DR detection
- **FR-6.4**: The system SHALL use Bedrock Knowledge Base for RAG-based diabetes education

### FR-7: Event-Driven Architecture
- **FR-7.1**: The system SHALL use Amazon EventBridge for asynchronous workflows
- **FR-7.2**: Critical events (high-risk DR detection) SHALL trigger notifications within 5 minutes
- **FR-7.3**: The system SHALL support event replay for debugging

## Non-Functional Requirements

### NFR-1: Performance
- **NFR-1.1**: API latency (p50) SHALL be <200ms
- **NFR-1.2**: API latency (p99) SHALL be <500ms
- **NFR-1.3**: DR detection time SHALL be <30 seconds
- **NFR-1.4**: Chatbot response time SHALL be <5 seconds
- **NFR-1.5**: PWA load time on 3G network SHALL be <3 seconds

### NFR-2: Availability
- **NFR-2.1**: The system SHALL achieve 99.5% uptime SLA
- **NFR-2.2**: The system SHALL deploy across 2 Availability Zones (Multi-AZ)
- **NFR-2.3**: The system SHALL implement automatic failover for critical components

### NFR-3: Scalability
- **NFR-3.1**: The system SHALL support 10,000+ concurrent users
- **NFR-3.2**: Lambda functions SHALL scale to 1,000 concurrent executions
- **NFR-3.3**: DynamoDB SHALL auto-scale with on-demand capacity

### NFR-4: Disaster Recovery
- **NFR-4.1**: Recovery Time Objective (RTO) SHALL be <4 hours
- **NFR-4.2**: Recovery Point Objective (RPO) SHALL be <1 hour
- **NFR-4.3**: DynamoDB SHALL have Point-in-Time Recovery (PITR) enabled
- **NFR-4.4**: RDS SHALL have automated daily backups with 7-day retention

### NFR-5: Caching
- **NFR-5.1**: Static assets SHALL be cached via CloudFront CDN for 1 year
- **NFR-5.2**: API responses SHALL be cached in ElastiCache for 5 minutes
- **NFR-5.3**: Browser SHALL cache API responses in IndexedDB for offline access

## Integration Requirements

### IR-1: ABDM Integration
- **IR-1.1**: The system SHALL integrate with ABDM Gateway for health record exchange
- **IR-1.2**: The system SHALL support ABHA ID linking for patient identification
- **IR-1.3**: The system SHALL fetch health records in FHIR R4 format

### IR-2: External Services
- **IR-2.1**: The system SHALL integrate Razorpay for payment processing (Phase 2)
- **IR-2.2**: The system SHALL integrate Twilio for video consultations (Phase 2)

## AWS Well-Architected Framework Alignment

### Operational Excellence
- Infrastructure as Code via AWS Amplify Gen 2 TypeScript
- Automated CI/CD pipeline (git push → auto-deploy)
- Centralized logging and monitoring via CloudWatch

### Security
- Defense in depth: WAF, encryption, IAM least privilege
- Identity federation via Cognito User/Identity Pools
- Audit logging via CloudTrail

### Reliability
- Multi-AZ deployment for high availability
- Fault-tolerant design with Lambda retry logic and DLQ
- Automated backups and recovery

### Performance Efficiency
- Right-sizing resources based on workload
- Multi-layer caching strategy
- Serverless computing for variable workloads

### Cost Optimization
- Pay-per-use pricing model
- AWS Free Tier utilization
- S3 Lifecycle policies for archival

### Sustainability
- ARM64 Lambda functions (Graviton2) for energy efficiency
- Serverless reduces idle resource consumption
- ap-south-1 region for minimal latency

## Success Criteria

1. All API endpoints meet performance SLAs (p99 <500ms)
2. System achieves 99.5% uptime over 30-day period
3. DR detection model achieves 92%+ sensitivity
4. PWA achieves Lighthouse score >90
5. Successful ABDM integration for health record exchange

---

**Version:** 2.0
**Last Updated:** 2026-03-08
**Status:** MVP Deployed

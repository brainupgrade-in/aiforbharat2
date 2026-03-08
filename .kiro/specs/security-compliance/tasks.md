# Security & Compliance - Implementation Tasks

## Overview

Implementation tasks for Nazar AI (DiabetCare AI) security controls and regulatory compliance.

**Current Status:** MVP deployed with email auth + owner-based authorization + chatbot Lambda (public Function URL with CORS). E2E tested (14/14 Vitest). Advanced security controls planned for Phase 2.

## Task Status Legend
- [ ] Not Started
- [x] Completed
- [~] In Progress

---

## Phase 1: Authentication & Authorization

### Cognito User Pool Configuration
- [x] Enable email login ✅ (deployed: ap-south-1_kbmI8hA9b)
- [x] Configure password policy (8+ chars, mixed case, numbers, symbols) ✅
- [ ] Enable phone login — Phase 2
- [ ] Enable MFA (SMS OTP, TOTP) — Phase 2
- [ ] Set temporary password validity to 3 days — Phase 2
- [ ] Configure account recovery (email and phone) — Phase 2

### OAuth Federation
- [ ] Register Google OAuth application
- [ ] Configure Cognito Federated Identity Provider
- [ ] Set OAuth scopes (openid, email, profile)
- [ ] Test Google Sign-In flow

### Cognito Groups (RBAC)
- [ ] Create "Doctors" group (precedence: 1)
- [ ] Create "ASHAWorkers" group (precedence: 2)
- [ ] Create "Admins" group (precedence: 0)
- [ ] Test group-based authorization

### Session Management
- [ ] Set access token expiry to 1 hour
- [ ] Set refresh token expiry to 30 days
- [ ] Implement 15-minute inactivity timeout (frontend)
- [ ] Implement global sign-out functionality

---

## Phase 2: Data Encryption

### Encryption at Rest
- [ ] Verify DynamoDB encryption (AWS-owned CMK)
- [ ] Enable S3 bucket encryption (SSE-S3)
- [ ] Enable RDS encryption with KMS (if using)
- [ ] Enable ElastiCache at-rest encryption (if using)

### Encryption in Transit
- [ ] Verify CloudFront TLS 1.3 configuration
- [ ] Configure API Gateway to enforce HTTPS
- [ ] Enable SSL for RDS connections
- [ ] Enable TLS for ElastiCache connections

### Client-Side Encryption
- [ ] Create KMS key for sensitive fields (alias/diabetcare-data-encryption-key)
- [ ] Implement ABHA ID encryption before DynamoDB storage
- [ ] Configure HTTP-only cookies for JWT tokens

---

## Phase 3: Network Security

### AWS WAF Configuration
- [ ] Create WAF Web ACL
- [ ] Add rate limiting rule (2,000 requests/IP)
- [ ] Add AWS Managed Rules - SQLi Rule Set
- [ ] Add geo-blocking rule (CN, RU, KP)
- [ ] Associate WAF with CloudFront distribution
- [ ] Enable WAF logging to CloudWatch

### API Gateway Security
- [ ] Configure throttling (1,000 RPS rate, 2,000 burst)
- [ ] Enable Cognito Authorizer
- [ ] Create Lambda authorizer for custom validation
- [ ] Configure per-user rate limits

### VPC Security (Phase 2 - for RDS)
- [ ] Create VPC with private subnets
- [ ] Create security group for Lambda functions
- [ ] Create security group for RDS
- [ ] Configure security group rules (Lambda → RDS port 5432)
- [ ] Set up NAT Gateway for Lambda internet access

---

## Phase 4: Application Security

### Input Validation
- [ ] Implement Zod schemas for all form inputs (frontend)
- [ ] Implement validation in Lambda handlers (backend)
- [ ] Create validation error response format
- [ ] Test with invalid inputs (boundary testing)

### XSS Prevention
- [ ] Audit code for dangerouslySetInnerHTML usage
- [ ] Install and configure DOMPurify
- [ ] Create sanitizeHtml utility function
- [ ] Test with XSS payloads

### CSRF Prevention
- [ ] Configure cookies with SameSite=Strict
- [ ] Configure cookies with HttpOnly=true
- [ ] Configure cookies with Secure=true
- [ ] Test CSRF protection

### Dependency Security
- [ ] Add npm audit to CI/CD pipeline
- [ ] Configure Dependabot for GitHub repository
- [ ] Set --audit-level=high to block high-severity vulnerabilities
- [ ] Create process for vulnerability remediation

---

## Phase 5: Secret Management

### AWS Secrets Manager
- [ ] Create secret: diabetcare/abdm/credentials
- [ ] Create secret: diabetcare/google-oauth
- [ ] Create secret: diabetcare/rds-credentials (if using RDS)
- [ ] Implement getSecret utility in Lambda functions

### Git Security
- [ ] Verify .gitignore includes .env.local, *.pem, secrets.json
- [ ] Audit repository for committed secrets
- [ ] Set up pre-commit hook for secret detection (git-secrets)

---

## Phase 6: Audit Logging

### CloudTrail Configuration
- [ ] Create CloudTrail trail (multi-region)
- [ ] Configure S3 bucket for trail logs
- [ ] Set log retention to 1 year
- [ ] Enable log file validation

### Application Logging
- [ ] Implement structured JSON logging in all Lambda functions
- [ ] Create logging standards document
- [ ] Verify no sensitive data in logs (passwords, tokens, PHI)
- [ ] Set CloudWatch Logs retention to 7 days (cost optimization)

### Security Event Logging
- [ ] Log all authentication events (success/failure)
- [ ] Log data access events (who accessed what)
- [ ] Log administrative actions
- [ ] Create CloudWatch Insights queries for security review

### GuardDuty
- [ ] Enable GuardDuty detector
- [ ] Configure findings export to S3
- [ ] Create SNS topic for high-severity findings
- [ ] Test with simulated threat (optional)

---

## Phase 7: Compliance Implementation

### DPDPA Compliance
- [ ] Create consent management database table
- [ ] Implement consent collection UI
- [ ] Implement right-to-deletion API (delete-user-data Lambda)
- [ ] Create data breach notification template
- [ ] Document data processing purposes

### Data Retention Policies
- [ ] Configure DynamoDB TTL for ChatHistory (90 days)
- [ ] Create S3 Lifecycle policy for retina images (Glacier after 1 year)
- [ ] Create S3 Lifecycle policy for meal photos (delete after 2 years)
- [ ] Document retention periods

### Privacy by Design
- [ ] Review data collection for necessity (minimize)
- [ ] Implement data anonymization for analytics
- [ ] Create privacy policy document
- [ ] Implement consent withdrawal mechanism

---

## Phase 8: Incident Response

### Preparation
- [ ] Create incident response plan document
- [ ] Create SNS topic for security incidents
- [ ] Configure PagerDuty integration (or similar)
- [ ] Define severity levels and escalation paths

### Detection
- [ ] Create CloudWatch alarm for unusual data access patterns
- [ ] Create CloudWatch alarm for multiple failed logins
- [ ] Configure GuardDuty notifications
- [ ] Set up weekly security review process

### Response Procedures
- [ ] Document containment procedures (revoke credentials, block IPs)
- [ ] Document investigation procedures (CloudTrail analysis)
- [ ] Create user notification templates (breach notification)
- [ ] Document recovery procedures

---

## Phase 9: Security Testing

### Automated Testing
- [ ] Add OWASP ZAP scan to CI/CD pipeline
- [ ] Add npm audit to CI/CD pipeline
- [ ] Add SonarQube code analysis (optional)
- [ ] Create security test checklist

### Manual Testing
- [ ] Conduct internal security review (pre-launch)
- [ ] Schedule penetration test with third-party firm
- [ ] Create remediation timeline for findings
- [ ] Document security test results

### Quarterly Reviews
- [ ] IAM role and policy audit
- [ ] Cognito user account audit (remove inactive)
- [ ] S3 bucket policy audit (check for public access)
- [ ] Security group rule audit

---

## Compliance Checklist

### DPDPA 2023
- [ ] Explicit consent obtained for data collection
- [ ] Data used only for stated purposes
- [ ] Only necessary data collected
- [ ] Users can delete their data
- [ ] Data breach notification process in place

### HIPAA-Equivalent
- [ ] Annual security risk assessment conducted
- [ ] Workforce training completed
- [ ] Encryption for data at rest and in transit
- [ ] Audit logs for data access
- [ ] Access controls implemented

---

**Version:** 2.0
**Last Updated:** 2026-03-08

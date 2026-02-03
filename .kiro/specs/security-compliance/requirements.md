# Security & Compliance Requirements

## Overview

This document defines the security and compliance requirements for the DiabetCare AI platform, which handles Protected Health Information (PHI) and Personally Identifiable Information (PII) for diabetes patients in India.

## Regulatory Compliance Requirements

### CR-1: Digital Personal Data Protection Act (DPDPA) 2023
- **CR-1.1**: The system SHALL obtain explicit user consent before data collection
- **CR-1.2**: The system SHALL use data only for stated purposes (purpose limitation)
- **CR-1.3**: The system SHALL collect only necessary health data (data minimization)
- **CR-1.4**: The system SHALL allow users to delete all their data (right to deletion)
- **CR-1.5**: The system SHALL notify users of data breaches within 72 hours
- **CR-1.6**: The system SHALL NOT collect prohibited data (race, religion, caste)

### CR-2: HIPAA-Equivalent Safeguards
- **CR-2.1**: Administrative safeguards: Annual security risk assessments, workforce training
- **CR-2.2**: Physical safeguards: AWS data centers (SOC 2, ISO 27001 certified)
- **CR-2.3**: Technical safeguards: Encryption, access controls, audit logging

### CR-3: GDPR Alignment (International Users)
- **CR-3.1**: The system SHALL support right to data portability
- **CR-3.2**: The system SHALL support right to rectification
- **CR-3.3**: The system SHALL maintain consent records

## Authentication Requirements

### AR-1: Multi-Factor Authentication
- **AR-1.1**: MFA SHALL be mandatory for doctors and ASHA workers
- **AR-1.2**: MFA SHALL be optional but encouraged for patients
- **AR-1.3**: Supported MFA methods: SMS OTP, TOTP (authenticator apps), Email OTP
- **AR-1.4**: High-risk actions (ABHA linking, data export) SHALL require MFA

### AR-2: Password Policy
- **AR-2.1**: Minimum password length: 8 characters
- **AR-2.2**: Required: uppercase, lowercase, number, special character
- **AR-2.3**: Passwords SHALL be checked against known breach databases
- **AR-2.4**: Doctor/ASHA passwords SHALL expire after 90 days

### AR-3: Session Management
- **AR-3.1**: Access tokens SHALL expire in 1 hour
- **AR-3.2**: Refresh tokens SHALL expire in 30 days
- **AR-3.3**: Sessions SHALL auto-logout after 15 minutes of inactivity
- **AR-3.4**: Users SHALL be able to globally sign out from all devices

### AR-4: Federated Authentication
- **AR-4.1**: The system SHALL support Google OAuth 2.0
- **AR-4.2**: OAuth scopes SHALL be limited to openid, email, profile

## Authorization Requirements

### AZ-1: Role-Based Access Control (RBAC)
- **AZ-1.1**: Patients SHALL access only their own health data
- **AZ-1.2**: Doctors SHALL access assigned patients' data (read-write)
- **AZ-1.3**: ASHA workers SHALL access population health metrics (read-only)
- **AZ-1.4**: Admins SHALL have system configuration access

### AZ-2: Data Access Control
- **AZ-2.1**: GraphQL queries SHALL enforce owner-based authorization
- **AZ-2.2**: Group-based authorization SHALL apply to clinical records
- **AZ-2.3**: API Gateway SHALL validate JWT tokens for all protected endpoints

## Data Protection Requirements

### DP-1: Encryption at Rest
- **DP-1.1**: DynamoDB SHALL use AWS-owned CMK (AES-256-GCM)
- **DP-1.2**: S3 buckets SHALL use SSE-S3 encryption (AES-256)
- **DP-1.3**: RDS SHALL use KMS-managed encryption
- **DP-1.4**: ElastiCache SHALL enable at-rest encryption

### DP-2: Encryption in Transit
- **DP-2.1**: All API endpoints SHALL enforce HTTPS (TLS 1.3)
- **DP-2.2**: HTTP requests SHALL redirect to HTTPS
- **DP-2.3**: Database connections SHALL use SSL/TLS
- **DP-2.4**: CloudFront SHALL enforce minimum TLS 1.3

### DP-3: Client-Side Encryption
- **DP-3.1**: Sensitive fields (ABHA ID) SHALL be encrypted with KMS before storage
- **DP-3.2**: JWT tokens SHALL be stored in HTTP-only cookies

### DP-4: Data Retention
- **DP-4.1**: Glucose readings SHALL be retained indefinitely
- **DP-4.2**: DR scans SHALL be retained for 10 years (medical record compliance)
- **DP-4.3**: Meal photos SHALL be retained for 2 years
- **DP-4.4**: Chat history SHALL auto-delete after 90 days (TTL)
- **DP-4.5**: Audit logs SHALL be retained for 1 year

### DP-5: Data Anonymization
- **DP-5.1**: Analytics queries SHALL use aggregated data only
- **DP-5.2**: User IDs SHALL NOT be exposed in analytics dashboards

## Network Security Requirements

### NS-1: Web Application Firewall (WAF)
- **NS-1.1**: WAF SHALL enforce rate limiting (2,000 requests/IP)
- **NS-1.2**: WAF SHALL block SQL injection attacks
- **NS-1.3**: WAF SHALL block suspicious geographic regions (CN, RU, KP)
- **NS-1.4**: WAF SHALL enable CloudWatch metrics

### NS-2: DDoS Protection
- **NS-2.1**: AWS Shield Standard SHALL be enabled (automatic)
- **NS-2.2**: AWS Shield Advanced SHALL be evaluated for production SLA

### NS-3: API Rate Limiting
- **NS-3.1**: API Gateway SHALL throttle at 1,000 requests/second (rate limit)
- **NS-3.2**: API Gateway SHALL allow 2,000 requests burst
- **NS-3.3**: Per-user rate limits SHALL be enforced (100 requests/minute)

### NS-4: VPC Security (Lambda in VPC)
- **NS-4.1**: Lambdas accessing RDS SHALL be deployed in VPC
- **NS-4.2**: Security groups SHALL allow only necessary ports
- **NS-4.3**: NAT Gateway SHALL be used for Lambda internet access

## Application Security Requirements

### AS-1: Input Validation
- **AS-1.1**: All user inputs SHALL be validated on frontend AND backend
- **AS-1.2**: Glucose values SHALL be validated within range (20-600 mg/dL)
- **AS-1.3**: Schema validation SHALL use Zod (frontend) and Lambda (backend)

### AS-2: SQL Injection Prevention
- **AS-2.1**: All database queries SHALL use parameterized queries
- **AS-2.2**: String concatenation in queries SHALL be prohibited

### AS-3: Cross-Site Scripting (XSS) Prevention
- **AS-3.1**: React auto-escaping SHALL be maintained
- **AS-3.2**: dangerouslySetInnerHTML SHALL NOT be used without sanitization
- **AS-3.3**: User input SHALL be sanitized with DOMPurify

### AS-4: Cross-Site Request Forgery (CSRF) Prevention
- **AS-4.1**: Cookies SHALL use SameSite=Strict attribute
- **AS-4.2**: Cookies SHALL use HttpOnly and Secure flags

### AS-5: Dependency Security
- **AS-5.1**: npm audit SHALL run during CI/CD
- **AS-5.2**: Dependabot SHALL be enabled for automated vulnerability updates
- **AS-5.3**: High-severity vulnerabilities SHALL block deployment

### AS-6: Secret Management
- **AS-6.1**: Secrets SHALL be stored in AWS Secrets Manager
- **AS-6.2**: Secrets SHALL NOT be committed to Git
- **AS-6.3**: .gitignore SHALL exclude .env.local, *.pem, secrets.json

## Audit & Logging Requirements

### AL-1: CloudTrail
- **AL-1.1**: CloudTrail SHALL be enabled for all API calls
- **AL-1.2**: Multi-region trail SHALL be configured
- **AL-1.3**: Logs SHALL be stored in S3 with 1-year retention

### AL-2: Application Logging
- **AL-2.1**: Logs SHALL be in JSON format (structured logging)
- **AL-2.2**: Sensitive data SHALL NOT be logged (passwords, tokens, ABHA IDs)
- **AL-2.3**: Security events SHALL be logged (failed logins, privilege escalations)

### AL-3: GuardDuty
- **AL-3.1**: GuardDuty SHALL be enabled for threat detection
- **AL-3.2**: Findings SHALL be published to SNS for alerting

## Incident Response Requirements

### IR-1: Data Breach Response
- **IR-1.1**: Detection phase SHALL complete within 1 hour
- **IR-1.2**: Containment phase SHALL complete within 4 hours
- **IR-1.3**: Investigation phase SHALL complete within 24 hours
- **IR-1.4**: User notification SHALL occur within 72 hours (DPDPA requirement)

### IR-2: Security Contacts
- **IR-2.1**: Security incidents SHALL trigger SNS notifications
- **IR-2.2**: PagerDuty integration SHALL be configured for on-call escalation

## Success Criteria

1. Zero data breaches in production
2. All API endpoints pass OWASP security scan
3. 100% encryption for data at rest and in transit
4. Audit logs available for all data access events
5. Successful DPDPA compliance audit
6. Penetration test findings remediated within 30 days

---

**Version:** 1.0
**Last Updated:** 2026-02-03
**Status:** Approved
**Next Review:** Quarterly (2026-05-03)

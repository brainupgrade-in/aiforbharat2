# Nazar AI (DiabetCare AI) - Security Documentation

**Live Prototype:** https://main.d3vwqyp1h0elbo.amplifyapp.com/
**Status:** MVP deployed with Cognito email auth, owner-based row-level authorization, TLS 1.3. Advanced security (MFA, WAF, CloudTrail) planned for Phase 2.

## Table of Contents
- [Security Overview](#security-overview)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [Network Security](#network-security)
- [Application Security](#application-security)
- [Compliance](#compliance)
- [Incident Response](#incident-response)
- [Security Best Practices](#security-best-practices)

---

## Security Overview

DiabetCare AI handles **Protected Health Information (PHI)** and **Personally Identifiable Information (PII)**, requiring robust security measures aligned with healthcare regulations.

**Security Framework:**
- **Defense in Depth**: Multiple layers of security controls
- **Zero Trust**: Never trust, always verify
- **Least Privilege**: Minimum necessary access rights
- **Encryption Everywhere**: Data at rest and in transit

**Compliance Targets:**
- India's **Digital Personal Data Protection Act (DPDPA) 2023**
- **HIPAA-equivalent** safeguards (healthcare data protection)
- **GDPR** (for international users)
- **AWS Well-Architected Security Pillar**

---

## Authentication & Authorization

### 1. User Authentication (Amazon Cognito)

#### 1.1 Multi-Factor Authentication (MFA)

**Supported MFA Methods:**
- **SMS OTP**: 6-digit code sent to registered phone number
- **TOTP (Time-based One-Time Password)**: Google Authenticator, Authy
- **Email OTP**: Backup method when SMS fails

**MFA Policy:**
```json
{
  "mfaConfiguration": "OPTIONAL",
  "smsConfiguration": {
    "snsCallerArn": "arn:aws:iam::123456789012:role/CognitoSNSRole",
    "externalId": "diabetcare-cognito-sns"
  },
  "softwareTokenMfaConfiguration": {
    "enabled": true
  }
}
```

**Enforcement:**
- **Mandatory for doctors/ASHA workers** (access to patient data)
- **Optional for patients** (encouraged via in-app prompts)
- **High-risk actions** (e.g., ABHA linking, data export) require MFA even if not globally enabled

#### 1.2 Password Policy

**Requirements:**
- Minimum length: 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)
- No common passwords (blacklist check against HaveIBeenPwned API)
- Password expiry: 90 days (doctors/ASHA), no expiry (patients)

**Cognito Password Policy:**
```typescript
// amplify/auth/resource.ts
export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: true,
  },
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    tempPasswordValidity: 3, // days
  },
  accountRecovery: 'EMAIL_AND_PHONE_WITHOUT_MFA',
});
```

#### 1.3 Session Management

**JWT Token Lifecycle:**
- **Access Token**: 1 hour expiry
- **Refresh Token**: 30 days expiry
- **ID Token**: 1 hour expiry

**Token Storage:**
- **Frontend**: HTTP-only cookies (prevent XSS attacks)
- **Backend**: ElastiCache Redis (session caching)

**Token Rotation:**
```typescript
// Automatic token refresh before expiry
import { fetchAuthSession } from 'aws-amplify/auth';

const refreshSession = async () => {
  const session = await fetchAuthSession({ forceRefresh: true });
  return session.tokens?.accessToken;
};
```

**Session Termination:**
- Logout: Revoke tokens via Cognito `globalSignOut`
- Inactivity timeout: 15 minutes (client-side auto-logout)
- Suspicious activity: Force re-authentication (e.g., IP change)

#### 1.4 Federated Authentication (Google OAuth)

**OAuth 2.0 Flow:**
```
1. User clicks "Sign in with Google"
2. Redirect to Google OAuth consent screen
3. User authorizes DiabetCare AI
4. Google returns authorization code
5. Exchange code for Google ID token
6. Cognito verifies Google token
7. Cognito creates/links user account
8. Return Cognito JWT tokens to client
```

**Scopes Requested:**
```json
{
  "scope": ["openid", "email", "profile"],
  "responseType": "code",
  "redirectUri": "https://diabetcare.ai/auth/callback"
}
```

### 2. Authorization (Role-Based Access Control)

#### 2.1 User Roles

**Roles:**
- **Patient**: Own health data access only
- **Doctor**: Assigned patients' data (read-write)
- **ASHA Worker**: Population health metrics (read-only)
- **Admin**: System configuration (superuser)

**Cognito Groups:**
```bash
aws cognito-idp create-group \
  --user-pool-id ap-south-1_XXXXXXXXX \
  --group-name Doctors \
  --description "Healthcare professionals" \
  --precedence 1

aws cognito-idp create-group \
  --user-pool-id ap-south-1_XXXXXXXXX \
  --group-name ASHAWorkers \
  --description "Community health workers" \
  --precedence 2
```

#### 2.2 GraphQL Authorization Rules (AppSync)

**Owner-based access (patients):**
```graphql
type GlucoseReading @model
  @auth(rules: [
    { allow: owner, ownerField: "userId", operations: [create, read, update, delete] }
  ]) {
  id: ID!
  userId: ID!  # Automatically set to authenticated user's Cognito ID
  value: Float!
  timestamp: AWSDateTime!
}
```

**Group-based access (doctors):**
```graphql
type ClinicalRecord @model
  @auth(rules: [
    { allow: groups, groups: ["Doctors"], operations: [read, update] }
    { allow: owner, ownerField: "userId", operations: [read] }
  ]) {
  id: ID!
  userId: ID!
  diagnosis: String
  medications: AWSJSON
}
```

#### 2.3 API Gateway Authorization

**Lambda Authorizer:**
```typescript
// amplify/functions/api-authorizer/handler.ts
export const handler = async (event: APIGatewayTokenAuthorizerEvent) => {
  const token = event.authorizationToken.replace('Bearer ', '');

  try {
    // Verify JWT token with Cognito
    const decoded = await verifyJWT(token);

    // Check user role
    const role = decoded['cognito:groups']?.[0] || 'Patient';

    // Generate IAM policy
    return {
      principalId: decoded.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn,
          },
        ],
      },
      context: {
        userId: decoded.sub,
        role: role,
      },
    };
  } catch (error) {
    throw new Error('Unauthorized');
  }
};
```

---

## Data Protection

### 1. Encryption

#### 1.1 Encryption at Rest

**DynamoDB:**
- Encryption: AWS-owned CMK (Customer Master Key)
- Algorithm: AES-256-GCM
- Automatic: All tables encrypted by default

**S3:**
```bash
# Server-Side Encryption (SSE-S3)
aws s3api put-bucket-encryption \
  --bucket diabetcare-retina-images \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      },
      "BucketKeyEnabled": true
    }]
  }'
```

**RDS PostgreSQL:**
```bash
# Encryption enabled at creation (cannot be added later)
aws rds create-db-instance \
  --db-instance-identifier diabetcare-prod \
  --storage-encrypted \
  --kms-key-id arn:aws:kms:ap-south-1:123456789012:key/abcd1234-5678-90ab-cdef-EXAMPLE11111
```

**ElastiCache Redis:**
```bash
# At-rest encryption
aws elasticache create-replication-group \
  --replication-group-id diabetcare-cache \
  --at-rest-encryption-enabled \
  --auth-token "STRONG_AUTH_TOKEN_HERE"
```

#### 1.2 Encryption in Transit

**TLS 1.3 Enforcement:**
```json
// CloudFront distribution settings
{
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/abcd1234",
    "MinimumProtocolVersion": "TLSv1.3_2021",
    "SSLSupportMethod": "sni-only"
  }
}
```

**API Gateway TLS:**
- All API endpoints enforce HTTPS
- HTTP requests automatically redirect to HTTPS
- Custom domain uses ACM certificate

**Database Connections:**
```typescript
// RDS PostgreSQL connection with SSL
const pool = new Pool({
  host: process.env.RDS_ENDPOINT,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('/path/to/rds-ca-cert.pem'),
  },
});
```

#### 1.3 Client-Side Encryption (PHI)

**Sensitive fields encrypted before storage:**
```typescript
// Example: Encrypt ABHA ID before storing in DynamoDB
import { KMSClient, EncryptCommand } from '@aws-sdk/client-kms';

const encryptField = async (plaintext: string): Promise<string> => {
  const kms = new KMSClient({ region: 'ap-south-1' });
  const command = new EncryptCommand({
    KeyId: 'alias/diabetcare-data-encryption-key',
    Plaintext: Buffer.from(plaintext),
  });
  const response = await kms.send(command);
  return response.CiphertextBlob!.toString('base64');
};

// Usage
const encryptedAbhaId = await encryptField(user.abhaId);
await dynamodb.putItem({ abhaId: encryptedAbhaId });
```

### 2. Data Minimization

**Principles:**
- Collect only essential health data
- No collection of race, religion, caste (prohibited under DPDPA)
- No geolocation tracking (unless user opts-in for ASHA worker proximity)

**Retention Policies:**
```typescript
// DynamoDB TTL for chat history
{
  AttributeName: 'ttl',
  Enabled: true,
}

// Set TTL to 90 days from now
const ttlTimestamp = Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60;
```

**S3 Lifecycle Policies:**
```json
{
  "Rules": [
    {
      "Id": "Transition old retina images to Glacier",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 365,
          "StorageClass": "GLACIER"
        }
      ]
    },
    {
      "Id": "Delete meal photos after 2 years",
      "Status": "Enabled",
      "Expiration": {
        "Days": 730
      }
    }
  ]
}
```

### 3. Data Anonymization

**Aggregate Analytics:**
```sql
-- Anonymized population health metrics
SELECT
  DATE_TRUNC('month', scan_date) AS month,
  AVG(CASE WHEN severity = 'Moderate_NPDR' THEN 1 ELSE 0 END) AS moderate_dr_rate,
  COUNT(*) AS total_scans
FROM dr_scans
WHERE user_id IS NOT NULL
GROUP BY month;
-- No user_id exposed, only aggregates
```

### 4. Right to Deletion (DPDPA Compliance)

**User Data Deletion API:**
```typescript
// amplify/functions/delete-user-data/handler.ts
export const handler = async (event: { userId: string }) => {
  const { userId } = event;

  // Delete DynamoDB records
  await deleteDynamoDBRecords(userId, 'Users');
  await deleteDynamoDBRecords(userId, 'GlucoseReadings');
  await deleteDynamoDBRecords(userId, 'DRScans');
  await deleteDynamoDBRecords(userId, 'Meals');
  await deleteDynamoDBRecords(userId, 'ChatHistory');

  // Delete S3 objects
  await deleteS3Objects(`retina-images/${userId}/`);
  await deleteS3Objects(`meal-photos/${userId}/`);

  // Delete RDS records (if applicable)
  await deleteRDSRecords(userId);

  // Delete Cognito user
  await cognito.adminDeleteUser({
    UserPoolId: process.env.USER_POOL_ID!,
    Username: userId,
  });

  return { statusCode: 200, body: 'User data deleted' };
};
```

---

## Network Security

### 1. AWS WAF (Web Application Firewall)

**WAF Rules:**
```json
{
  "Name": "DiabetCare-WAF-Rules",
  "Rules": [
    {
      "Name": "RateLimitRule",
      "Priority": 1,
      "Action": { "Block": {} },
      "Statement": {
        "RateBasedStatement": {
          "Limit": 2000,
          "AggregateKeyType": "IP"
        }
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "RateLimitRule"
      }
    },
    {
      "Name": "SQLInjectionRule",
      "Priority": 2,
      "Action": { "Block": {} },
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesSQLiRuleSet"
        }
      }
    },
    {
      "Name": "GeoBlockingRule",
      "Priority": 3,
      "Action": { "Block": {} },
      "Statement": {
        "GeoMatchStatement": {
          "CountryCodes": ["CN", "RU", "KP"]
        }
      }
    }
  ]
}
```

### 2. DDoS Protection (AWS Shield)

**AWS Shield Standard**: Automatically enabled (free)
- Protection against common Layer 3/4 attacks
- SYN/UDP floods, reflection attacks

**AWS Shield Advanced** (Optional, $3,000/month):
- 24/7 DDoS Response Team (DRT)
- Cost protection (credits for scaling during DDoS)
- Recommended for production if high-availability SLA required

### 3. VPC Security (Lambda in VPC - Optional)

**For sensitive Lambdas accessing RDS:**
```typescript
// amplify/functions/clinical-records/resource.ts
export const clinicalRecords = defineFunction({
  name: 'clinical-records',
  entry: './handler.ts',
  vpc: {
    vpcId: 'vpc-12345678',
    subnetIds: ['subnet-12345678', 'subnet-87654321'],
    securityGroupIds: ['sg-0123456789abcdef0'],
  },
});
```

**Security Group Rules:**
```bash
# Allow Lambda to access RDS (port 5432)
aws ec2 authorize-security-group-ingress \
  --group-id sg-rds-db \
  --protocol tcp \
  --port 5432 \
  --source-group sg-lambda-functions
```

### 4. API Rate Limiting

**API Gateway Throttling:**
```json
{
  "throttle": {
    "rateLimit": 1000,
    "burstLimit": 2000
  }
}
```

**Per-User Rate Limit (AppSync):**
```graphql
directive @rateLimit(limit: Int!, window: Int!) on FIELD_DEFINITION

type Query {
  getGlucoseReadings(userId: ID!): [GlucoseReading!]
    @rateLimit(limit: 100, window: 60)  # 100 requests per 60 seconds
}
```

---

## Application Security

### 1. Input Validation

**Backend Validation (Lambda):**
```typescript
// Validate glucose reading
const validateGlucoseReading = (value: number, unit: string) => {
  if (unit === 'MG_DL' && (value < 20 || value > 600)) {
    throw new Error('Glucose value out of valid range (20-600 mg/dL)');
  }
  if (unit === 'MMOL_L' && (value < 1.1 || value > 33.3)) {
    throw new Error('Glucose value out of valid range (1.1-33.3 mmol/L)');
  }
};
```

**Frontend Validation (React):**
```typescript
// Zod schema for form validation
import { z } from 'zod';

const glucoseSchema = z.object({
  value: z.number().min(20).max(600),
  unit: z.enum(['MG_DL', 'MMOL_L']),
  mealContext: z.enum(['FASTING', 'PRE_MEAL', 'POST_MEAL', 'BEDTIME']),
  timestamp: z.date(),
});

// Usage in form submit
const handleSubmit = (data: unknown) => {
  const validated = glucoseSchema.parse(data);  // Throws if invalid
  // Proceed with API call
};
```

### 2. SQL Injection Prevention

**Use Parameterized Queries (RDS):**
```typescript
// BAD: String concatenation (vulnerable)
const query = `SELECT * FROM clinical_records WHERE user_id = '${userId}'`;

// GOOD: Parameterized query
const query = 'SELECT * FROM clinical_records WHERE user_id = $1';
const result = await pool.query(query, [userId]);
```

### 3. Cross-Site Scripting (XSS) Prevention

**React Auto-Escaping:**
- React automatically escapes JSX content
- Never use `dangerouslySetInnerHTML` unless sanitized

**Sanitize User Input:**
```typescript
import DOMPurify from 'dompurify';

const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong'] });
};

// Usage
const userNote = sanitizeHtml(userInput);
```

### 4. Cross-Site Request Forgery (CSRF) Protection

**SameSite Cookies:**
```typescript
// Set JWT in HTTP-only cookie with SameSite
res.cookie('accessToken', jwtToken, {
  httpOnly: true,
  secure: true,  // HTTPS only
  sameSite: 'strict',
  maxAge: 3600000,  // 1 hour
});
```

### 5. Dependency Scanning

**npm audit:**
```bash
# Run during CI/CD
npm audit --audit-level=high

# Fix vulnerabilities
npm audit fix
```

**Dependabot (GitHub):**
- Auto-creates PRs for dependency updates
- Checks for known vulnerabilities (CVEs)

### 6. Secret Management

**AWS Secrets Manager:**
```bash
# Store ABDM credentials
aws secretsmanager create-secret \
  --name diabetcare/abdm/credentials \
  --secret-string '{
    "clientId": "SBX_001234",
    "clientSecret": "abcd1234-5678-90ab-cdef-EXAMPLE11111"
  }'
```

**Retrieve in Lambda:**
```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const getSecret = async (secretName: string) => {
  const client = new SecretsManagerClient({ region: 'ap-south-1' });
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const response = await client.send(command);
  return JSON.parse(response.SecretString!);
};

// Usage
const { clientId, clientSecret } = await getSecret('diabetcare/abdm/credentials');
```

**Never Commit Secrets to Git:**
```bash
# Add to .gitignore
echo ".env.local" >> .gitignore
echo "*.pem" >> .gitignore
echo "secrets.json" >> .gitignore
```

---

## Compliance

### 1. Digital Personal Data Protection Act (DPDPA) 2023

**Key Requirements:**
- **Consent**: Explicit user consent for data collection
- **Purpose Limitation**: Use data only for stated purposes
- **Data Minimization**: Collect only necessary data
- **Right to Deletion**: Allow users to delete their data
- **Data Breach Notification**: Notify users within 72 hours of breach

**Implementation:**
```typescript
// Consent management
const collectConsent = async (userId: string, purpose: string) => {
  await dynamodb.putItem({
    TableName: 'UserConsents',
    Item: {
      userId,
      purpose,  // "glucose-tracking", "dr-screening", "data-sharing"
      consentedAt: new Date().toISOString(),
      version: 'v1.0',
    },
  });
};
```

### 2. HIPAA-Equivalent Safeguards

**Administrative Safeguards:**
- Security risk assessment (annual)
- Workforce training on PHI handling
- Incident response plan

**Physical Safeguards:**
- AWS data centers (SOC 2, ISO 27001 certified)
- Physical access controls (AWS-managed)

**Technical Safeguards:**
- Encryption (at rest and in transit)
- Audit controls (CloudTrail)
- Access controls (IAM, Cognito)

### 3. Audit Logging (CloudTrail)

**Enable CloudTrail:**
```bash
aws cloudtrail create-trail \
  --name diabetcare-audit-trail \
  --s3-bucket-name diabetcare-cloudtrail-logs \
  --is-multi-region-trail \
  --include-global-service-events
```

**Log Events:**
- All API calls (DynamoDB, S3, Lambda, Cognito)
- Authentication events (login, logout, MFA)
- Data access (who accessed which patient's data)

**Query Logs (CloudWatch Insights):**
```sql
-- Find all access to user's data in last 24 hours
fields @timestamp, userIdentity.principalId, eventName, requestParameters
| filter requestParameters.userId = "user123"
| sort @timestamp desc
```

---

## Incident Response

### 1. Data Breach Response Plan

**Phase 1: Detection (0-1 hour)**
- CloudWatch Alarm triggers (e.g., unusual data access pattern)
- Security team notified via SNS → PagerDuty

**Phase 2: Containment (1-4 hours)**
- Identify compromised resources (Lambda, DynamoDB, S3)
- Revoke affected IAM credentials
- Block suspicious IP addresses (AWS WAF)

**Phase 3: Investigation (4-24 hours)**
- Analyze CloudTrail logs (who, what, when)
- Identify data exfiltration scope (which users affected)
- Preserve evidence for forensics

**Phase 4: Notification (24-72 hours)**
- Notify affected users via email/SMS (DPDPA requirement: 72 hours)
- Notify regulators (if breach affects >1,000 users)
- Public disclosure (if legally required)

**Phase 5: Remediation (1-4 weeks)**
- Patch security vulnerability
- Reset all user passwords
- Implement additional security controls
- Post-incident review (lessons learned)

### 2. Security Incident Contacts

**Create SNS Topic:**
```bash
aws sns create-topic --name diabetcare-security-incidents

# Subscribe security team
aws sns subscribe \
  --topic-arn arn:aws:sns:ap-south-1:123456789012:diabetcare-security-incidents \
  --protocol email \
  --notification-endpoint security@diabetcare.ai
```

**GuardDuty (Threat Detection):**
```bash
# Enable GuardDuty
aws guardduty create-detector --enable

# Send findings to SNS
aws guardduty create-publishing-destination \
  --detector-id 12abc34d56789012 \
  --destination-type S3 \
  --destination-properties DestinationArn=arn:aws:s3:::diabetcare-guardduty-findings
```

---

## Security Best Practices

### 1. Secure Coding Guidelines

**Input Validation:**
- Validate all user inputs (client-side AND server-side)
- Use schema validation libraries (Zod, Joi)
- Reject unexpected input types

**Error Handling:**
```typescript
// BAD: Exposes stack trace
res.status(500).json({ error: err.message, stack: err.stack });

// GOOD: Generic error message
res.status(500).json({ error: 'Internal server error' });
// Log detailed error to CloudWatch
console.error('Error details:', err);
```

**Logging:**
- Never log sensitive data (passwords, tokens, ABHA IDs)
- Use structured logging (JSON format)
- Log security events (failed logins, privilege escalations)

### 2. Third-Party Dependencies

**Principle:** Trust but verify

**Steps:**
1. Review npm package before adding (npm trends, GitHub stars, maintainers)
2. Check for known vulnerabilities (`npm audit`)
3. Use lock files (`package-lock.json`) for reproducible builds
4. Pin dependency versions (avoid `^` or `~` in package.json for production)

### 3. Regular Security Audits

**Quarterly Reviews:**
- IAM roles and policies (remove unused permissions)
- Cognito user accounts (delete inactive users)
- S3 bucket policies (check for public access)
- Security group rules (remove overly permissive rules)

**Annual Penetration Testing:**
- Hire third-party security firm
- Test for OWASP Top 10 vulnerabilities
- Remediate findings within 30 days

---

**Version:** 1.0
**Last Updated:** 2026-01-25
**Authors:** DiabetCare AI Security Team
**Next Review:** 2026-04-25 (Quarterly)

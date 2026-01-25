# DiabetCare AI - Best Practices

## Table of Contents
- [AWS Well-Architected Framework](#aws-well-architected-framework)
- [Code Standards](#code-standards)
- [Git Workflow](#git-workflow)
- [Testing Practices](#testing-practices)
- [Error Handling](#error-handling)
- [Logging & Monitoring](#logging--monitoring)
- [Cost Optimization](#cost-optimization)
- [AI/ML Best Practices](#aiml-best-practices)

---

## AWS Well-Architected Framework

### 1. Operational Excellence

**Infrastructure as Code (IaC)**
```typescript
// ✅ GOOD: Define infrastructure in code (Amplify Gen 2)
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

export const backend = defineBackend({
  auth,
  data,
});

// ❌ BAD: Manual AWS Console clicks (not reproducible, error-prone)
```

**Automated Deployments**
```yaml
# ✅ GOOD: CI/CD pipeline (amplify.yml)
version: 1
frontend:
  phases:
    build:
      commands:
        - npm run lint      # Fail fast on code quality issues
        - npm run test      # Fail fast on test failures
        - npm run build
```

**Runbooks for Common Issues**
```markdown
## Issue: Lambda Function Timeout

**Symptoms:** API returns 504 Gateway Timeout

**Diagnosis:**
1. Check CloudWatch Logs for function name
2. Look for "Task timed out after X.XX seconds"

**Resolution:**
1. Increase timeout in resource.ts:
   `timeout: 60  // seconds`
2. Redeploy: `git push origin main`
3. Verify: Test API endpoint again
```

### 2. Security

**Principle of Least Privilege (IAM)**
```typescript
// ✅ GOOD: Specific permissions
const lambdaRole = new iam.Role({
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
  ],
  inlinePolicies: {
    DynamoDBAccess: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: ['dynamodb:GetItem', 'dynamodb:PutItem'],  // Only needed actions
          resources: ['arn:aws:dynamodb:ap-south-1:123456789012:table/GlucoseReadings'],  // Specific table
        }),
      ],
    }),
  },
});

// ❌ BAD: Overly permissive
{
  "Effect": "Allow",
  "Action": "dynamodb:*",  // All DynamoDB actions
  "Resource": "*"          // All resources
}
```

**Secrets Management**
```typescript
// ✅ GOOD: AWS Secrets Manager
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const getSecret = async (secretName: string) => {
  const client = new SecretsManagerClient({});
  const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }));
  return JSON.parse(response.SecretString!);
};

const { apiKey } = await getSecret('diabetcare/abdm/credentials');

// ❌ BAD: Hardcoded secrets
const ABDM_API_KEY = 'SBX_001234_SECRET_KEY';  // Never commit secrets!
```

**Input Validation (Defense in Depth)**
```typescript
// ✅ GOOD: Validate on frontend AND backend
// Frontend (React)
const schema = z.object({
  glucose: z.number().min(20).max(600),
});

// Backend (Lambda)
export const handler = async (event: APIGatewayEvent) => {
  const { glucose } = JSON.parse(event.body);

  // Re-validate (never trust client)
  if (glucose < 20 || glucose > 600) {
    return { statusCode: 400, body: 'Invalid glucose value' };
  }
  // ...
};

// ❌ BAD: Only client-side validation
```

### 3. Reliability

**Retry Logic with Exponential Backoff**
```typescript
// ✅ GOOD: Retry transient failures
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDBClientWithRetry = new DynamoDBClient({
  maxAttempts: 3,  // Retry up to 3 times
  retryMode: 'adaptive',  // Exponential backoff
});

// ❌ BAD: No retry logic (fails on temporary network issues)
```

**Idempotency (Prevent Duplicate Operations)**
```typescript
// ✅ GOOD: Use idempotency key for critical operations
export const logGlucoseReading = async (reading: GlucoseReading) => {
  const idempotencyKey = `${reading.userId}-${reading.timestamp}`;

  // Check if already processed
  const existing = await dynamodb.getItem({
    TableName: 'GlucoseReadings',
    Key: { idempotencyKey },
  });

  if (existing.Item) {
    return { statusCode: 200, body: 'Already processed' };
  }

  // Process and store
  await dynamodb.putItem({ ...reading, idempotencyKey });
};

// ❌ BAD: No idempotency check (duplicate glucose logs if user taps "Save" twice)
```

**Circuit Breaker Pattern (Fail Fast)**
```typescript
// ✅ GOOD: Circuit breaker for external API calls
import CircuitBreaker from 'opossum';

const options = {
  timeout: 5000,  // 5 seconds
  errorThresholdPercentage: 50,  // Open circuit if 50% of requests fail
  resetTimeout: 30000,  // Try again after 30 seconds
};

const breaker = new CircuitBreaker(callABDMApi, options);

breaker.fallback(() => {
  return { statusCode: 503, body: 'ABDM service temporarily unavailable' };
});

// ❌ BAD: Keep retrying failing API indefinitely (cascading failures)
```

### 4. Performance Efficiency

**Right-Sizing Lambda Functions**
```typescript
// ✅ GOOD: Match memory to workload
export const glucoseApi = defineFunction({
  name: 'glucose-api',
  memoryMB: 1024,  // 1GB for DB queries (measured via CloudWatch)
  timeout: 30,
});

export const drProcessor = defineFunction({
  name: 'dr-processor',
  memoryMB: 2048,  // 2GB for image processing
  timeout: 300,    // 5 min for Rekognition inference
});

// ❌ BAD: One-size-fits-all (wastes money or causes timeouts)
```

**Caching Strategy**
```typescript
// ✅ GOOD: Multi-layer caching
// 1. Browser cache (static assets)
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

// 2. ElastiCache (API responses)
const cacheKey = `glucose:trend:${userId}:7d`;
let trend = await redis.get(cacheKey);

if (!trend) {
  trend = await calculateTrend(userId, 7);
  await redis.set(cacheKey, JSON.stringify(trend), 'EX', 300);  // Cache 5 minutes
}

// 3. CloudFront (edge caching)
// Configured in Amplify automatically

// ❌ BAD: No caching (slow, expensive)
```

**Database Indexing**
```typescript
// ✅ GOOD: DynamoDB GSI for common queries
// Table: GlucoseReadings
// PK: userId, SK: timestamp
// GSI: userId-mealContext-index (query fasting readings efficiently)

const fastingReadings = await dynamodb.query({
  TableName: 'GlucoseReadings',
  IndexName: 'userId-mealContext-index',
  KeyConditionExpression: 'userId = :uid AND mealContext = :ctx',
  ExpressionAttributeValues: {
    ':uid': userId,
    ':ctx': 'FASTING',
  },
});

// ❌ BAD: Scan entire table (slow, expensive)
const allReadings = await dynamodb.scan({ TableName: 'GlucoseReadings' });
const fastingReadings = allReadings.filter(r => r.mealContext === 'FASTING');
```

### 5. Cost Optimization

**Use On-Demand Pricing for Variable Workloads**
```typescript
// ✅ GOOD: DynamoDB on-demand (auto-scales, pay-per-request)
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
  // On-demand billing is default in Amplify
});

// ❌ BAD: Provisioned capacity for unpredictable traffic (overprovisioning)
```

**Lambda ARM64 (Graviton2)**
```typescript
// ✅ GOOD: 20% cost savings + better performance
export const glucoseApi = defineFunction({
  name: 'glucose-api',
  architecture: 'arm64',  // AWS Graviton2
  runtime: 'nodejs20.x',
});

// ❌ BAD: x86_64 (default, more expensive)
```

**S3 Lifecycle Policies**
```json
// ✅ GOOD: Archive old images to Glacier
{
  "Rules": [
    {
      "Id": "ArchiveOldRetinaScan",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 365,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}

// ❌ BAD: Keep everything in S3 Standard (expensive for archival data)
```

**CloudWatch Logs Retention**
```bash
# ✅ GOOD: Delete old logs automatically
aws logs put-retention-policy \
  --log-group-name /aws/lambda/glucose-api \
  --retention-in-days 7  # Reduce from default 'Never Expire'

# ❌ BAD: Infinite retention (costs add up: $0.50/GB/month)
```

---

## Code Standards

### 1. TypeScript/JavaScript

**Naming Conventions**
```typescript
// ✅ GOOD
const BEDROCK_MODEL_ID = 'anthropic.claude-3-haiku-20240307-v1:0';  // UPPER_SNAKE_CASE for constants
class UserProfile { }                                                // PascalCase for classes
function calculateHbA1c(avgGlucose: number): number { }             // camelCase for functions
interface GlucoseReading { }                                        // PascalCase for interfaces

// ❌ BAD
const bedrock_model_id = '...';  // Inconsistent
function CalculateHbA1c() { }    // Wrong case
```

**Function Length**
```typescript
// ✅ GOOD: Single Responsibility Principle
const validateGlucoseReading = (value: number, unit: string) => {
  if (unit === 'MG_DL' && (value < 20 || value > 600)) {
    throw new Error('Invalid glucose value');
  }
};

const saveGlucoseReading = async (reading: GlucoseReading) => {
  validateGlucoseReading(reading.value, reading.unit);
  await dynamodb.putItem(reading);
};

// ❌ BAD: God function (100+ lines, does everything)
const processGlucoseReading = async (reading: GlucoseReading) => {
  // Validate
  // Transform
  // Save to DB
  // Send notification
  // Update dashboard
  // Log analytics
  // ...
};
```

**Error Handling**
```typescript
// ✅ GOOD: Specific error types
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

try {
  validateGlucoseReading(glucose);
} catch (error) {
  if (error instanceof ValidationError) {
    return { statusCode: 400, body: error.message };
  }
  throw error;  // Re-throw unexpected errors
}

// ❌ BAD: Swallow all errors
try {
  validateGlucoseReading(glucose);
} catch (error) {
  console.log('Error occurred');  // No visibility into what failed
}
```

**Async/Await (Not Callbacks)**
```typescript
// ✅ GOOD
const getUser = async (userId: string): Promise<User> => {
  const result = await dynamodb.getItem({ Key: { userId } });
  return result.Item as User;
};

// ❌ BAD: Callback hell
const getUser = (userId: string, callback: (err: Error, user: User) => void) => {
  dynamodb.getItem({ Key: { userId } }, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result.Item);
    }
  });
};
```

### 2. Python

**PEP 8 Compliance**
```python
# ✅ GOOD
def calculate_hba1c(avg_glucose: float) -> float:
    """Calculate HbA1c from average glucose using GMI formula."""
    return (avg_glucose + 46.7) / 28.7

# ❌ BAD
def CalculateHbA1c(avgGlucose):  # Wrong case, no type hints, no docstring
    return (avgGlucose + 46.7) / 28.7
```

**Type Hints**
```python
# ✅ GOOD
from typing import List, Dict, Optional

def get_glucose_readings(
    user_id: str,
    start_date: Optional[str] = None
) -> List[Dict[str, any]]:
    """Fetch glucose readings for a user."""
    pass

# ❌ BAD: No type hints
def get_glucose_readings(user_id, start_date=None):
    pass
```

**Use f-strings (Python 3.6+)**
```python
# ✅ GOOD
user_id = "user123"
message = f"Glucose logged for user {user_id}"

# ❌ BAD: Old-style formatting
message = "Glucose logged for user %s" % user_id
message = "Glucose logged for user {}".format(user_id)
```

---

## Git Workflow

### 1. Branching Strategy

**Branch Types:**
```bash
main            # Production (protected, no direct commits)
staging         # Pre-production testing
feature/DR-123  # Feature branches (JIRA ticket number)
bugfix/DR-456   # Bug fixes
hotfix/DR-789   # Urgent production fixes
```

**Example Workflow:**
```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/DR-123-glucose-export

# Work on feature (commit often)
git add .
git commit -m "Add glucose export to CSV"

# Push to remote
git push origin feature/DR-123-glucose-export

# Create Pull Request on GitHub
# After approval, merge to main (squash commits)
```

### 2. Commit Messages

**Format: Conventional Commits**
```bash
# ✅ GOOD
git commit -m "feat: add glucose export to CSV"
git commit -m "fix: resolve DR scan timeout on slow networks"
git commit -m "docs: update API documentation for chatbot endpoint"
git commit -m "refactor: extract validation logic into separate module"
git commit -m "test: add unit tests for HbA1c calculation"

# Commit types: feat, fix, docs, style, refactor, test, chore

# ❌ BAD
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "asdfasdf"
```

**Commit Message Body (for complex changes)**
```bash
git commit -m "feat: add diabetic retinopathy screening

Integrates Amazon Rekognition Custom Labels to detect DR severity
from fundus images. Supports 5 severity levels: No DR, Mild NPDR,
Moderate NPDR, Severe NPDR, PDR.

Model achieves 92.4% sensitivity and 88.1% specificity on validation set.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
"
```

### 3. Pull Request Guidelines

**PR Template:**
```markdown
## Description
[Brief description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass (`npm test`)
- [ ] Manual testing completed
- [ ] Lighthouse score >90

## Screenshots (if UI change)
[Attach before/after screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented hard-to-understand areas
- [ ] Updated documentation
- [ ] No new warnings
```

**PR Review Process:**
1. Automated checks pass (lint, test, build)
2. Peer review (1+ approvals required)
3. Reviewer checks: code quality, test coverage, security
4. Squash merge to main (clean Git history)

---

## Testing Practices

### 1. Unit Testing (Jest)

**Test Coverage Target: ≥80%**
```typescript
// src/utils/glucose.test.ts
import { calculateHbA1c } from './glucose';

describe('calculateHbA1c', () => {
  it('should calculate HbA1c from average glucose', () => {
    expect(calculateHbA1c(154)).toBeCloseTo(7.0, 1);  // 154 mg/dL → 7.0%
    expect(calculateHbA1c(183)).toBeCloseTo(8.0, 1);
  });

  it('should throw error for invalid glucose values', () => {
    expect(() => calculateHbA1c(-10)).toThrow('Invalid glucose value');
    expect(() => calculateHbA1c(700)).toThrow('Invalid glucose value');
  });
});
```

**Mock External Dependencies**
```typescript
// ✅ GOOD: Mock AWS SDK calls
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

const dynamoMock = mockClient(DynamoDBClient);

test('should save glucose reading to DynamoDB', async () => {
  dynamoMock.on(PutItemCommand).resolves({});

  await saveGlucoseReading({ userId: 'user123', value: 142 });

  expect(dynamoMock.calls()).toHaveLength(1);
});

// ❌ BAD: Actual AWS calls in unit tests (slow, costs money, requires credentials)
```

### 2. Integration Testing

**Test API Endpoints (Supertest)**
```typescript
import request from 'supertest';
import app from '../app';

describe('POST /glucose/readings', () => {
  it('should create a new glucose reading', async () => {
    const response = await request(app)
      .post('/glucose/readings')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        value: 142,
        unit: 'MG_DL',
        mealContext: 'POST_MEAL',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should return 401 if not authenticated', async () => {
    const response = await request(app)
      .post('/glucose/readings')
      .send({ value: 142 });

    expect(response.status).toBe(401);
  });
});
```

### 3. E2E Testing (Playwright)

**Critical User Journeys**
```typescript
import { test, expect } from '@playwright/test';

test('user can log glucose reading', async ({ page }) => {
  // Login
  await page.goto('https://diabetcare.ai/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'Test1234!');
  await page.click('button[type="submit"]');

  // Navigate to glucose tracker
  await page.click('text=Log Glucose');

  // Fill form
  await page.fill('input[name="glucose"]', '142');
  await page.selectOption('select[name="mealContext"]', 'POST_MEAL');
  await page.click('button[type="submit"]');

  // Verify success
  await expect(page.locator('text=Glucose logged!')).toBeVisible();
});
```

---

## Error Handling

### 1. Structured Error Responses

**API Error Format:**
```typescript
interface ErrorResponse {
  error: {
    code: string;          // Machine-readable error code
    message: string;       // Human-readable error message
    details?: any;         // Additional context (optional)
  };
}

// ✅ GOOD
return {
  statusCode: 400,
  body: JSON.stringify({
    error: {
      code: 'INVALID_GLUCOSE_VALUE',
      message: 'Glucose value must be between 20-600 mg/dL',
      details: { providedValue: 700, unit: 'MG_DL' },
    },
  }),
};

// ❌ BAD: Plain text error
return { statusCode: 400, body: 'Invalid input' };
```

### 2. Error Recovery

**Graceful Degradation**
```typescript
// ✅ GOOD: Fallback if AI service fails
try {
  const drResult = await rekognition.detectCustomLabels(image);
  return { severity: drResult.Labels[0].Name, confidence: drResult.Labels[0].Confidence };
} catch (error) {
  console.error('Rekognition failed:', error);

  // Fallback: Save image for manual review
  await s3.putObject({ Bucket: 'manual-review', Key: imageId });

  return {
    severity: 'UNKNOWN',
    confidence: 0,
    message: 'Image saved for manual review. You will be notified within 24 hours.',
  };
}

// ❌ BAD: Crash entirely
```

---

## Logging & Monitoring

### 1. Structured Logging

**Use JSON Format (CloudWatch Logs Insights)**
```typescript
// ✅ GOOD
console.log(JSON.stringify({
  level: 'INFO',
  message: 'Glucose reading logged',
  userId: 'user123',
  glucose: 142,
  timestamp: new Date().toISOString(),
}));

// Query in CloudWatch Logs Insights:
// fields @timestamp, userId, glucose
// | filter message = "Glucose reading logged"
// | stats avg(glucose) by userId

// ❌ BAD: Unstructured log
console.log(`User user123 logged glucose 142`);
```

### 2. Log Levels

```typescript
// ERROR: Actionable issues requiring immediate attention
console.error('DynamoDB write failed:', error);

// WARN: Potential issues, degraded performance
console.warn('DR scan took 45 seconds (expected <30s)');

// INFO: Informational events
console.log('User logged in:', userId);

// DEBUG: Detailed diagnostic information (only in dev)
if (process.env.NODE_ENV === 'development') {
  console.debug('Glucose trend calculation:', trendData);
}
```

### 3. CloudWatch Metrics

**Custom Metrics**
```typescript
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

const publishMetric = async (metricName: string, value: number) => {
  const cloudwatch = new CloudWatchClient({});
  await cloudwatch.send(new PutMetricDataCommand({
    Namespace: 'DiabetCare',
    MetricData: [{
      MetricName: metricName,
      Value: value,
      Unit: 'Count',
      Timestamp: new Date(),
    }],
  }));
};

// Track business metrics
await publishMetric('GlucoseReadingsLogged', 1);
await publishMetric('DRScansCompleted', 1);
```

---

## Cost Optimization

### 1. Monitor AWS Costs

**Set Billing Alarms**
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name diabetcare-monthly-cost-limit \
  --alarm-description "Alert if monthly cost exceeds ₹60,000" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 86400 \
  --threshold 750 \  # $750 ≈ ₹60,000
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1
```

### 2. Cost Allocation Tags

**Tag all resources:**
```typescript
// Tag Lambda functions
export const glucoseApi = defineFunction({
  name: 'glucose-api',
  tags: {
    Project: 'DiabetCare',
    Environment: 'Production',
    CostCenter: 'Healthcare',
  },
});

// View costs by tag in AWS Cost Explorer
```

---

## AI/ML Best Practices

### 1. Prompt Engineering (Bedrock)

**Clear Instructions**
```python
# ✅ GOOD: Structured prompt with examples
SYSTEM_PROMPT = """
You are a diabetes advisor AI. Provide accurate, evidence-based guidance.

Response Format:
1. Direct answer (2-3 sentences)
2. Actionable next steps
3. Source citation

Example:
User: "What is target HbA1c?"
Assistant: "For most adults with diabetes, target HbA1c is <7%. However, individualized targets may be 6.5-8% depending on age and health conditions.

Next Steps:
- Discuss target with your doctor
- Check HbA1c every 3 months

Source: ADA Standards of Care 2024"
"""

# ❌ BAD: Vague prompt
SYSTEM_PROMPT = "You help people with diabetes."
```

### 2. Model Selection

```python
# ✅ GOOD: Use cheapest model that meets requirements
# Chatbot: Claude 3 Haiku ($0.25/$1.25 per 1M tokens)
# Complex analysis: Claude 3 Sonnet ($3/$15 per 1M tokens)

if task == 'simple_qa':
    model_id = 'anthropic.claude-3-haiku-20240307-v1:0'
elif task == 'complex_medical_summary':
    model_id = 'anthropic.claude-3-sonnet-20240229-v1:0'

# ❌ BAD: Always use most expensive model
model_id = 'anthropic.claude-opus-4-5-20251101'  # $15/$75 per 1M tokens
```

### 3. Rate Limiting AI APIs

```typescript
// ✅ GOOD: Implement rate limiting
import Bottleneck from 'bottleneck';

const bedrockLimiter = new Bottleneck({
  minTime: 100,  // Min 100ms between requests
  maxConcurrent: 5,  // Max 5 concurrent requests
});

const generateChatbotResponse = bedrockLimiter.wrap(async (message: string) => {
  return await bedrock.invokeModel({ prompt: message });
});

// ❌ BAD: Unlimited concurrent requests (quota exceeded errors)
```

---

**Version:** 1.0
**Last Updated:** 2026-01-25
**Authors:** DiabetCare AI Team
**Review Schedule:** Monthly

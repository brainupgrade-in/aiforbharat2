# Technical Stack Documentation
## AWS AI for Bharat - Diabetes Screening Solution

**Project Name:** DiabetCare AI
**Use Case:** Diabetes Management + Diabetic Retinopathy Screening
**Last Updated:** 2026-01-25

---

## Executive Summary

DiabetCare AI is a **mobile-first progressive web application (PWA)** built using ReactJS that provides AI-powered diabetes management and diabetic retinopathy screening for India's 77 million diabetic population. The solution leverages AWS Amplify for rapid full-stack development and AWS Bedrock for generative AI capabilities.

**Key Decisions:**
- ✅ **ReactJS PWA** instead of native Flutter app (faster development, no app store deployment)
- ✅ **AWS Amplify** for complete backend infrastructure (auth, database, APIs, hosting)
- ✅ **AWS Bedrock** for AI/ML capabilities (no custom model training required)
- ✅ **GitHub Pages** for static wireframe hosting in `docs/` folder
- ✅ **AWS Cloud9 / Amazon Q Developer** for cloud-based development environment

---

## Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (PWA)                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ReactJS 18.x + Vite                                   │    │
│  │  - Material-UI/TailwindCSS (responsive mobile-first)  │    │
│  │  - React Router for navigation                         │    │
│  │  - Context API / Redux for state management           │    │
│  │  - PWA capabilities (offline, install to home screen) │    │
│  │  - IndexedDB for local data caching                   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Hosted on: AWS Amplify Hosting                                 │
│  - Automatic CI/CD from GitHub                                  │
│  - Global CDN via CloudFront                                    │
│  - Custom domain with SSL                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER (AWS Amplify)                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  AWS Amplify Gen 2 (TypeScript-first)                │      │
│  │  - Data (DynamoDB with type-safe schema)             │      │
│  │  - Auth (Amazon Cognito with social login)           │      │
│  │  - Storage (S3 for medical images)                   │      │
│  │  - Functions (Lambda for business logic)             │      │
│  │  - APIs (GraphQL via AWS AppSync)                    │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    AI/ML LAYER (AWS Bedrock)                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Amazon Bedrock Foundation Models                    │      │
│  │  - Claude 3 Sonnet/Haiku (conversational AI)         │      │
│  │  - Titan Multimodal (image analysis)                 │      │
│  │  - Bedrock Agents (diabetes advisor chatbot)         │      │
│  │  - Bedrock Knowledge Bases (medical info retrieval)  │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  AWS Rekognition (computer vision)                   │      │
│  │  - Custom labels for diabetic retinopathy detection  │      │
│  │  - Image quality assessment                          │      │
│  │  - Foot ulcer detection                              │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                    │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐       │
│  │ DynamoDB    │  │ S3 Bucket   │  │ Amazon Cognito   │       │
│  │ - Users     │  │ - Eye scans │  │ - User pool      │       │
│  │ - Glucose   │  │ - Reports   │  │ - Identity pool  │       │
│  │ - Meals     │  │ - ML data   │  │ - OAuth (Google) │       │
│  │ - Checkups  │  │             │  │                  │       │
│  └─────────────┘  └─────────────┘  └──────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Component Breakdown

### 1. Frontend - ReactJS Progressive Web App

#### Core Framework
```json
{
  "framework": "React 18.3.1",
  "buildTool": "Vite 5.x",
  "language": "JavaScript/TypeScript",
  "targetBrowsers": "Chrome 90+, Safari 14+, Firefox 88+"
}
```

#### UI Component Library
**Primary Choice: TailwindCSS + shadcn/ui**
- Mobile-first responsive design
- Dark mode support (reduce eye strain for diabetic patients)
- Accessibility (WCAG 2.1 AA compliance)
- Small bundle size (<50 KB gzipped)

**Alternative: Material-UI (MUI)**
- Pre-built healthcare-friendly components
- Better for rapid prototyping
- Slightly larger bundle size (~100 KB)

#### Key Libraries

| Library | Purpose | Bundle Impact |
|---------|---------|---------------|
| `react-router-dom` | Client-side routing | 10 KB |
| `@aws-amplify/ui-react` | Pre-built Amplify components | 30 KB |
| `aws-amplify` | AWS services integration | 150 KB |
| `recharts` | Glucose/mood charts | 45 KB |
| `react-hook-form` | Form handling | 25 KB |
| `date-fns` | Date utilities | 15 KB |
| `react-webcam` | Camera access for retinal scans | 8 KB |
| `workbox` | PWA/offline support | 20 KB |

**Total Bundle Target:** <400 KB (gzipped)

#### PWA Features
```javascript
// manifest.json
{
  "name": "DiabetCare AI",
  "short_name": "DiabetCare",
  "description": "AI-powered diabetes management for India",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Offline Capabilities:**
- Service Worker caching strategy (Cache-First for static assets, Network-First for API calls)
- IndexedDB for local glucose readings storage
- Background sync for data upload when online
- Offline fallback page

#### Internationalization (i18n)
```javascript
// Languages supported
const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'bn', name: 'বাংলা (Bengali)' }
];

// Using react-i18next
import { useTranslation } from 'react-i18next';
```

---

### 2. Backend - AWS Amplify Gen 2

#### Why Amplify?
✅ **Rapid Development:** Full-stack in TypeScript, no separate backend code
✅ **Type Safety:** End-to-end type safety from schema to frontend
✅ **Built-in Features:** Auth, database, storage, APIs out-of-the-box
✅ **Auto-scaling:** Serverless architecture scales automatically
✅ **Cost-Effective:** Pay only for usage, extensive free tier

#### Amplify Architecture
```typescript
// amplify/backend.ts (Amplify Gen 2 schema)
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

export const backend = defineBackend({
  auth,
  data,
  storage,
});
```

#### Data Schema (DynamoDB via Amplify Data)
```typescript
// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  User: a.model({
    userId: a.id().required(),
    name: a.string().required(),
    age: a.integer(),
    gender: a.enum(['MALE', 'FEMALE', 'OTHER']),
    diabetesType: a.enum(['TYPE_1', 'TYPE_2', 'PREDIABETES']),
    diagnosisDate: a.date(),
    targetGlucose: a.integer(), // mg/dL
    language: a.string().default('en'),
    createdAt: a.datetime(),
  }).authorization(allow => [allow.owner()]),

  GlucoseReading: a.model({
    userId: a.id().required(),
    value: a.integer().required(), // mg/dL
    timestamp: a.datetime().required(),
    mealContext: a.enum(['FASTING', 'BEFORE_MEAL', 'AFTER_MEAL', 'RANDOM']),
    notes: a.string(),
  }).authorization(allow => [allow.owner()]),

  MealLog: a.model({
    userId: a.id().required(),
    timestamp: a.datetime().required(),
    imageUrl: a.string(), // S3 URL
    foodItems: a.string().array(), // Detected food items
    estimatedCarbs: a.integer(), // grams
    aiAnalysis: a.json(), // Bedrock response
  }).authorization(allow => [allow.owner()]),

  RetinaScan: a.model({
    userId: a.id().required(),
    imageUrl: a.string().required(), // S3 URL
    scanDate: a.datetime().required(),
    riskLevel: a.enum(['NO_DR', 'MILD', 'MODERATE', 'SEVERE', 'PROLIFERATIVE']),
    confidence: a.float(),
    findings: a.string(),
    reviewed: a.boolean().default(false),
  }).authorization(allow => [allow.owner()]),

  ChatSession: a.model({
    userId: a.id().required(),
    messages: a.json().array(), // [{role, content, timestamp}]
    startTime: a.datetime(),
    endTime: a.datetime(),
  }).authorization(allow => [allow.owner()]),
}).authorization(allow => [allow.publicApiKey()]);

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({ schema });
```

#### Authentication (Amazon Cognito)
```typescript
// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: true, // OTP-based login for low digital literacy
    externalProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
  },
  userAttributes: {
    preferredUsername: { required: false, mutable: true },
    phoneNumber: { required: false, mutable: true },
  },
  multifactor: {
    mode: 'OPTIONAL',
    sms: true,
  },
});
```

#### Storage (Amazon S3)
```typescript
// amplify/storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'diabetCareStorage',
  access: (allow) => ({
    'retina-scans/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
    'meal-photos/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
    'reports/*': [
      allow.authenticated.to(['read']),
      allow.guest.to(['read']),
    ],
  }),
});
```

#### Lambda Functions (Custom Business Logic)
```typescript
// amplify/functions/analyze-retina/handler.ts
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { RekognitionClient, DetectCustomLabelsCommand } from "@aws-sdk/client-rekognition";

export const handler = async (event) => {
  const { imageS3Key, userId } = JSON.parse(event.body);

  // Step 1: Rekognition Custom Labels for DR detection
  const rekognition = new RekognitionClient({ region: 'us-east-1' });
  const detectCommand = new DetectCustomLabelsCommand({
    ProjectVersionArn: process.env.DR_MODEL_ARN,
    Image: { S3Object: { Bucket: process.env.BUCKET_NAME, Name: imageS3Key } },
    MinConfidence: 70,
  });
  const detectionResult = await rekognition.send(detectCommand);

  // Step 2: Bedrock for natural language explanation
  const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });
  const prompt = `Based on this diabetic retinopathy scan analysis: ${JSON.stringify(detectionResult.CustomLabels)}, provide a patient-friendly explanation in simple language. Include risk level, what it means, and recommended next steps.`;

  const invokeCommand = new InvokeModelCommand({
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const response = await bedrock.send(invokeCommand);
  const explanation = JSON.parse(new TextDecoder().decode(response.body)).content[0].text;

  return {
    statusCode: 200,
    body: JSON.stringify({
      riskLevel: detectionResult.CustomLabels[0]?.Name,
      confidence: detectionResult.CustomLabels[0]?.Confidence,
      explanation,
    }),
  };
};
```

---

### 3. AI/ML - AWS Bedrock

#### Why AWS Bedrock?
✅ **No Model Training:** Use pre-trained foundation models
✅ **Serverless:** Pay per token, no infrastructure management
✅ **HIPAA Eligible:** Healthcare data compliance
✅ **Multilingual:** Supports Hindi, Tamil, Telugu out-of-the-box
✅ **Fast Time-to-Market:** No ML expertise required

#### Bedrock Models Used

| Model | Use Case | Cost | Latency |
|-------|----------|------|---------|
| **Claude 3 Haiku** | Diabetes chatbot, meal analysis | $0.25/1M input tokens | <2s |
| **Claude 3 Sonnet** | Complex medical explanations, reports | $3/1M input tokens | <3s |
| **Titan Multimodal Embeddings** | Retina image analysis | $0.0008/image | <1s |
| **Amazon Nova Pro** | Food recognition from photos | $0.80/1M tokens | <2s |

#### Bedrock Use Cases

**1. Diabetes Advisor Chatbot**
```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const chatWithDiabetesAdvisor = async (userMessage: string, history: Message[]) => {
  const client = new BedrockRuntimeClient({ region: "us-east-1" });

  const systemPrompt = `You are a compassionate diabetes care advisor for Indian patients. Provide evidence-based guidance on:
- Blood glucose management
- Diet recommendations (Indian foods)
- Exercise suggestions
- Medication reminders
- Complication prevention

Always recommend consulting a doctor for medical decisions. Use simple language. Support Hindi and English.`;

  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage }
  ];

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
      temperature: 0.7,
    }),
  });

  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));

  return result.content[0].text;
};
```

**2. Meal Photo Analysis**
```typescript
const analyzeMealPhoto = async (imageS3Url: string) => {
  const client = new BedrockRuntimeClient({ region: "us-east-1" });

  const prompt = `Analyze this Indian meal photo:
1. Identify food items (e.g., roti, rice, dal, sabzi, etc.)
2. Estimate total carbohydrates in grams
3. Provide glycemic index rating (Low/Medium/High)
4. Suggest healthier alternatives if needed
5. Estimated impact on blood glucose

Format response as JSON with fields: foodItems[], totalCarbs, glycemicIndex, healthScore (1-10), suggestions.`;

  const command = new InvokeModelCommand({
    modelId: "amazon.nova-pro-v1:0",
    body: JSON.stringify({
      messages: [{
        role: "user",
        content: [
          { image: { format: "jpeg", source: { s3Location: { uri: imageS3Url } } } },
          { text: prompt }
        ]
      }],
      inferenceConfig: { maxTokens: 1000, temperature: 0.3 }
    }),
  });

  const response = await client.send(command);
  return JSON.parse(new TextDecoder().decode(response.body)).output.message.content[0].text;
};
```

**3. Personalized Health Reports**
```typescript
const generateWeeklyReport = async (userId: string, glucoseData: GlucoseReading[], meals: MealLog[]) => {
  const prompt = `Generate a weekly diabetes management report for an Indian patient:

Glucose Readings (last 7 days):
${glucoseData.map(r => `${r.timestamp}: ${r.value} mg/dL (${r.mealContext})`).join('\n')}

Meals Logged:
${meals.map(m => `${m.timestamp}: ${m.foodItems.join(', ')} (${m.estimatedCarbs}g carbs)`).join('\n')}

Provide:
1. Overall glycemic control summary
2. Trend analysis (improving/stable/concerning)
3. Top 3 actionable insights
4. Dietary patterns observed
5. Recommendations for next week

Use encouraging, patient-friendly language in both English and Hindi.`;

  const client = new BedrockRuntimeClient({ region: "us-east-1" });
  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const response = await client.send(command);
  return JSON.parse(new TextDecoder().decode(response.body)).content[0].text;
};
```

**4. Bedrock Knowledge Bases (RAG for Medical Info)**
```typescript
// Store diabetes education content in S3, index with Knowledge Bases
const queryDiabetesKnowledge = async (question: string) => {
  const client = new BedrockAgentRuntimeClient({ region: "us-east-1" });

  const command = new RetrieveAndGenerateCommand({
    input: { text: question },
    retrieveAndGenerateConfiguration: {
      type: "KNOWLEDGE_BASE",
      knowledgeBaseConfiguration: {
        knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
        modelArn: "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
      },
    },
  });

  const response = await client.send(command);
  return response.output.text;
};
```

---

### 4. Computer Vision - Amazon Rekognition Custom Labels

#### Diabetic Retinopathy Detection Model

**Training Approach:**
1. Use public datasets (Kaggle Diabetic Retinopathy Detection - 35,000 images)
2. Upload to S3 with labels (No DR, Mild, Moderate, Severe, Proliferative)
3. Train Rekognition Custom Labels model (no code required)
4. Deploy model endpoint
5. Invoke from Lambda function

**Model Performance Targets:**
- Accuracy: >90% (comparable to ophthalmologist screening)
- Sensitivity: >95% (minimize false negatives for severe cases)
- Specificity: >85%

**Training Cost:** ~$1/hour training, ~$4/hour inference endpoint (stop when not in use)

**Alternative:** Use AWS HealthLake Imaging for DICOM support if fundus cameras provide medical-grade images.

---

### 5. Development Environment - AWS Cloud9 (Primary IDE)

#### Why AWS Cloud9?

✅ **Cloud-based IDE** - Access from anywhere, no local setup required
✅ **Pre-configured AWS** - AWS CLI, SDKs, and credentials already set up
✅ **Collaboration-ready** - Pair programming with shared workspaces
✅ **Cost-effective** - Free tier available (t2.micro EC2 instance)
✅ **Integrated terminal** - Run Amplify CLI, npm, git commands seamlessly
✅ **Auto-save** - Never lose your work
✅ **Debugger** - Built-in debugging for Node.js and Python

#### AWS Cloud9 Setup

```bash
# 1. Create Cloud9 environment in AWS Console
#    - Navigate to: AWS Console → Cloud9 → Create environment
#    - Name: diabetcare-ai-dev
#    - Instance type: t2.micro (1 GiB RAM + 1 vCPU) - Free tier eligible
#    - Platform: Amazon Linux 2023
#    - Network: Default VPC with public subnet

# 2. Environment is auto-configured with:
- Node.js 20.x LTS
- Python 3.12
- AWS CLI v2 (pre-authenticated with your IAM role)
- Git 2.x
- npm 10.x
- Docker (optional, for local testing)

# 3. Install additional tools
npm install -g @aws-amplify/cli
npm install -g vite

# 4. Clone repository and setup
git clone https://github.com/your-username/ai-for-bharat-2.git
cd ai-for-bharat-2
npm install

# 5. Initialize Amplify project
amplify init
# Choose:
# - Environment name: dev
# - Default editor: Visual Studio Code (Cloud9 compatible)
# - AWS profile: Use AWS profile already configured

# 6. Start development server
npm run dev
# Preview on Cloud9: Tools → Preview → Preview Running Application
```

#### Amazon Q Developer Integration (AI Pair Programmer)

AWS Cloud9 now includes **Amazon Q Developer** (formerly CodeWhisperer) for AI-assisted coding:

**Features:**
- **Code completions** - AI-powered suggestions for React components, Amplify schema
- **Function generation** - Generate entire Lambda functions from comments
- **Test generation** - Auto-create unit tests for your code
- **Bug detection** - Security vulnerability scanning (OWASP, CWE)
- **Code explanation** - Understand complex code with AI summaries
- **Inline documentation** - Generate JSDoc/TSDoc comments
- **Refactoring suggestions** - Improve code quality

**Usage in Cloud9:**
1. Open any `.js`, `.ts`, `.jsx`, `.tsx` file
2. Start typing or add a comment describing what you want
3. Press `Alt+C` (or `Option+C` on Mac) to trigger suggestions
4. Accept with `Tab`, reject with `Esc`

**Example:**
```typescript
// Generate a function to calculate HbA1c from average glucose
// [Amazon Q suggests complete implementation]
```

#### Cloud9 Workspace Organization

```
/environment/ai-for-bharat-2/
├── amplify/                  # Amplify backend configuration
│   ├── backend.ts           # Backend schema
│   ├── auth/                # Cognito configuration
│   ├── data/                # DynamoDB schema
│   └── storage/             # S3 configuration
├── src/                     # React frontend source
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom hooks
│   └── utils/               # Utility functions
├── docs/                    # Wireframes (GitHub Pages)
├── public/                  # Static assets
├── package.json
├── vite.config.ts
└── README.md
```

#### Development Workflow in Cloud9

**1. Daily Development:**
```bash
# Open Cloud9 environment
# Navigate to project directory
cd ai-for-bharat-2

# Pull latest changes
git pull origin main

# Start Amplify sandbox (local backend)
npx ampx sandbox &

# Start React dev server
npm run dev

# Preview in Cloud9:
# Tools → Preview → Preview Running Application
# Opens browser at: https://<cloud9-id>.vfs.cloud9.us-east-1.amazonaws.com/
```

**2. Testing:**
```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Type check
npm run type-check
```

**3. Deployment:**
```bash
# Deploy backend to AWS
npx ampx sandbox --once

# Build frontend for production
npm run build

# Deploy to Amplify Hosting (automatic on git push)
git add .
git commit -m "feat: add glucose tracker feature"
git push origin main

# Amplify CI/CD will automatically:
# 1. Build React app
# 2. Deploy backend changes
# 3. Update frontend on CloudFront CDN
```

#### Cloud9 Cost Optimization

**Free Tier (12 months):**
- t2.micro instance (1 GiB RAM, 1 vCPU)
- 750 hours/month of usage
- Sufficient for solo development

**After Free Tier:**
- t2.micro: ~$9/month (if running 24/7)
- **Cost saving:** Set auto-hibernation after 30 minutes of inactivity
- **Best practice:** Stop environment when not in use (weekends, nights)
- **Total cost:** ~$2-3/month with auto-hibernation

**Configuration:**
```bash
# In Cloud9 Settings → Preferences → Project Settings
# Auto-hibernation: 30 minutes
# This automatically stops EC2 instance after inactivity
```

#### Alternative: Local Development (Fallback)

If AWS Cloud9 is unavailable, use local VS Code:

```bash
# Install VS Code with extensions:
- AWS Toolkit (for Amplify, Lambda debugging)
- Amazon Q Developer (AI pair programmer)
- Prettier (code formatting)
- ESLint (code linting)

# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1)

# Same workflow as Cloud9
npm install -g @aws-amplify/cli
git clone https://github.com/your-username/ai-for-bharat-2.git
cd ai-for-bharat-2
npm install
amplify init
npm run dev
```

**Pros of Local:**
- Faster performance (no network latency)
- Works offline
- Use your preferred terminal/shell

**Cons of Local:**
- Manual AWS CLI setup required
- Git credentials management
- Cross-platform compatibility issues
- No built-in collaboration

---

### 6. Wireframing - GitHub Pages (docs/ folder)

#### Setup
```bash
# Create docs/ folder for GitHub Pages
mkdir -p docs/{css,js,images}

# Create static HTML wireframes
docs/
├── index.html              # Landing page wireframe
├── dashboard.html          # Main app dashboard
├── glucose-tracker.html    # Glucose logging screen
├── meal-analyzer.html      # Photo upload for meal analysis
├── retina-scan.html        # Diabetic retinopathy screening
├── chatbot.html            # AI advisor chat interface
├── css/
│   └── wireframe.css       # Minimal styling for wireframes
├── js/
│   └── wireframe.js        # Basic interactivity
└── images/
    └── mockups/            # Screen mockups
```

#### GitHub Pages Configuration
```yaml
# .github/workflows/deploy-wireframes.yml
name: Deploy Wireframes to GitHub Pages

on:
  push:
    branches:
      - main
    paths:
      - 'docs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

**Access URL:** `https://<username>.github.io/ai-for-bharat-2/`

---

## Deployment Architecture

### Development Workflow
```
Local Development → Git Push → Amplify CI/CD → Preview Branch
                                      ↓
                          Code Review & Testing
                                      ↓
                          Merge to Main → Production Deploy
```

### Environments
| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| **Development** | `dev` | `dev.diabetcare.amplifyapp.com` | Active development |
| **Staging** | `staging` | `staging.diabetcare.amplifyapp.com` | Pre-production testing |
| **Production** | `main` | `diabetcare.in` | Live app for users |
| **Wireframes** | `main` (docs/) | `<user>.github.io/ai-for-bharat-2` | Static wireframes |

---

## Cost Estimation

### MVP Phase (1,000 users, 3 months)

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| **Amplify Hosting** | 1,000 users, 10 GB bandwidth | $3 |
| **DynamoDB** | 1M read/write requests | $1.50 |
| **S3 Storage** | 50 GB (retina scans) | $1.15 |
| **Cognito** | 1,000 MAUs | Free (under 50K) |
| **Lambda** | 100K invocations | Free tier |
| **Bedrock (Claude Haiku)** | 50M tokens (~500K conversations) | $12.50 |
| **Bedrock (Nova Pro)** | 10K images analyzed | $8 |
| **Rekognition Custom Labels** | Endpoint running 8 hrs/day | $120 |
| **CloudFront** | 100 GB data transfer | $8.50 |
| **CloudWatch** | Logs and metrics | $5 |
| **Total** | | **~$160/month** |

### Production Phase (100,000 users, 1 year)

| Service | Monthly Cost (avg) |
|---------|-------------------|
| Amplify Hosting | $50 |
| DynamoDB | $150 |
| S3 Storage | $100 |
| Cognito | $275 (55K MAUs @ $0.0055/MAU) |
| Lambda | $80 |
| Bedrock | $1,500 |
| Rekognition | $1,200 |
| CloudFront | $200 |
| Other AWS Services | $100 |
| **Total** | **~$3,655/month** (~₹3 lakh) |

**Free Tier Benefits (Year 1):**
- Amplify: 1,000 build minutes/month free
- Lambda: 1M requests/month free
- DynamoDB: 25 GB storage free
- S3: 5 GB storage free
- Cognito: 50K MAUs free

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Initial Load Time** | <3 seconds | Lighthouse score >90 |
| **Time to Interactive** | <5 seconds | Core Web Vitals |
| **API Response Time** | <500ms (p95) | CloudWatch metrics |
| **Bedrock Latency** | <3 seconds | Lambda duration |
| **Offline Functionality** | 100% core features | PWA audit |
| **Mobile Performance** | >85 Lighthouse score | Mobile audit |
| **Accessibility** | WCAG 2.1 AA | Axe DevTools |

---

## Security & Compliance

### Data Security
- **Encryption at Rest:** All DynamoDB tables and S3 buckets encrypted with AWS KMS
- **Encryption in Transit:** TLS 1.3 for all API calls
- **Authentication:** Cognito with MFA support
- **Authorization:** Fine-grained IAM policies per resource
- **Data Isolation:** User data accessible only to authenticated owner

### HIPAA Compliance (if needed)
- Sign AWS Business Associate Agreement (BAA)
- Enable CloudTrail for audit logging
- Encrypt all PHI (Protected Health Information)
- Implement data retention policies
- Regular security audits

### Indian Regulations
- **Digital Personal Data Protection Act 2023:** User consent for data collection, right to deletion
- **Medical Devices Rules 2017:** Position as "wellness tool" not diagnostic device (consult legal)
- **Information Technology Act 2000:** Data security requirements

---

## Testing Strategy

### Frontend Testing
```bash
# Unit tests (Jest + React Testing Library)
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Accessibility tests
npm run test:a11y

# Performance tests
npm run lighthouse
```

### Backend Testing
```bash
# Amplify sandbox for local testing
npx ampx sandbox

# Lambda function testing
npm run test:lambda

# Load testing (Artillery)
npm run test:load
```

### AI Model Testing
- Accuracy validation on test dataset (20% holdout)
- User acceptance testing with 50+ diabetic patients
- Comparison with ophthalmologist diagnoses (ground truth)

---

## Monitoring & Observability

### AWS Services
- **CloudWatch Dashboards:** Real-time metrics (API latency, error rates, costs)
- **X-Ray:** Distributed tracing for debugging
- **CloudWatch Logs Insights:** Query application logs
- **CloudWatch Alarms:** Alert on high error rates, costs >$500/day

### Application Metrics
- User engagement (DAU/MAU, session duration)
- Feature usage (glucose logs/user, retina scans/month)
- AI accuracy (user feedback on chatbot responses)
- Conversion funnel (signup → first glucose log → retina scan)

---

## Internationalization

### Supported Languages (Priority Order)
1. **English** - Default, widest reach
2. **Hindi (हिन्दी)** - 44% of Indian population
3. **Tamil (தமிழ்)** - South India focus
4. **Telugu (తెలుగు)** - High diabetes prevalence in Andhra Pradesh/Telangana
5. **Bengali (বাংলা)** - Eastern India

### Translation Approach
- **UI Strings:** react-i18next with JSON files
- **AI Responses:** Bedrock models natively support multilingual (Hindi, Tamil, etc.)
- **Medical Content:** Professional translation + medical review

---

## Migration from Flutter to ReactJS PWA

### Why ReactJS PWA > Flutter?

| Criteria | ReactJS PWA | Flutter | Winner |
|----------|-------------|---------|--------|
| **Development Speed** | Faster (single web codebase) | Slower (learn Dart, build APK/IPA) | React ✅ |
| **Deployment** | Instant (web URL) | App Store approval (7-14 days) | React ✅ |
| **Updates** | Instant (refresh page) | App Store updates | React ✅ |
| **Cost** | $0 deployment | $99/year Apple, $25 Google | React ✅ |
| **Discoverability** | SEO, shareable links | App Store search | React ✅ |
| **Offline Support** | Service Workers (good) | Native (excellent) | Flutter |
| **Camera Access** | WebRTC (good) | Native APIs (excellent) | Flutter |
| **Performance** | 60fps (good) | 120fps (excellent) | Flutter |
| **Device Features** | Limited (no Bluetooth, NFC) | Full access | Flutter |

**Decision:** ReactJS PWA wins for **hackathon speed** and **MVP validation**. Can migrate to Flutter later if needed.

---

## References

### Official Documentation
- AWS Amplify Gen 2: https://docs.amplify.aws/react/
- AWS Bedrock: https://docs.aws.amazon.com/bedrock/
- Amazon Rekognition Custom Labels: https://docs.aws.amazon.com/rekognition/latest/customlabels-dg/
- React PWA: https://web.dev/progressive-web-apps/

### Datasets
- Kaggle Diabetic Retinopathy Detection: https://www.kaggle.com/c/diabetic-retinopathy-detection/data
- APTOS 2019 Blindness Detection: https://www.kaggle.com/c/aptos2019-blindness-detection

### Research Papers
- Deep Learning for Diabetic Retinopathy Detection (Nature, 2016)
- AI-based Glucose Prediction Models (Diabetes Care, 2023)

---

## Next Steps

### Week 1: Setup & Wireframes
- [x] Choose tech stack (this document)
- [ ] Create GitHub repository structure
- [ ] Build HTML/CSS wireframes in `docs/`
- [ ] Enable GitHub Pages
- [ ] Set up AWS Cloud9 environment
- [ ] Initialize Amplify project

### Week 2-3: MVP Development
- [ ] Implement authentication (email + Google OAuth)
- [ ] Build glucose tracker UI and backend
- [ ] Integrate Bedrock chatbot
- [ ] Implement meal photo upload

### Week 4-5: AI Features
- [ ] Train Rekognition Custom Labels for DR detection
- [ ] Build retina scan feature
- [ ] Implement Bedrock-powered meal analysis
- [ ] Create weekly report generation

### Week 6: Testing & Deployment
- [ ] User testing with 20+ diabetic patients
- [ ] Performance optimization
- [ ] Security audit
- [ ] Production deployment

### Week 7: Documentation & Presentation
- [ ] Complete README with demo video
- [ ] Create presentation deck
- [ ] Submit to AWS AI for Bharat Hackathon

---

**Last Updated:** 2026-01-25
**Maintained By:** Hackathon Team
**Questions?** Open an issue on GitHub

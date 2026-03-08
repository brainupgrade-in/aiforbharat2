# Design Document

## Overview

Nazar AI (DiabetCare AI) is a mobile-first Progressive Web Application (PWA) that provides comprehensive diabetes management through AI-powered features. The system leverages AWS cloud services to deliver diabetic retinopathy screening, glucose tracking, meal analysis, and personalized diabetes guidance to India's 89.8 million diabetic population.

**Live Prototype:** https://main.d3vwqyp1h0elbo.amplifyapp.com/
**Status:** React MVP deployed with authentication, DR screening workflow (demo mode), AI chatbot (Amazon Nova Micro — LIVE via Lambda Function URL), glucose tracker (DynamoDB-wired), multilingual support (EN/HI/KN), community dashboard, GPS-based doctor finder, PWA with Workbox service worker. 14/14 E2E tests passing (Vitest). Rekognition Custom Labels for DR screening in progress.

The platform addresses critical healthcare gaps by providing accessible, affordable diabetes care through smartphone technology, reducing the need for specialist consultations while enabling early detection of complications.

## Architecture

### High-Level System Architecture

The system follows a serverless, cloud-native architecture built on AWS services:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Layer (PWA)                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  React 18.3.1 + Vite 6.0 (JavaScript)                 │    │
│  │  - TailwindCSS 3.4 + Nazar Design System             │    │
│  │  - Custom i18n (EN, HI, KN)                          │    │
│  │  - Geolocation + Google Maps + WhatsApp              │    │
│  │  - PWA capabilities (installable)                     │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTPS/TLS 1.3
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Layer (AWS Amplify Gen 2)             │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  AWS AppSync (GraphQL API)                           │      │
│  │  - Type-safe schema                                  │      │
│  │  - Real-time subscriptions                           │      │
│  │  - Automatic CRUD operations                         │      │
│  └──────────────────────────────────────────────────────┘      │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Amazon Cognito (Authentication)                     │      │
│  │  - Email/Phone OTP                                   │      │
│  │  - Google OAuth 2.0                                  │      │
│  │  - Multi-factor authentication                       │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    AI/ML Services Layer                          │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  AWS Bedrock                                         │      │
│  │  - Amazon Nova Micro (Diabetes Advisor Chatbot — DEPLOYED)        │      │
│  │  - Amazon Nova Pro (Meal Photo Analysis)            │      │
│  │  - Knowledge Bases (RAG for medical information)    │      │
│  └──────────────────────────────────────────────────────┘      │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Amazon Rekognition Custom Labels                   │      │
│  │  - Diabetic Retinopathy Detection Model             │      │
│  │  - 5-class classification (No DR to PDR)            │      │
│  │  - Target: 92%+ sensitivity, 88%+ specificity       │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    Data Storage Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐       │
│  │ DynamoDB    │  │ Amazon S3   │  │ RDS PostgreSQL   │       │
│  │ - Users     │  │ - Fundus    │  │ - Indian Food    │       │
│  │ - Glucose   │  │   images    │  │   Database       │       │
│  │ - Meals     │  │ - Meal      │  │ - Nutritional    │       │
│  │ - DR Scans  │  │   photos    │  │   data           │       │
│  │ - Chat logs │  │ - Reports   │  │ - GI values      │       │
│  └─────────────┘  └─────────────┘  └──────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### Architectural Principles

1. **Serverless-First**: All backend services are serverless (Lambda, DynamoDB, S3) for automatic scaling and cost optimization
2. **Mobile-First**: PWA design optimized for smartphone usage with offline capabilities
3. **AI-Native**: Core features powered by AWS AI services (Bedrock, Rekognition)
4. **Security by Design**: End-to-end encryption, HIPAA-equivalent compliance
5. **Multilingual**: Support for English, Hindi, and regional Indian languages
6. **Offline-Capable**: Core functionality available without internet connectivity

## Components and Interfaces

### Frontend Components

#### Implemented React Components (Live in MVP)

**1. Authentication Components** ✅
- `NazarAuthScreen`: Branded login screen with animated eye SVG, impact stats (89M diabetics, 43% undiagnosed, 90% blindness preventable), rotating testimonial carousel, and Amplify Authenticator integration
- `App.jsx`: Auth gate that shows NazarAuthScreen if unauthenticated, NazarApp if authenticated

**2. App Shell & Navigation** ✅
- `NazarApp`: Main app shell with sticky header (logo, language switcher, high-contrast toggle, sign-out) and bottom tab navigation (Home, Scan, AI Chat, Glucose, Community) — 5 tabs; Results shown after scan completion

**3. Home Dashboard** ✅
- `NazarHome`: Animated greeting, scan CTA button, last scan card with LotusSeverity indicator, streak counter with fire animation, 7-day blood sugar sparkline chart (custom SVG), community stats with location-aware user count

**4. DR Screening Components** ✅
- `NazarScan`: Multi-step workflow — patient ID entry → live camera feed with optical guide overlay (concentric circles for fundus positioning) → photo capture/upload → quality assessment → AI analysis simulation (3-second loading)
- `NazarResult`: Dual-mode result display:
  - **Patient mode**: Big color-coded result card, animated eye icon, LotusSeverity indicator (0-4 petals), outcome message (localized), next scan timing card, NearbyDoctors component
  - **Doctor mode**: Clinical header, DR grade & confidence grid, lesion analysis (microaneurysms, hemorrhages, neovascularization, NVD), doctor action buttons (Refer, Review Later, Mark Normal), Export to EHR button

**5. Community Dashboard** ✅
- `NazarCommunity`: Animated total scans counter (284,720+), state leaderboard (top 10 Indian states with multilingual names), village/local stats with PIN code, success stories with multilingual testimonials

**6. Reusable Components** ✅
- `LotusSeverity`: SVG lotus flower with 0-4 petals indicating DR severity (green → kumkum red)
- `IrisLoader`: Eye-themed loading spinner with concentric rings and heartbeat animation
- `MarigoldCelebration`: 20 animated falling marigold flowers for No DR celebration
- `NearbyDoctors`: GPS-based doctor finder using browser geolocation + OpenStreetMap Nominatim reverse geocoding, Google Maps search/directions links, WhatsApp result sharing

**7. Utility Libraries** ✅
- `lib/i18n.js`: Translation system for EN, Hindi (हिन्दी), Kannada (ಕನ್ನಡ) with variable interpolation — covers all screens
- `lib/location.js`: GPS detection, reverse geocoding, 30-min cache in localStorage, Google Maps URL generation, WhatsApp deeplinks

**8. AI Chatbot** ✅
- `NazarChat`: AI diabetes advisor chatbot DEPLOYED with Amazon Nova Micro via Lambda Function URL (`VITE_BEDROCK_ENDPOINT` env var). Supports English, Hindi, Kannada with auto-detection. India-specific diabetes advisor system prompt. Demo fallback with 5 rich response categories when Bedrock unavailable. E2E tested (EN + Hindi responses, error handling, CORS).

**9. Glucose Tracker** ✅
- `NazarGlucose`: Full glucose tracker wired to DynamoDB via Amplify Data (dynamic import of `aws-amplify/data`). Cloud sync status indicator (green = DynamoDB, amber = local only). Recharts trend chart with reference lines at 100/140 mg/dL. Status badges (High/Low/Normal). Multilingual contexts, labels, tips (EN/HI/KN).

#### Planned Components (Phase 2)
- `MealAnalyzer`: Photo-based Indian food recognition (AWS Bedrock Nova Pro integration)
- `Dashboard`: Health metrics overview with HbA1c, time in range, complication risk scores

#### PWA Infrastructure ✅

**Service Worker Strategy**
- Production PWA configured via `vite-plugin-pwa` with Workbox
- Service worker auto-generated at build time (`sw.js` + workbox runtime)
- Precaching: JS, CSS, HTML, PNG, SVG assets (8 entries, ~1578 KiB)
- Runtime caching: Google Fonts (CacheFirst), AppSync API (NetworkFirst)
- App installable on mobile Chrome

**Offline Data Management**
- Location data cached in localStorage (30-min TTL)
- Glucose readings stored locally when DynamoDB unavailable (amber "local only" indicator)
- Full IndexedDB offline sync planned for Phase 2

### Backend Services

#### AWS Amplify Data Schema (Deployed)

The following 5 models are deployed in ap-south-1 via Amplify Gen 2 with AppSync GraphQL and DynamoDB:

**UserProfile Model** ✅ Deployed
```typescript
UserProfile {
  name: string
  age: integer
  diabetesType: string        // Type 1, Type 2, Pre-diabetic, Gestational
  diagnosedYear: integer
  medications: json
  targetFasting: integer      // mg/dL
  targetPostMeal: integer     // mg/dL
  language: string            // en, hi, ta, te, bn
}
// Authorization: owner-only access
```

**GlucoseReading Model** ✅ Deployed
```typescript
GlucoseReading {
  value: integer              // mg/dL
  context: string             // Fasting, Before meal, After meal, Random, Bedtime
  notes: string
  readingAt: datetime
  status: string              // normal, high, low
}
// Authorization: owner-only access
```

**RetinaScan Model** ✅ Deployed
```typescript
RetinaScan {
  imageKey: string            // S3 key for fundus image
  classification: string     // No DR, Mild NPDR, Moderate NPDR, Severe NPDR, PDR
  confidence: float           // AI confidence %
  riskLevel: string           // low, moderate, high
  findings: json              // Detailed lesion analysis
  recommendations: json       // Referral suggestions
}
// Authorization: owner-only access
```

**MealLog Model** ✅ Deployed
```typescript
MealLog {
  name: string                // Meal name
  photoKey: string            // S3 key for meal image
  totalCarbs: integer
  glycemicLoad: string        // High, Medium, Low
  healthScore: integer
  items: json                 // Food items array
  aiSuggestions: json
}
// Authorization: owner-only access
```

**ChatMessage Model** ✅ Deployed
```typescript
ChatMessage {
  role: string                // user, assistant
  content: string
  sessionId: string
}
// Authorization: owner-only access
```

**Backend API Endpoint:**
- GraphQL: `https://i7ntbxsdmjda5c2asxjppckzbm.appsync-api.ap-south-1.amazonaws.com/graphql`
- Auth: AMAZON_COGNITO_USER_POOLS
- User Pool: `ap-south-1_kbmI8hA9b`
- Identity Pool: `ap-south-1:7f1b41d4-5786-4246-85b9-fa7ab00b8d83`

#### Backend Architecture Note

**Current Architecture (MVP):**
The MVP uses a simplified architecture without Lambda functions. Key integrations:
- **Glucose Tracker** → Direct AppSync GraphQL → DynamoDB (via Amplify Data client in `NazarGlucose.jsx`)
- **AI Chatbot** → Lambda Function URL (`VITE_BEDROCK_ENDPOINT`) → Bedrock Amazon Nova Micro (DEPLOYED, LIVE). Falls back to demo mode when endpoint unavailable.
- **DR Screening** → Demo mode with simulated results. UI complete with patient/doctor modes.

**Planned Lambda Functions (Phase 2-3):**

**1. Chatbot Bedrock Endpoint** 📋 Planned
- Lambda function proxying Bedrock Amazon Nova Micro API calls (DEPLOYED via Function URL)
- System prompt: diabetes advisor, multilingual, India-specific
- Frontend ready: `NazarChat.jsx` calls `VITE_BEDROCK_ENDPOINT`

**2. DR Analysis Function** 📋 Planned
- S3 fundus image upload → Rekognition Custom Labels inference
- Patient-friendly explanation via Bedrock
- Store results in DynamoDB RetinaScan model

**3. Meal Analysis Function** 📋 Planned
- Process meal photos using Bedrock Nova Pro
- Query Indian food database for nutritional data

**4. Risk Calculator Function** 📋 Planned
- Analyze glucose patterns for complication risk
- Calculate HbA1c estimates from glucose data

### External Integrations

#### ABDM (Ayushman Bharat Digital Mission)
- ABHA ID linking and validation
- Health Information Exchange (HIE) integration
- Consent management framework compliance
- FHIR R4 format for health records

#### Healthcare Provider APIs
- eSanjeevani telemedicine integration
- Doctor dashboard for patient monitoring
- Clinical decision support alerts
- Prescription management system

## Data Models

### Core Data Entities

#### User Profile
```typescript
interface UserProfile {
  userId: string;
  personalInfo: {
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phoneNumber: string;
    email?: string;
  };
  medicalInfo: {
    diabetesType: 'TYPE_1' | 'TYPE_2' | 'PREDIABETES';
    diagnosisDate: Date;
    targetGlucoseRange: {
      min: number; // mg/dL
      max: number; // mg/dL
    };
    medications: Medication[];
    allergies: string[];
  };
  preferences: {
    language: string;
    units: 'mg/dL' | 'mmol/L';
    notifications: NotificationSettings;
    privacy: PrivacySettings;
  };
  abhaId?: string;
}
```

#### Glucose Data
```typescript
interface GlucoseReading {
  id: string;
  userId: string;
  value: number; // mg/dL
  timestamp: Date;
  mealContext: 'FASTING' | 'BEFORE_MEAL' | 'AFTER_MEAL' | 'RANDOM';
  notes?: string;
  location?: 'HOME' | 'CLINIC' | 'HOSPITAL';
  deviceType?: 'GLUCOMETER' | 'CGM' | 'MANUAL';
  syncStatus: 'SYNCED' | 'PENDING' | 'FAILED';
}

interface GlucosePattern {
  userId: string;
  patternType: 'DAWN_PHENOMENON' | 'POST_MEAL_SPIKE' | 'HYPOGLYCEMIA' | 'HYPERGLYCEMIA';
  frequency: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
  detectedAt: Date;
}
```

#### DR Screening Data
```typescript
interface DRScreening {
  id: string;
  userId: string;
  imageMetadata: {
    s3Key: string;
    uploadTimestamp: Date;
    imageQuality: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
    resolution: { width: number; height: number };
    fileSize: number;
  };
  analysis: {
    riskLevel: 'NO_DR' | 'MILD_NPDR' | 'MODERATE_NPDR' | 'SEVERE_NPDR' | 'PDR';
    confidence: number; // 0-100
    findings: string[];
    recommendations: string[];
    urgencyLevel: 'ROUTINE' | 'URGENT' | 'IMMEDIATE';
  };
  clinicalReview?: {
    reviewedBy: string; // Doctor ID
    reviewDate: Date;
    overriddenDiagnosis?: string;
    clinicalNotes: string;
    treatmentPlan?: string;
  };
}
```

#### Meal Analysis Data
```typescript
interface MealLog {
  id: string;
  userId: string;
  timestamp: Date;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  imageUrl?: string;
  foodItems: FoodItem[];
  nutritionalInfo: {
    totalCarbs: number; // grams
    totalCalories: number;
    protein: number; // grams
    fat: number; // grams
    fiber: number; // grams
    glycemicIndex: number;
    glycemicLoad: number;
  };
  predictedGlucoseImpact: {
    peakTime: number; // minutes after meal
    peakValue: number; // mg/dL
    duration: number; // minutes
  };
}

interface FoodItem {
  name: string;
  nameHindi?: string;
  category: string;
  portion: {
    amount: number;
    unit: 'grams' | 'cups' | 'pieces' | 'tablespoons';
  };
  nutritionPer100g: {
    carbs: number;
    calories: number;
    protein: number;
    fat: number;
    fiber: number;
    gi: number; // Glycemic Index
  };
  confidence: number; // AI recognition confidence
}
```

### Database Design

#### DynamoDB Tables

**Primary Tables**
- `Users`: User profiles and preferences (Partition Key: userId)
- `GlucoseReadings`: Time-series glucose data (Partition Key: userId, Sort Key: timestamp)
- `DRScreenings`: Retinal scan results (Partition Key: userId, Sort Key: scanDate)
- `MealLogs`: Meal analysis records (Partition Key: userId, Sort Key: timestamp)
- `ChatSessions`: Conversation history (Partition Key: userId, Sort Key: sessionId)

**Secondary Indexes**
- `GlucoseByDate`: Query glucose readings by date range
- `DRByRiskLevel`: Query high-risk DR cases for clinical review
- `MealsByType`: Analyze meal patterns by type and time

#### PostgreSQL Schema (Indian Food Database)

```sql
-- Food items with nutritional information
CREATE TABLE food_items (
    food_id SERIAL PRIMARY KEY,
    name_english VARCHAR(255) NOT NULL,
    name_hindi VARCHAR(255),
    name_regional JSONB, -- Other regional language names
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    region VARCHAR(50), -- North, South, East, West Indian
    
    -- Nutritional data per 100g
    calories DECIMAL(6,2),
    carbohydrates DECIMAL(6,2),
    protein DECIMAL(6,2),
    fat DECIMAL(6,2),
    fiber DECIMAL(6,2),
    sugar DECIMAL(6,2),
    
    -- Glycemic data
    glycemic_index INTEGER,
    glycemic_load DECIMAL(4,1),
    
    -- Metadata
    data_source VARCHAR(100), -- IFCT 2017, USDA, etc.
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Common portion sizes for Indian foods
CREATE TABLE portion_sizes (
    portion_id SERIAL PRIMARY KEY,
    food_id INTEGER REFERENCES food_items(food_id),
    description VARCHAR(255), -- "1 medium roti", "1 cup cooked rice"
    weight_grams DECIMAL(6,2),
    household_measure VARCHAR(100) -- "1 piece", "1 cup", "1 tablespoon"
);

-- Regional variations of the same food
CREATE TABLE food_variations (
    variation_id SERIAL PRIMARY KEY,
    base_food_id INTEGER REFERENCES food_items(food_id),
    variation_name VARCHAR(255),
    region VARCHAR(50),
    preparation_method VARCHAR(255),
    nutritional_difference JSONB -- Differences from base food
);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Before defining the correctness properties, let me analyze the acceptance criteria for testability:

### Property Reflection

After analyzing all acceptance criteria, I identified several areas where properties can be consolidated to eliminate redundancy:

**Authentication & Security Properties**: Properties 1.1-1.5 and 10.3-10.5 can be streamlined to focus on core authentication flows and security measures without overlap.

**Data Validation Properties**: Properties 2.1-2.2 and 3.1 follow similar validation patterns and can be unified under input validation principles.

**AI Processing Properties**: Properties 3.2-3.3, 4.1-4.2, and 5.1 all test AI service integration and can be consolidated around AI response completeness and timing.

**Dashboard Display Properties**: Properties 6.1-6.3 all test dashboard completeness and can be combined into comprehensive dashboard validation.

**Offline Functionality Properties**: Properties 7.1-7.5 test various aspects of offline operation and can be unified around offline capability preservation.

The following properties represent the essential, non-redundant correctness guarantees:

Property 1: Authentication flow completeness
*For any* valid user credentials (email/phone + OTP or OAuth), authentication should succeed and provide dashboard access within specified time limits
**Validates: Requirements 1.1, 1.2, 1.4**

Property 2: Account security enforcement  
*For any* user account, after 5 failed authentication attempts, the account should be locked for 30 minutes and unauthorized access attempts should be logged
**Validates: Requirements 1.3, 10.5**

Property 3: Data validation and persistence
*For any* valid input data (glucose readings 20-600 mg/dL, profile updates, meal logs), the system should validate, save, and make the data immediately available for retrieval
**Validates: Requirements 1.5, 2.1, 2.3**

Property 4: Invalid input rejection
*For any* invalid input data (out-of-range glucose values, malformed images, invalid profile data), the system should reject the input and display appropriate error messages
**Validates: Requirements 2.2, 3.1**

Property 5: Critical alert generation
*For any* critical health conditions (glucose <70 or >250 mg/dL, Severe NPDR/PDR detection), the system should immediately generate and deliver alerts to users
**Validates: Requirements 2.5, 3.4**

Property 6: AI processing completeness
*For any* AI analysis request (DR screening, meal analysis, chatbot interaction), the system should process the request within specified time limits and return complete results with all required components
**Validates: Requirements 3.2, 3.3, 4.1, 4.2, 5.1**

Property 7: Medical calculation accuracy
*For any* set of glucose readings, the HbA1c estimate should be calculated using the GMI formula and match expected mathematical results
**Validates: Requirements 2.4**

Property 8: Multilingual response consistency
*For any* selected language (Hindi, English, regional languages), all system responses should be in the correct language with appropriate medical terminology
**Validates: Requirements 5.2**

Property 9: Safety guardrail enforcement
*For any* request for medical diagnosis, the chatbot should decline and display disclaimers directing users to healthcare professionals
**Validates: Requirements 5.4**

Property 10: Dashboard information completeness
*For any* user dashboard access, all available health metrics (glucose status, HbA1c, time in range, DR status, risk scores) should be displayed with current data
**Validates: Requirements 6.1, 6.2, 6.3, 6.5**

Property 11: Offline functionality preservation
*For any* offline state, core features (glucose logging, cached data access, basic chatbot responses) should remain functional and sync automatically when connectivity returns
**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

Property 12: Clinical workflow support
*For any* healthcare provider access, the system should display patient data, allow clinical overrides, and support treatment plan creation with proper timestamping and audit trails
**Validates: Requirements 8.1, 8.2, 8.3, 8.5**

Property 13: Data export completeness
*For any* user data export request, the system should provide data in requested formats (CSV, JSON, PDF) including all user data types (glucose, meals, DR scans) with FHIR R4 compliance
**Validates: Requirements 9.4, 9.5**

Property 14: ABDM integration compliance
*For any* ABHA ID linking or health data sharing, the system should follow ABDM protocols including validation, consent management, encryption, and audit logging
**Validates: Requirements 9.1, 9.2, 9.3**

Property 15: System performance standards
*For any* system load up to 10,000 concurrent users, API response times should remain under 500ms for 95% of requests with proper encryption (AES-256, TLS 1.3) maintained
**Validates: Requirements 10.1, 10.2, 10.3**

## Error Handling

### Error Categories and Strategies

#### 1. User Input Errors
**Validation Errors**
- Invalid glucose values (outside 20-600 mg/dL range)
- Malformed email addresses or phone numbers
- Poor quality images (resolution, brightness, focus)

**Handling Strategy**
- Client-side validation with immediate feedback
- Server-side validation as backup
- Clear, actionable error messages in user's language
- Graceful degradation (allow manual entry if image analysis fails)

#### 2. Network and Connectivity Errors
**Offline Scenarios**
- No internet connection
- Intermittent connectivity
- Slow network conditions

**Handling Strategy**
- Offline-first architecture with local data storage
- Background sync when connectivity restored
- Progressive loading with skeleton screens
- Retry mechanisms with exponential backoff

#### 3. AI Service Errors
**AWS Bedrock Failures**
- Model unavailable or rate limited
- Invalid API responses
- Timeout errors

**Handling Strategy**
- Fallback to cached responses for common queries
- Graceful degradation (basic responses instead of AI-generated)
- User notification with retry options
- Circuit breaker pattern to prevent cascade failures

**Amazon Rekognition Errors**
- Custom Labels model not available
- Image processing failures
- Confidence scores below threshold

**Handling Strategy**
- Fallback to manual DR risk assessment questionnaire
- Clear communication about AI limitations
- Option to retry with different image
- Healthcare provider referral for uncertain cases

#### 4. Data Storage Errors
**DynamoDB Failures**
- Write throttling
- Item size limits exceeded
- Conditional check failures

**Handling Strategy**
- Automatic retry with exponential backoff
- Data compression for large items
- Batch operations for efficiency
- Local storage backup during outages

**S3 Upload Failures**
- Network timeouts
- File size limits
- Permission errors

**Handling Strategy**
- Multipart upload for large files
- Client-side image compression
- Upload progress indicators
- Resume capability for interrupted uploads

#### 5. Authentication and Authorization Errors
**Cognito Failures**
- Token expiration
- MFA failures
- Account lockouts

**Handling Strategy**
- Automatic token refresh
- Clear MFA instructions with multiple options
- Account recovery workflows
- Temporary guest mode for critical features

#### 6. Critical Health Alerts
**Alert Delivery Failures**
- Push notification failures
- SMS delivery issues
- Email bounces

**Handling Strategy**
- Multiple delivery channels (push, SMS, email)
- Retry mechanisms with escalation
- In-app persistent notifications
- Emergency contact notification for severe cases

### Error Recovery Patterns

#### Retry Strategies
```typescript
// Exponential backoff for API calls
const retryWithBackoff = async (operation: () => Promise<any>, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

#### Circuit Breaker Pattern
```typescript
// Prevent cascade failures for external services
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > 60000) { // 1 minute
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= 5) {
      this.state = 'OPEN';
    }
  }
}
```

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit testing and property-based testing to provide comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, and integration points between components. Unit tests catch concrete bugs and validate specific scenarios.

**Property-Based Tests**: Verify universal properties that should hold across all inputs. Property tests verify general correctness by testing the system with randomly generated inputs.

Together, these approaches provide comprehensive coverage where unit tests validate specific behaviors and property tests ensure the system behaves correctly across the entire input space.

### Unit Testing Framework

**Frontend Testing (React)**
- **Framework**: Vitest + React Testing Library
- **Coverage Target**: >80% code coverage
- **Focus Areas**:
  - Component rendering and user interactions
  - Form validation and submission
  - Offline functionality and data sync
  - PWA service worker behavior

**Backend Testing (Lambda Functions)**
- **Framework**: Vitest + AWS SDK mocks
- **Coverage Target**: >85% code coverage
- **Focus Areas**:
  - API endpoint functionality
  - Database operations (DynamoDB, PostgreSQL)
  - AWS service integrations
  - Error handling and edge cases

### Property-Based Testing Framework

**Library**: fast-check (JavaScript/TypeScript property-based testing library)
**Configuration**: Minimum 100 iterations per property test to ensure thorough random input coverage
**Tagging**: Each property-based test must include a comment explicitly referencing the design document property it implements

**Property Test Format**:
```typescript
// **Feature: diabetes-management-platform, Property 1: Authentication flow completeness**
test('authentication succeeds for any valid credentials', () => {
  fc.assert(fc.property(
    fc.record({
      email: fc.emailAddress(),
      phone: fc.string({ minLength: 10, maxLength: 15 }),
      authMethod: fc.constantFrom('email', 'phone', 'oauth')
    }),
    async (credentials) => {
      const result = await authenticateUser(credentials);
      expect(result.success).toBe(true);
      expect(result.dashboardAccess).toBe(true);
    }
  ), { numRuns: 100 });
});
```

### Testing Implementation Requirements

**Property-Based Test Implementation**:
- Each correctness property from the design document must be implemented by exactly one property-based test
- Tests must be tagged with the format: `**Feature: diabetes-management-platform, Property {number}: {property_text}**`
- Property tests should be placed as close to implementation as possible to catch errors early
- Tests must run a minimum of 100 iterations to ensure adequate random input coverage

**Unit Test Implementation**:
- Unit tests complement property tests by testing specific examples and edge cases
- Focus on integration points between components
- Test error conditions and boundary cases
- Validate specific user workflows and scenarios

**Test Data Generation**:
- Smart generators that constrain to valid input spaces
- Realistic test data (valid glucose ranges, proper image formats, authentic Indian food names)
- Edge case generation (boundary values, empty inputs, malformed data)

### Integration Testing

**End-to-End Integration Testing (IMPLEMENTED — 14/14 passing)**
- **Framework**: Vitest (native to Vite, `tests/e2e.test.js`)
- **Test Coverage**:
  - Cognito auth (sign in, reject invalid credentials)
  - AppSync GraphQL CRUD (GlucoseReading, UserProfile, ChatMessage — create, list, delete)
  - Bedrock chatbot Lambda (English response, Hindi response, empty message rejection, CORS)
  - Live site health check (HTTP 200)
- **Run**: `npm test` or `npx vitest run`
- **Test User**: `testuser@nazarai.test` / `TestPass@9876`

**API Testing**
- **Framework**: Vitest with direct HTTP/GraphQL calls
- **Coverage**: All GraphQL mutations and queries, Lambda Function URL
- **Authentication**: Cognito USER_PASSWORD_AUTH flow with AWS SDK v3

**Performance Testing**
- **Framework**: Artillery for load testing
- **Targets**: 10,000 concurrent users, <500ms API response times
- **Scenarios**: Peak usage patterns, AI service load testing

### Continuous Integration

**Automated Testing Pipeline**
1. Unit tests run on every commit
2. Property-based tests run on pull requests
3. Integration tests run on staging deployments
4. Performance tests run weekly on production-like environment

**Quality Gates**
- All tests must pass before deployment
- Code coverage must meet minimum thresholds
- Performance benchmarks must be maintained
- Security scans must show no critical vulnerabilities

This comprehensive testing strategy ensures the diabetes management platform maintains high quality and reliability while providing confidence in the correctness of critical health-related functionality.
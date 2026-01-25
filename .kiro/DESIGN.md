# DiabetCare AI - Design Documentation

## Table of Contents
- [Design Philosophy](#design-philosophy)
- [UI/UX Principles](#uiux-principles)
- [Visual Design System](#visual-design-system)
- [Wireframes & User Flows](#wireframes--user-flows)
- [Accessibility](#accessibility)
- [Responsive Design](#responsive-design)
- [Performance Optimization](#performance-optimization)

---

## Design Philosophy

DiabetCare AI is designed for **inclusive access** to diabetes care, prioritizing users with:
- Low digital literacy
- Limited smartphone resources (budget Android devices)
- Intermittent internet connectivity
- Visual/cognitive impairments
- Language diversity (non-English speakers)

**Core Design Tenets:**
1. **Simplicity First**: Reduce cognitive load, minimize clicks
2. **Accessibility by Default**: WCAG 2.1 AA compliance, screen reader support
3. **Offline Resilience**: Core features work without internet
4. **Cultural Sensitivity**: Indian context (food, language, healthcare norms)
5. **Trust & Transparency**: Explain AI decisions, avoid medical jargon

---

## UI/UX Principles

### 1. Progressive Disclosure

**Principle:** Show only what users need, when they need it.

**Example: Glucose Logging**
```
Basic View (Default):
┌─────────────────────────┐
│ Glucose Value: [___] mg/dL
│
│ Meal Context: [Dropdown]
│
│ [Log Reading]
└─────────────────────────┘

Advanced View (Optional):
┌─────────────────────────┐
│ Glucose Value: [___] mg/dL
│ Meal Context: [Dropdown]
│ Add Note: [Text area]
│ Date/Time: [Picker]
│
│ [Log Reading]
└─────────────────────────┘
```

### 2. Contextual Help

**Inline Tooltips:**
- "?" icon next to technical terms
- Tap to show simple explanation

**Example:**
```
HbA1c (?) [6.5%]
  └─ Tooltip: "Average blood sugar over 3 months. Target: <7%"
```

**Chatbot Quick Actions:**
- "What is HbA1c?"
- "How to improve my glucose?"
- "Understand my DR scan result"

### 3. Confirmation for Critical Actions

**Require explicit confirmation for:**
- Deleting glucose readings
- Unlinking ABHA ID
- Sharing data with doctors
- Account deletion

**Pattern:**
```javascript
// 2-step confirmation with re-type
<Dialog>
  <DialogTitle>Delete All Glucose Data?</DialogTitle>
  <DialogContent>
    This will permanently delete {count} readings. Type "DELETE" to confirm.
    <Input placeholder="Type DELETE" />
  </DialogContent>
  <DialogActions>
    <Button variant="text">Cancel</Button>
    <Button variant="danger" disabled={input !== 'DELETE'}>
      Delete Permanently
    </Button>
  </DialogActions>
</Dialog>
```

### 4. Feedback & Affordance

**Visual Feedback:**
- Button press: Immediate color change + scale animation
- Loading states: Skeleton screens (not spinners alone)
- Success: Green checkmark + haptic feedback
- Error: Red alert + clear recovery action

**Example: DR Scan Upload**
```
[Upload Retina Scan]
  ↓ (tap)
[📷 Uploading... 45%]  ← Progress indicator
  ↓
[✅ Scan uploaded! Analyzing...]  ← Success + next step
  ↓ (18 seconds)
[⚠️ Moderate DR Detected]  ← Result with clear severity
[See Detailed Report]
```

### 5. Error Prevention

**Pre-emptive Validation:**
```typescript
// Prevent invalid glucose values
<Input
  type="number"
  min={20}
  max={600}
  onInput={(e) => {
    if (e.target.value > 600) {
      setError('Glucose cannot exceed 600 mg/dL. Is this correct?');
    }
  }}
/>
```

**Undo Actions:**
- Allow undo for glucose entry deletion (30-second grace period)
- Restore from "Recently Deleted" (like iOS Photos)

---

## Visual Design System

### 1. Color Palette

**Primary Colors:**
```css
--primary-blue: #2563eb;      /* Main CTA buttons, links */
--primary-green: #059669;     /* Success states, healthy metrics */
--primary-red: #dc2626;       /* Alerts, critical glucose levels */
--primary-purple: #7c3aed;    /* AI features, chatbot */
```

**Semantic Colors:**
```css
/* Glucose Levels */
--glucose-low: #ef4444;       /* <70 mg/dL: Hypoglycemia */
--glucose-target: #10b981;    /* 70-180 mg/dL: Target range */
--glucose-high: #f59e0b;      /* 181-250 mg/dL: High */
--glucose-critical: #dc2626;  /* >250 mg/dL: Critical high */

/* DR Severity */
--dr-none: #10b981;           /* No DR */
--dr-mild: #f59e0b;           /* Mild NPDR */
--dr-moderate: #f97316;       /* Moderate NPDR */
--dr-severe: #dc2626;         /* Severe NPDR/PDR */
```

**Neutral Colors:**
```css
--gray-50: #f9fafb;           /* Background */
--gray-100: #f3f4f6;          /* Card background */
--gray-500: #6b7280;          /* Secondary text */
--gray-900: #111827;          /* Primary text */
```

### 2. Typography

**Font Family:**
```css
/* System font stack (no custom fonts for performance) */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
             'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

/* Hindi/Indic scripts */
font-family: 'Noto Sans Devanagari', sans-serif;  /* Only when displaying Hindi */
```

**Type Scale:**
```css
--text-xs: 0.75rem;    /* 12px: Captions */
--text-sm: 0.875rem;   /* 14px: Helper text */
--text-base: 1rem;     /* 16px: Body text */
--text-lg: 1.125rem;   /* 18px: Emphasized text */
--text-xl: 1.25rem;    /* 20px: Card titles */
--text-2xl: 1.5rem;    /* 24px: Page titles */
--text-3xl: 1.875rem;  /* 30px: Dashboard metrics */
--text-4xl: 2.25rem;   /* 36px: Hero text */
```

**Line Height:**
```css
--leading-tight: 1.25;  /* Headings */
--leading-normal: 1.5;  /* Body text */
--leading-relaxed: 1.75;/* Long-form content */
```

### 3. Spacing & Layout

**8px Grid System:**
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
```

**Container Widths:**
```css
--container-sm: 640px;   /* Mobile */
--container-md: 768px;   /* Tablet */
--container-lg: 1024px;  /* Desktop */
--container-xl: 1280px;  /* Large desktop */
```

### 4. Iconography

**Icon Library:** Lucide React (MIT license, 1,000+ icons)
```typescript
import { Heart, TrendingUp, Camera, MessageCircle } from 'lucide-react';

// Usage
<Heart className="w-6 h-6 text-red-500" />
```

**Icon Sizes:**
```css
--icon-sm: 16px;   /* Inline with text */
--icon-md: 24px;   /* Default */
--icon-lg: 32px;   /* Feature highlights */
--icon-xl: 48px;   /* Empty states */
```

**Icon Usage Guidelines:**
- Use icons WITH labels (not icon-only buttons, except common ones like "×" for close)
- Minimum touch target: 48x48 dp (including padding)
- Icons should be ARIA-labeled for screen readers

### 5. Components

**Button Styles:**
```tsx
// Primary CTA
<Button variant="primary" size="lg">
  Log Glucose Reading
</Button>
/* Background: --primary-blue, White text, Rounded corners, Shadow */

// Secondary
<Button variant="secondary">
  View History
</Button>
/* Background: Transparent, Blue border, Blue text */

// Danger
<Button variant="danger">
  Delete Account
</Button>
/* Background: --primary-red, White text */
```

**Card Component:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Latest Glucose Reading</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-4xl font-bold text-green-600">142 mg/dL</p>
    <p className="text-sm text-gray-500">2 hours ago • Post-meal</p>
  </CardContent>
</Card>
```

**Input Fields:**
```tsx
<Input
  label="Blood Glucose"
  type="number"
  placeholder="Enter glucose value"
  helperText="Target: 70-180 mg/dL"
  error={errors.glucose}
  rightIcon={<span className="text-gray-500">mg/dL</span>}
/>
```

---

## Wireframes & User Flows

### 1. Wireframe Reference

**All wireframes are hosted at:** https://your-username.github.io/ai-for-bharat-2/

**Key Screens:**
- Landing Page: [`index.html`](../docs/index.html)
- Dashboard: [`dashboard.html`](../docs/dashboard.html)
- Glucose Tracker: [`glucose-tracker.html`](../docs/glucose-tracker.html)
- Meal Analyzer: [`meal-analyzer.html`](../docs/meal-analyzer.html)
- Retina Scan: [`retina-scan.html`](../docs/retina-scan.html)
- Chatbot: [`chatbot.html`](../docs/chatbot.html)

### 2. User Flow: Glucose Logging

```
[Dashboard]
  ↓ Tap "Log Glucose"
[Glucose Entry Form]
  ├─ Enter value: 142
  ├─ Select meal context: "Post-meal"
  ├─ (Optional) Add note
  └─ Tap "Save"
      ↓
[Success Toast: "Glucose logged!"]
  ↓ Auto-navigate (2 seconds)
[Dashboard with updated chart]
  └─ New reading appears in trend chart
```

### 3. User Flow: DR Screening

```
[Dashboard]
  ↓ Tap "DR Screening"
[DR Scan Screen]
  ↓ Tap "Take Photo"
[Camera Viewfinder]
  ├─ Guide: "Center the eye in the frame"
  └─ Tap capture button
      ↓
[Preview Image]
  ├─ "Retake" or "Use This Photo"
  └─ Tap "Use This Photo"
      ↓ Upload to S3 (3-5 seconds)
[Analyzing Screen]
  ├─ Animation: Eye scanning
  └─ "Analyzing retina... 18 seconds"
      ↓ Rekognition inference
[Results Screen]
  ├─ Severity: "Moderate NPDR"
  ├─ Confidence: 89%
  ├─ Recommendation: "Consult ophthalmologist within 2 weeks"
  └─ [Download Report PDF]
```

### 4. User Flow: AI Chatbot

```
[Dashboard]
  ↓ Tap "Ask AI Advisor"
[Chatbot Screen]
  ├─ Quick actions:
  │   • "What foods lower blood sugar?"
  │   • "Explain my HbA1c"
  └─ Type custom question
      ↓
[User Message: "What is target glucose?"]
  ↓ Send (Bedrock Claude API)
[AI Response]
  "For most adults with diabetes, target fasting glucose is
   80-130 mg/dL and post-meal glucose <180 mg/dL. However,
   your doctor may set personalized targets based on your age,
   health conditions, and risk of hypoglycemia."

   📚 Source: ADA Standards of Care 2024

  └─ [Was this helpful? 👍 👎]
```

---

## Accessibility

### 1. WCAG 2.1 Level AA Compliance

**Perceivable:**
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
  ```css
  /* Good: Black text on white background (21:1) */
  color: #111827; background: #ffffff;

  /* Good: White text on blue button (4.6:1) */
  color: #ffffff; background: #2563eb;

  /* Bad: Light gray on white (1.5:1) */
  color: #d1d5db; background: #ffffff;
  ```

- **Alt Text**: All images have descriptive alt attributes
  ```tsx
  <img src="/glucose-chart.png" alt="7-day glucose trend showing average 145 mg/dL" />
  ```

- **Captions**: Video tutorials have closed captions (Hindi + English)

**Operable:**
- **Keyboard Navigation**: All interactive elements are keyboard-accessible
  ```tsx
  // Proper tab order
  <form>
    <Input tabIndex={1} />
    <Input tabIndex={2} />
    <Button tabIndex={3}>Submit</Button>
  </form>
  ```

- **Focus Indicators**: Visible focus ring on all interactive elements
  ```css
  button:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
  ```

- **No Keyboard Traps**: Users can navigate away from all components with keyboard

**Understandable:**
- **Language**: HTML lang attribute set
  ```html
  <html lang="en">  <!-- or lang="hi" for Hindi -->
  ```

- **Error Messages**: Clear, actionable error messages
  ```tsx
  <Input
    error="Glucose value must be between 20-600 mg/dL"
    aria-invalid={hasError}
    aria-describedby="glucose-error"
  />
  ```

**Robust:**
- **Semantic HTML**: Use proper HTML5 elements
  ```tsx
  <nav>...</nav>      <!-- Not <div role="navigation"> -->
  <button>...</button>  <!-- Not <div onClick={...}> -->
  <h1>...</h1>        <!-- Not <div className="heading"> -->
  ```

### 2. Screen Reader Support

**ARIA Labels:**
```tsx
<button aria-label="Log glucose reading">
  <PlusIcon />  {/* Icon without visible text */}
</button>

<input
  type="number"
  aria-label="Glucose value in mg/dL"
  aria-describedby="glucose-help"
/>
<p id="glucose-help">Target range: 70-180 mg/dL</p>
```

**Live Regions:**
```tsx
<div role="status" aria-live="polite">
  {isLoading && "Uploading retina scan..."}
  {isSuccess && "Scan uploaded successfully!"}
</div>
```

### 3. Motor Impairment Support

**Large Touch Targets:**
- Minimum 48x48 dp (iOS HIG, Material Design)
- Adequate spacing between buttons (8px minimum)

**Voice Input:**
- Use semantic HTML `<input>` elements for native voice dictation support
- Avoid custom text entry components

---

## Responsive Design

### 1. Mobile-First Breakpoints

```css
/* Mobile: 320px - 640px (default) */
.container {
  padding: 1rem;
}

/* Tablet: 640px+ */
@media (min-width: 640px) {
  .container {
    padding: 2rem;
    max-width: 640px;
    margin: 0 auto;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding: 3rem;
  }

  .sidebar {
    display: block;  /* Show sidebar on desktop */
  }
}
```

### 2. Adaptive Layouts

**Dashboard Grid:**
```tsx
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Latest Reading</Card>
  <Card>HbA1c Estimate</Card>
  <Card>Time in Range</Card>
  <Card>DR Scan Status</Card>
  <Card>Meal Logs</Card>
  <Card>Chatbot</Card>
</div>
```

### 3. Responsive Typography

```css
/* Fluid typography (scales between mobile and desktop) */
h1 {
  font-size: clamp(1.5rem, 5vw, 2.25rem);
}

body {
  font-size: clamp(0.875rem, 2vw, 1rem);
}
```

---

## Performance Optimization

### 1. Lighthouse Targets

- **Performance**: >90
- **Accessibility**: 100
- **Best Practices**: >90
- **SEO**: 100
- **PWA**: Installable

### 2. Image Optimization

**Format:**
- WebP for photos (70% smaller than JPEG)
- SVG for icons/illustrations
- Lazy loading for below-the-fold images

```tsx
<img
  src="/glucose-chart.webp"
  alt="Glucose trend"
  loading="lazy"
  width={800}
  height={400}
/>
```

**Responsive Images:**
```tsx
<img
  src="/retina-scan-800.jpg"
  srcSet="
    /retina-scan-400.jpg 400w,
    /retina-scan-800.jpg 800w,
    /retina-scan-1200.jpg 1200w
  "
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  alt="Fundus image"
/>
```

### 3. Code Splitting

**Route-based splitting:**
```typescript
// Lazy load route components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GlucoseTracker = lazy(() => import('./pages/GlucoseTracker'));
const DRScan = lazy(() => import('./pages/DRScan'));

// Suspense fallback
<Suspense fallback={<LoadingSkeleton />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/glucose" element={<GlucoseTracker />} />
    <Route path="/dr-scan" element={<DRScan />} />
  </Routes>
</Suspense>
```

### 4. Bundle Size Budget

```json
// package.json
{
  "size-limit": [
    {
      "path": "dist/assets/*.js",
      "limit": "200 KB"
    },
    {
      "path": "dist/assets/*.css",
      "limit": "50 KB"
    }
  ]
}
```

### 5. Critical CSS

**Inline critical CSS in HTML:**
```html
<head>
  <style>
    /* Above-the-fold CSS */
    body { margin: 0; font-family: system-ui; }
    .header { background: #2563eb; color: white; }
  </style>
  <link rel="stylesheet" href="/main.css" media="print" onload="this.media='all'">
</head>
```

---

**Version:** 1.0
**Last Updated:** 2026-01-25
**Authors:** DiabetCare AI Design Team
**Design Tools:** Figma, GitHub Pages (wireframes)

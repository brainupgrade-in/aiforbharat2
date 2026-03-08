# Nazar AI (DiabetCare AI) - Screenshots & Demo

Screenshots and visual documentation for the Nazar AI platform.

**Live Prototype:** [https://main.d3vwqyp1h0elbo.amplifyapp.com/](https://main.d3vwqyp1h0elbo.amplifyapp.com/)

---

## React MVP Screenshots (Live App)

The React MVP is deployed on AWS Amplify Hosting. Below are the key screens:

### 1. Branded Auth Screen (Login)
**Features Shown:**
- Animated eye SVG with AI scan line effect
- Impact stats: 89M diabetics, 43% undiagnosed, 90% blindness preventable
- Rotating testimonial carousel (English, Hindi, Kannada)
- Email-based signup/login via Amazon Cognito
- Hindi tagline: "आँखों से प्यार झलकना चाहिए, बीमारी नहीं"
- Security footer: End-to-end encrypted, HIPAA compliant

### 2. Home Dashboard
**Features Shown:**
- Animated greeting message (localized)
- Prominent "Scan" CTA button
- Last scan card with Lotus severity indicator
- Streak counter with fire animation
- 7-day blood sugar sparkline chart (fasting + post-meal)
- Community stats with location-aware user count
- Bottom tab navigation (Home, Scan, Results, Community)

### 3. Retina Scan - Camera Capture
**Features Shown:**
- Patient ID input (name or Aadhar last 4 digits)
- Live camera feed with optical guide overlay (concentric circles)
- "Take Photo" and "Upload from Gallery" buttons
- Photo quality assessment badge
- Retake button for re-capture

### 4. Retina Scan - AI Analysis
**Features Shown:**
- IrisLoader custom spinner animation
- "Analyzing..." message with heartbeat effect
- Eye-themed loading UI

### 5. Results - Patient Mode
**Features Shown:**
- Big result card (color-coded by severity)
- Animated eye icon SVG
- Lotus flower severity indicator (0-4 petals)
- Outcome message (localized): "Eyes Are Healthy" / "See a Doctor"
- Next scan timing card (12, 6, 3, 1, 0 months based on grade)
- Marigold celebration animation (for No DR results)
- "Scan Another Patient" button

### 6. Results - Doctor Mode
**Features Shown:**
- Clinical header with patient ID, scan date, severity
- DR grade & confidence grid
- Lesion analysis: microaneurysms, hemorrhages, neovascularization
- Doctor action buttons: Refer, Review Later, Mark Normal
- Export to EHR button (ABDM integration)

### 7. Nearby Doctors (GPS-Based)
**Features Shown:**
- Detected location display (town, district, PIN code)
- "Find Eye Doctors Nearby" button (Google Maps)
- "Find Eye Hospitals" button (Google Maps)
- "Get Directions" button (navigation)
- WhatsApp share button with scan result + location

### 8. Community Dashboard
**Features Shown:**
- Total scans counter (animated: 284,720+)
- State leaderboard (top 10 Indian states)
- Village/local stats with location detection
- Success stories with multilingual testimonials

### 9. Language Switcher & Accessibility
**Features Shown:**
- Language toggle: EN / हिंदी / ಕನ್ನಡ
- High contrast mode toggle
- Sign-out button

---

## Original Wireframe Screenshots (HTML/CSS)

**Location:** `./screenshots/` folder

All screenshots captured at **390x844px** (iPhone 12/13 viewport) with 2x device scale factor.

**Method:** Puppeteer with `fullPage: true` and `captureBeyondViewport: true` options.

### Quick View

```
screenshots/
├── screenshot-01-landing-page.png     (683 KB) - Full-page
├── screenshot-02-dashboard.png        (624 KB) - Full-page
├── screenshot-03-glucose-tracker.png  (340 KB) - Full-page
├── screenshot-04-meal-analyzer.png    (418 KB) - Full-page
├── screenshot-05-retina-scan.png      (767 KB) - Full-page
└── screenshot-06-ai-advisor.png       (625 KB) - Full-page

Total: 6 screenshots, 3.4 MB (full scrollable content)
```

### Regenerate Wireframe Screenshots

```bash
# Full-page screenshots using Puppeteer (RECOMMENDED)
node capture-fullpage-screenshots.js
```

---

## Design System

### Brand Colors (Nazar Design System)
- **Teal:** #0A6E6E (deep), #0E8C8C (medium), #12ABAB (light), #E0F5F5 (pale)
- **Amber:** #F5A623 (warm), #FFF3DC (light), #E09000 (deep)
- **Mango Green:** #4CAF50
- **Kumkum Red:** #D32F2F
- **Ivory:** #FAF7F2
- **Ink:** #1A1A2E

### Typography
- **Display:** Baloo 2 (cursive, for headings)
- **Body:** Noto Sans (sans-serif, for text)
- **Mono:** IBM Plex Mono (for data/numbers)

### Custom Components
- **LotusSeverity** — 0-4 petal flower indicating DR severity
- **IrisLoader** — Eye-themed loading spinner
- **MarigoldCelebration** — Falling marigold flowers for No DR celebration
- **NearbyDoctors** — GPS-based doctor finder with maps + WhatsApp
- **NazarAuthScreen** — Branded login with animated eye hero

### Accessibility
- High contrast mode toggle
- WCAG AA compliant text contrast ratios
- 48x48px minimum touch targets
- ARIA labels on all interactive elements
- Safe area padding for mobile notches

---

## Usage

### For Presentations
Use screenshots in:
- Hackathon pitch decks (PowerPoint/Google Slides)
- GitHub README.md (showcase features)
- Documentation and user guides
- Demo videos and walkthroughs

### For Development Reference
Screenshots serve as:
- Visual reference for feature verification
- Design QA baseline
- Feature completeness checklist
- UX flow documentation

---

**Generated:** 2026-03-08
**Live URL:** https://main.d3vwqyp1h0elbo.amplifyapp.com/
**Total Wireframe Screenshots:** 6

# Mobile App Screenshots

High-resolution mobile screenshots of DiabetCare AI wireframes at 390x844px (iPhone 12/13 viewport).

## Screenshots Gallery

### 01 - Landing Page
![Landing Page](screenshot-01-landing-page.png)
**Features:** Hero section, value propositions, feature highlights

---

### 02 - Dashboard
![Dashboard](screenshot-02-dashboard.png)
**Features:** Glucose stats, trend chart, quick actions, AI insights, reminders

---

### 03 - Glucose Tracker
![Glucose Tracker](screenshot-03-glucose-tracker.png)
**Features:** Manual entry form, reading history, trend indicators

---

### 04 - Meal Analyzer
![Meal Analyzer](screenshot-04-meal-analyzer.png)
**Features:** Photo upload, AI food detection, carb estimation, health scoring

---

### 05 - Retina Scan
![Retina Scan](screenshot-05-retina-scan.png)
**Features:** DR screening, fundus image upload, AI risk assessment, clinical recommendations

---

### 06 - AI Advisor (Chatbot)
![AI Advisor](screenshot-06-ai-advisor.png)
**Features:** Conversational AI, diabetes guidance, quick replies, 24/7 support

---

## Usage in README

To embed these screenshots in your main README.md:

```markdown
## App Screenshots

<div align="center">
  <img src="screenshots/screenshot-01-landing-page.png" width="250" alt="Landing Page" />
  <img src="screenshots/screenshot-02-dashboard.png" width="250" alt="Dashboard" />
  <img src="screenshots/screenshot-03-glucose-tracker.png" width="250" alt="Glucose Tracker" />
</div>

<div align="center">
  <img src="screenshots/screenshot-04-meal-analyzer.png" width="250" alt="Meal Analyzer" />
  <img src="screenshots/screenshot-05-retina-scan.png" width="250" alt="Retina Scan" />
  <img src="screenshots/screenshot-06-ai-advisor.png" width="250" alt="AI Advisor" />
</div>
```

## Technical Details

- **Viewport:** 390x844px (iPhone 12/13)
- **Scale Factor:** 2x (Retina display)
- **Format:** PNG (high-resolution)
- **Type:** Full-page (complete scrollable content)
- **Total Size:** ~3.4 MB (all 6 screenshots)
- **Capture Tool:** Puppeteer (Chrome headless)
- **Source:** HTML wireframes in `docs/` folder
- **Features:**
  - `fullPage: true` - Captures entire scrollable page
  - `captureBeyondViewport: true` - Includes content beyond viewport
  - Mobile user agent for accurate rendering
  - 2-second wait for JavaScript to load

## Regenerating Screenshots

To recapture full-page screenshots after making changes to wireframes:

```bash
# Make sure you're in the project root directory
cd /home/rajesh/ai-for-bharat-2

# Run Puppeteer screenshot capture
node capture-fullpage-screenshots.js
```

This will regenerate all 6 full-page screenshots in this folder.

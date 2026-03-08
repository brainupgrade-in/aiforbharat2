# DiabetCare AI - PWA Wireframes

Mobile-first Progressive Web App wireframes for the DiabetCare AI diabetes management platform.

## Overview

These wireframes demonstrate the complete user interface and navigation flow for DiabetCare AI, built as a fully functional Progressive Web App (PWA) with offline support, mobile-first responsive design, and native app-like features.

## Features

### PWA Capabilities ✅

- **Installable**: Can be installed to home screen on mobile devices (Android/iOS)
- **Offline Support**: Core features work without internet connection
- **Service Worker**: Background caching and sync for seamless experience
- **App-like Feel**: Bottom navigation, gestures, haptic feedback
- **Fast Loading**: Cached resources for instant page loads
- **Responsive**: Mobile-first design that adapts to all screen sizes

### Pages Included

1. **index.html** - Landing page with feature overview
2. **dashboard.html** - Main dashboard with glucose trends and AI insights
3. **glucose-tracker.html** - Log and view glucose readings
4. **meal-analyzer.html** - AI-powered meal photo analysis
5. **retina-scan.html** - Diabetic retinopathy screening interface
6. **chatbot.html** - AI diabetes advisor chatbot
7. **offline.html** - Offline fallback page

### PWA Files

- **manifest.json** - App metadata, icons, shortcuts, theme
- **service-worker.js** - Offline caching, background sync, push notifications
- **css/wireframe.css** - Mobile-first responsive CSS (1,132 lines)
- **js/wireframe.js** - PWA features, interactivity, offline detection (688 lines)

## Getting Started

### Option 1: Local Development Server

```bash
# Using Python (recommended)
cd docs/
python3 -m http.server 8000

# Using Node.js http-server
npx http-server docs/ -p 8000

# Using PHP
php -S localhost:8000 -t docs/
```

Then open: http://localhost:8000

### Option 2: Deploy to GitHub Pages

```bash
# Push to GitHub
git add .
git commit -m "Add DiabetCare AI wireframes"
git push origin main

# Enable GitHub Pages in repository settings
# Set source to: main branch / docs folder
```

Access at: `https://main.d3vwqyp1h0elbo.amplifyapp.com/`

## PWA Installation

### On Android (Chrome/Edge)

1. Open the website in Chrome or Edge
2. Tap the menu (⋮) → "Install app" or "Add to Home screen"
3. Confirm installation
4. App icon will appear on home screen

### On iOS (Safari)

1. Open the website in Safari
2. Tap the Share button (□↑)
3. Scroll down and tap "Add to Home Screen"
4. Name it "DiabetCare" and tap "Add"
5. App icon will appear on home screen

### On Desktop (Chrome/Edge)

1. Open the website in Chrome or Edge
2. Look for install icon in address bar (⊕)
3. Click "Install" when prompted
4. App will open in standalone window

## Testing Offline Functionality

### Method 1: Browser DevTools

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** → Check "Offline"
4. Refresh page - should still work
5. Navigate between pages - cached content loads

### Method 2: Network Throttling

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Change throttling to "Offline"
4. Test navigation and features

### Method 3: Airplane Mode

1. Install PWA to home screen
2. Enable Airplane Mode on device
3. Open app from home screen
4. Core features should work (glucose logging, viewing history)
5. Offline indicator appears at top

## Mobile-First Features

### Bottom Navigation
- Primary navigation for mobile users
- Touch-optimized with 48x48dp targets
- Active state highlighting
- Hides on desktop (>1024px)

### Touch Interactions
- Tap feedback with opacity change
- Haptic vibration (where supported)
- Pull-to-refresh gesture
- Swipe gestures (future enhancement)

### Responsive Breakpoints
- **Mobile**: < 768px (default)
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px
- **Large Desktop**: ≥ 1280px

### Accessibility
- WCAG 2.1 AA compliant
- Focus visible states (2px outline)
- Semantic HTML5 elements
- Screen reader friendly
- Reduced motion support
- High contrast mode compatible

## File Structure

```
docs/
├── index.html                  # Landing page
├── dashboard.html              # Main dashboard
├── glucose-tracker.html        # Glucose logging
├── meal-analyzer.html          # Meal photo analysis
├── retina-scan.html            # DR screening
├── chatbot.html                # AI advisor
├── offline.html                # Offline fallback
├── manifest.json               # PWA manifest
├── service-worker.js           # Service worker
├── css/
│   └── wireframe.css          # Main stylesheet (1,132 lines)
├── js/
│   └── wireframe.js           # Main JavaScript (688 lines)
├── images/                     # (placeholder - icons needed)
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── README.md                   # This file
```

## Creating App Icons

Icons are referenced in `manifest.json` but need to be created. Use these specifications:

### Required Sizes
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

### Design Guidelines
- **Background**: White or gradient (blue #2563eb to green #10b981)
- **Icon**: Glucose meter, drop of blood, or AI symbol
- **Style**: Flat design, rounded corners
- **Format**: PNG with transparency

### Quick Generation

**Using ImageMagick:**
```bash
# Create base 512x512 icon
convert -size 512x512 xc:white -fill '#2563eb' \
  -draw "circle 256,256 256,128" icon-512x512.png

# Generate all sizes
for size in 72 96 128 144 152 192 384; do
  convert icon-512x512.png -resize ${size}x${size} icon-${size}x${size}.png
done
```

**Using Online Tools:**
- https://realfavicongenerator.net/ (recommended)
- https://favicon.io/
- https://www.pwabuilder.com/

## Testing Checklist

### Functionality
- [ ] All pages load correctly
- [ ] Navigation works (bottom nav + links)
- [ ] Service worker registers successfully
- [ ] Offline mode works (airplane mode test)
- [ ] Offline indicator appears when offline
- [ ] Toast notifications display
- [ ] Install prompt appears on supported devices
- [ ] App installs to home screen

### Responsive Design
- [ ] Mobile (< 768px): Bottom nav visible, single column layout
- [ ] Tablet (768-1023px): Optimized spacing, grid layouts
- [ ] Desktop (≥ 1024px): Bottom nav hidden, multi-column
- [ ] No horizontal scrolling on any screen size
- [ ] Touch targets ≥ 48x48px on mobile

### Performance
- [ ] First load < 3 seconds (3G network)
- [ ] Subsequent loads < 1 second (cached)
- [ ] Smooth animations (60fps)
- [ ] No layout shift on load

### Accessibility
- [ ] Tab navigation works
- [ ] Focus visible on all interactive elements
- [ ] Color contrast ≥ 4.5:1 (WCAG AA)
- [ ] Screen reader friendly
- [ ] Reduced motion respected
- [ ] Semantic HTML used

### PWA Compliance
- [ ] Lighthouse PWA score ≥ 90
- [ ] Manifest valid (check Chrome DevTools)
- [ ] Service worker valid (check Application tab)
- [ ] HTTPS required for installation (localhost exempt)
- [ ] Installable prompt appears
- [ ] Works offline after installation

## Lighthouse Testing

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:8000 --view

# Check PWA score
lighthouse http://localhost:8000 --only-categories=pwa
```

Target scores:
- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90
- **PWA**: ≥ 90

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** - No dependencies, pure PWA APIs
- **Service Workers** - Offline functionality
- **IndexedDB** - Client-side database for offline data
- **LocalStorage** - Settings and preferences

## Next Steps for Production

### High Priority
1. **Create app icons** (8 sizes for manifest.json)
2. **Add real chart library** (Chart.js, Recharts, or D3.js)
3. **Implement camera API** for meal photos and retina scans
4. **Connect AWS Amplify backend** (API Gateway, Lambda, DynamoDB)
5. **Add authentication** (Amazon Cognito)
6. **Integrate AWS Bedrock** for chatbot (Claude 3 Haiku)
7. **Integrate Amazon Rekognition** for DR screening

### Medium Priority
8. Add form validation and error handling
9. Implement actual IndexedDB CRUD operations
10. Add push notification functionality
11. Implement background sync for offline data
12. Add unit tests (Jest, Vitest)
13. Add E2E tests (Playwright, Cypress)

### Low Priority
14. Add animations and micro-interactions
15. Implement dark mode toggle
16. Add multilingual support (Hindi, Tamil, Telugu, Bengali)
17. Performance optimizations (lazy loading, code splitting)
18. Add analytics (Google Analytics, Mixpanel)

---

**Built with ❤️ for AWS AI for Bharat Hackathon 2026**

*Empowering India's 89.8 million diabetics with AI-powered mobile-first healthcare*

**Last Updated:** 2026-01-25

# DiabetCare AI - Premium Brand Guidelines

## 🎨 Brand Identity

### Brand Essence
**DiabetCare AI** embodies trust, innovation, and healthcare excellence through a premium, modern design system that prioritizes user experience and accessibility.

### Brand Promise
Empowering India's 89.8 million diabetics with AI-powered, mobile-first healthcare solutions that are beautiful, intuitive, and life-changing.

---

## 🌈 Color System

### Primary Palette

**Brand Primary - Deep Ocean Blue**
- `#0F4C81` - Main brand color (Trust, Medical, Professional)
- `#1E88E5` - Light variant (Interactive elements)
- `#42A5F5` - Lighter variant (Hover states)
- `#0A3D66` - Dark variant (Text, headers)

**Usage:** Headers, primary buttons, navigation, key CTAs

**Brand Secondary - Vibrant Health Green**
- `#00C9A7` - Main secondary color (Health, Success, Growth)
- `#26D9B0` - Light variant
- `#00A78E` - Dark variant

**Usage:** Success states, health indicators, secondary buttons

**Brand Accent - Energetic Purple**
- `#6366F1` - Accent color (Innovation, AI, Technology)
- `#818CF8` - Light variant

**Usage:** Highlights, special features, AI-powered elements

### Functional Colors

**Success** - `#10B981` (Normal glucose, positive outcomes)
**Warning** - `#F59E0B` (Borderline readings, attention needed)
**Danger** - `#EF4444` (High glucose, critical alerts)
**Info** - `#3B82F6` (Informational messages, tips)

### Neutral Scale

- White: `#FFFFFF`
- Gray 50: `#F9FAFB` (lightest)
- Gray 100: `#F3F4F6`
- Gray 200: `#E5E7EB`
- Gray 500: `#6B7280`
- Gray 800: `#1F2937`
- Gray 900: `#111827` (darkest)

---

## ✨ Premium Gradients

### Primary Gradient
```css
background: linear-gradient(135deg, #0F4C81 0%, #1E88E5 100%);
```
**Usage:** Headers, hero sections, primary CTAs

### Secondary Gradient
```css
background: linear-gradient(135deg, #00C9A7 0%, #00A78E 100%);
```
**Usage:** Success buttons, health indicators

### Hero Gradient
```css
background: linear-gradient(135deg, #0F4C81 0%, #1E88E5 50%, #00C9A7 100%);
```
**Usage:** Hero sections, feature highlights

---

## 🔤 Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
             'Helvetica Neue', sans-serif;
```

### Type Scale

**Display (h1)**
- Size: 2rem - 3rem (responsive)
- Weight: 800 (Extra Bold)
- Line Height: 1.2
- Letter Spacing: -0.02em
- Style: Gradient text fill

**Heading 2 (h2)**
- Size: 1.5rem - 2.25rem
- Weight: 700 (Bold)
- Line Height: 1.2

**Heading 3 (h3)**
- Size: 1.25rem - 1.75rem
- Weight: 600 (Semi-Bold)
- Line Height: 1.2

**Body**
- Size: 1rem
- Weight: 400 (Regular)
- Line Height: 1.7
- Color: `--text-secondary`

**Small Text**
- Size: 0.875rem
- Weight: 500 (Medium)
- Usage: Labels, captions, metadata

---

## 🎯 Spacing System

Based on 0.25rem (4px) base unit:

- `--spacing-1`: 0.25rem (4px)
- `--spacing-2`: 0.5rem (8px)
- `--spacing-3`: 0.75rem (12px)
- `--spacing-4`: 1rem (16px) - **Most common**
- `--spacing-6`: 1.5rem (24px)
- `--spacing-8`: 2rem (32px)
- `--spacing-12`: 3rem (48px)
- `--spacing-16`: 4rem (64px)

### Component Spacing Rules

**Cards:**
- Padding: `var(--spacing-6)` (24px)
- Gap: `var(--spacing-4)` (16px)
- Margin Bottom: `var(--spacing-8)` (32px)

**Sections:**
- Margin Bottom: `var(--spacing-8)` (32px)
- Padding: `var(--spacing-4)` to `var(--spacing-6)`

---

## 🔲 Border Radius

Premium rounded corners for modern feel:

- `--radius-xs`: 4px (Minimal)
- `--radius-sm`: 8px (Small elements)
- `--radius-md`: 12px (Standard)
- `--radius-lg`: 16px (Cards, containers)
- `--radius-xl`: 24px (Hero sections, featured cards)
- `--radius-2xl`: 32px (Large containers)
- `--radius-full`: 9999px (Pills, circular buttons)

---

## 💎 Shadow System

Multi-layered shadows for depth and elevation:

**Small (xs)**
```css
box-shadow: 0 1px 2px 0 rgba(15, 76, 129, 0.05);
```
Usage: Subtle elevation, inputs

**Medium (md)**
```css
box-shadow: 0 4px 12px 0 rgba(15, 76, 129, 0.12);
```
Usage: Cards, standard elevation

**Large (lg)**
```css
box-shadow: 0 8px 24px 0 rgba(15, 76, 129, 0.15);
```
Usage: Hover states, modals

**Extra Large (xl)**
```css
box-shadow: 0 12px 40px 0 rgba(15, 76, 129, 0.2);
```
Usage: Hero sections, popovers

**2XL**
```css
box-shadow: 0 20px 60px 0 rgba(15, 76, 129, 0.25);
```
Usage: Modals, overlays, maximum elevation

---

## ✨ Glass-morphism Effects

Modern glassmorphism for premium feel:

```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.18);
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
```

**Usage:** Headers, navigation, overlays, floating elements

---

## 🎬 Animation & Transitions

### Transition Timings

- **Fast**: 150ms (Micro-interactions)
- **Base**: 250ms (Standard interactions)
- **Slow**: 350ms (Complex animations)
- **Bounce**: 500ms (Playful interactions)

### Easing Functions

```css
cubic-bezier(0.4, 0, 0.2, 1) /* Default easing */
cubic-bezier(0.68, -0.55, 0.265, 1.55) /* Bounce effect */
```

### Key Animations

**Fade In Up**
```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

**Float (Icons)**
```css
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
```

**Pulse (Background)**
```css
@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.3;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.5;
    }
}
```

---

## 🔘 Button Styles

### Primary Button
- Background: Secondary gradient (`#00C9A7` → `#00A78E`)
- Color: White
- Padding: 1rem 2rem
- Border Radius: Full (pill shape)
- Shadow: Medium, with glow on hover
- Hover: Lift 2px, enhanced shadow + glow

### Secondary Button
- Background: Semi-transparent white (glassmorphism)
- Border: 2px solid rgba(255, 255, 255, 0.3)
- Color: White
- Backdrop filter: Blur 10px
- Hover: Increased opacity

### Icon Button
- Shape: Circular (48x48px minimum)
- Background: Transparent with glassmorphism
- Hover: Scale 1.05, enhanced shadow

---

## 📦 Card Components

### Standard Card
- Background: White
- Border Radius: `--radius-xl` (24px)
- Padding: `--spacing-6` (24px)
- Shadow: `--shadow-md`
- Border: 1px solid light gray
- Top accent: 4px gradient bar (hidden, shows on hover)
- Hover: Lift 4px, enhanced shadow, show accent

### Glass Card
- Background: Semi-transparent white
- Backdrop filter: Blur 20px
- Border: 1px glassmorphism border
- Shadow: Glass shadow effect

### Stat Card
- Left border: 4px solid brand primary
- Background radial gradient overlay (bottom-right)
- Hover: Lift 4px, thicker border (6px)

---

## 🎨 Component-Specific Guidelines

### Navigation

**Top Header**
- Height: 64px
- Background: Glassmorphism with primary gradient overlay
- Shadow: Medium
- Sticky positioning
- Backdrop blur: 20px

**Bottom Navigation (Mobile)**
- Height: 64px
- Background: Glassmorphism
- 4 main items: Home, Glucose, Meals, AI Advisor
- Active state: Top accent bar, scaled icon, primary color
- Hover: Background tint, color change

**Side Menu**
- Width: 300px (mobile), 320px (desktop)
- Slide animation from left
- Overlay: Semi-transparent dark with blur
- Items: Icon + text, left accent bar on hover

### Hero Section
- Background: Hero gradient (3-color)
- Padding: 3rem 1.5rem
- Border radius: 2XL (32px)
- Floating orb animation (background)
- Text: White with text shadow
- CTAs: Primary + secondary buttons side-by-side

### Feature Cards
- Grid: 1 col (mobile), 2 cols (tablet), 3 cols (desktop)
- Large icon with float animation
- Gradient overlay on hover (3% opacity)
- Lift 8px + scale 1.02 on hover
- Icon: 3.5rem, with drop shadow

---

## 📱 Responsive Breakpoints

```css
/* Mobile First (Default) */
< 640px: Mobile phones

/* Tablet */
640px - 1023px: Tablets, large phones

/* Desktop */
1024px+: Desktop, laptops

/* Large Desktop */
1280px+: Large screens
```

### Responsive Typography
Font size increases slightly at each breakpoint:
- Mobile: 16px base
- Tablet: 17px base
- Desktop: 18px base

---

## ♿ Accessibility Standards

### Focus States
```css
:focus-visible {
    outline: 3px solid var(--brand-accent);
    outline-offset: 3px;
    border-radius: var(--radius-sm);
}
```

### Color Contrast
- Text on backgrounds: Minimum 4.5:1 (WCAG AA)
- Large text: Minimum 3:1
- Interactive elements: Minimum 3:1

### Touch Targets
- Minimum size: 48x48px
- Spacing between targets: Minimum 8px

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 🌙 Dark Mode Support

Automatic color scheme switching:

```css
@media (prefers-color-scheme: dark) {
    --bg-primary: #0F172A;
    --bg-card: #1E293B;
    --text-primary: #F1F5F9;
    --text-secondary: #CBD5E1;
    --border-light: #334155;
}
```

---

## 🎯 Usage Examples

### Hero Section
```html
<section class="hero">
    <div class="hero-text">
        <h2>Welcome to DiabetCare AI</h2>
        <p>AI-powered diabetes management</p>
        <div class="cta-buttons">
            <a href="#" class="btn btn-primary">Get Started</a>
            <button class="btn btn-secondary">Learn More</button>
        </div>
    </div>
</section>
```

### Feature Card
```html
<div class="feature-card">
    <div class="feature-icon">📊</div>
    <h3>Glucose Tracking</h3>
    <p>Monitor blood glucose with intelligent analysis</p>
</div>
```

### Stat Card
```html
<div class="stat-card">
    <div class="stat-label">Latest Glucose</div>
    <div class="stat-value">126 mg/dL</div>
    <div class="stat-indicator normal">✓ Within target</div>
</div>
```

---

## 🚀 Performance Guidelines

### Optimization Rules
1. Use CSS custom properties for consistency
2. Leverage GPU acceleration (transform, opacity)
3. Avoid animating expensive properties (width, height, top, left)
4. Use `will-change` sparingly for known animations
5. Optimize images (WebP format, proper sizing)
6. Lazy load off-screen images
7. Minimize shadow complexity on mobile

### Loading Strategy
1. Critical CSS inline
2. Non-critical CSS async
3. Fonts with `font-display: swap`
4. Progressive image loading

---

## 📐 Grid System

### Feature Grid
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Gap: 1.5rem (24px)

### Stat Cards
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Gap: 1rem (16px)

### Action Grid
- Mobile: 2 columns
- Desktop: 4 columns
- Gap: 1rem (16px)

---

## ✅ Design Checklist

### Every Component Should Have:
- [ ] Proper spacing (using spacing scale)
- [ ] Appropriate border radius
- [ ] Correct shadow elevation
- [ ] Smooth transitions (250ms default)
- [ ] Hover states
- [ ] Focus states (accessibility)
- [ ] Active states
- [ ] Loading states (where applicable)
- [ ] Error states (forms)
- [ ] Responsive behavior
- [ ] Color contrast compliance
- [ ] Touch-friendly sizing (48x48px minimum)

---

## 🎨 Brand Voice

**Tone:** Professional yet approachable, confident yet caring
**Style:** Clear, concise, empowering
**Language:** Medical accuracy with patient-friendly explanations

### Do's
✅ Use active voice
✅ Be encouraging and positive
✅ Provide clear, actionable guidance
✅ Respect user intelligence
✅ Use inclusive language

### Don'ts
❌ Use medical jargon without explanation
❌ Create alarm or fear
❌ Make absolute promises
❌ Use condescending language
❌ Oversimplify critical health information

---

## 📚 Resources

### Design Tools
- Figma (recommended for design)
- Chrome DevTools (inspect and test)
- Lighthouse (accessibility and performance)

### Color Tools
- https://coolors.co/ (palette generator)
- https://contrast-ratio.com/ (contrast checker)

### Icon Resources
- Emoji (current implementation)
- Future: Custom icon set or Heroicons

---

## 🔄 Version History

**v1.0 - Premium Design System**
- Initial release
- Brand colors defined
- Component library established
- Accessibility standards implemented
- Responsive design system
- Glass-morphism effects
- Animation library

---

## 📞 Support

For design questions or clarification on brand guidelines:
- Review this document
- Check component examples in HTML files
- Inspect premium-wireframe.css for implementation details

**Last Updated:** January 25, 2026
**Design System Version:** 1.0
**Status:** ✅ Production Ready

# Ghost Project Reviver - Design System

## 🎨 Brand Identity

**Platform Name:** Project Phoenix (Ghost Project Reviver)

**Tagline:** "Revive the code that matters"

**Brand Personality:**
- Professional yet approachable
- Tech-forward and modern
- Community-driven
- Empowering

---

## 🌈 Color Palette

### Primary Colors
```css
--phoenix-dark: #0a0e27;        /* Deep navy - main background */
--phoenix-darker: #050812;      /* Darker navy - card backgrounds */
--phoenix-primary: #6366f1;     /* Indigo - primary actions */
--phoenix-primary-light: #818cf8; /* Light indigo - hover states */
--phoenix-accent: #f59e0b;      /* Amber - accents, highlights */
--phoenix-success: #10b981;     /* Green - positive actions */
--phoenix-danger: #ef4444;      /* Red - warnings, abandoned repos */
--phoenix-warning: #f59e0b;     /* Amber - at-risk repos */
```

### Semantic Colors
```css
--status-active: #10b981;       /* Green */
--status-at-risk: #f59e0b;      /* Amber */
--status-abandoned: #ef4444;    /* Red */
--status-reviving: #6366f1;     /* Indigo */
```

### Neutral Colors
```css
--text-primary: #f9fafb;        /* Almost white */
--text-secondary: #d1d5db;      /* Light gray */
--text-muted: #9ca3af;          /* Muted gray */
--border: rgba(255, 255, 255, 0.1);
--border-hover: rgba(255, 255, 255, 0.2);
```

### Gradients
```css
--gradient-hero: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #f59e0b 100%);
--gradient-card: linear-gradient(145deg, rgba(99, 102, 241, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
--gradient-status: linear-gradient(90deg, #10b981 0%, #6366f1 50%, #f59e0b 100%);
```

---

## ✍️ Typography

### Font Families
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Fira Code', 'JetBrains Mono', 'Courier New', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 🧩 Component Designs

### 1. Repository Card

**Purpose:** Display repository in browse/search views

**Visual Design:**
- Dark card with subtle gradient background
- Glassmorphism effect with backdrop blur
- Hover: Lift effect with shadow
- Status badge in top-right corner
- Tech stack icons at bottom
- Maintenance score as circular progress indicator

**Structure:**
```
┌─────────────────────────────────┐
│ [Status Badge]    [★ Stars]     │
│                                 │
│ Repository Name                 │
│ Brief description...            │
│                                 │
│ [●●●○○] Maintenance Score: 65%  │
│                                 │
│ [JS] [React] [Node]   Updated:  │
│                       2 days ago│
│                                 │
│ [Join Revival Squad →]          │
└─────────────────────────────────┘
```

### 2. Revival Squad Panel

**Purpose:** Show team members working on a repo revival

**Visual Design:**
- Sidebar or section on repo detail page
- Avatar grid of squad members
- Role badges (Lead, Frontend, Backend, Docs, QA)
- "Join Squad" CTA button with gradient
- Member count badge

**Structure:**
```
┌─────────────────────────────┐
│ Revival Squad (12 members)  │
│                             │
│ [Avatar] Jane (Lead)        │
│ [Avatar] John (Frontend)    │
│ [Avatar] Alex (Backend)     │
│ ...                         │
│                             │
│ [+ Join This Squad]         │
└─────────────────────────────┘
```

### 3. Maintenance Score Indicator

**Purpose:** Visual representation of difficulty score

**Visual Design:**
- Circular progress ring
- Color changes based on score:
  - 70-100: Green (Easy to maintain)
  - 40-69: Amber (Moderate difficulty)
  - 0-39: Red (High difficulty)
- Animated on page load
- Shows breakdown on hover/click

**Animation:**
```css
@keyframes scoreRingFill {
  from { stroke-dashoffset: circleLength; }
  to { stroke-dashoffset: calculatedOffset; }
}
```

### 4. Status Badge

**Design:**
```html
<!-- Active -->
<span class="badge badge-active">
  ● Active
</span>

<!-- At Risk -->
<span class="badge badge-warning">
  ⚠ At Risk
</span>

<!-- Abandoned -->
<span class="badge badge-danger">
  💀 Abandoned
</span>

<!-- Being Revived -->
<span class="badge badge-reviving">
  🔥 Reviving
</span>
```

**Style:**
- Pill-shaped
- Slightly transparent background with blur
- Icon + text
- Glow effect matching the status color

---

## 🎬 Animations & Interactions

### Card Hover Effects
```css
.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3);
}
```

### Button Interactions
```css
.btn-primary {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-primary:hover::before {
  width: 300px;
  height: 300px;
}
```

### Page Transitions
- Fade in on mount
- Staggered animations for lists
- Skeleton loaders during data fetch

---

## 📱 Responsive Breakpoints

```css
--mobile: 640px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;
--ultra: 1536px;
```

---

## 🏗️ Layout Structure

### Landing Page
```
┌─────────────────────────────────────┐
│        [Logo]    [Sign in]          │
├─────────────────────────────────────┤
│                                     │
│         HERO SECTION                │
│     "Revive the code that matters"  │
│                                     │
│     [Get Started with GitHub →]     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      FEATURED REPOS (3 cards)       │
│                                     │
├─────────────────────────────────────┤
│                                     │
│         HOW IT WORKS                │
│   [1.Discover] [2.Join] [3.Revive]  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│        STATS & SOCIAL PROOF         │
│                                     │
└─────────────────────────────────────┘
```

### Dashboard Layout
```
┌─────────────────────────────────────┐
│  [Logo]  Explore  My Squads  [User] │
├─────────────────────────────────────┤
│                                     │
│  Sidebar           Main Content     │
│  ┌────────┐       ┌──────────────┐  │
│  │Filters │       │  Repo Cards  │  │
│  │        │       │              │  │
│  │Language│       │  [Card 1]    │  │
│  │Status  │       │  [Card 2]    │  │
│  │Score   │       │  [Card 3]    │  │
│  └────────┘       └──────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎯 Key UI Patterns

### Glassmorphism Cards
```css
background: rgba(10, 14, 39, 0.7);
backdrop-filter: blur(10px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 12px;
```

### Gradient Text
```css
background: linear-gradient(135deg, #6366f1, #f59e0b);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Neumorphism Buttons (Subtle)
```css
box-shadow: 
  8px 8px 16px rgba(0, 0, 0, 0.4),
  -8px -8px 16px rgba(255, 255, 255, 0.05);
```

---

## ♿ Accessibility

- Maintain 4.5:1 contrast ratio for text
- All interactive elements have focus states
- Keyboard navigation supported
- ARIA labels for screen readers
- Reduced motion preference respected

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📊 Data Visualization

### Maintenance Score Breakdown
- Radar chart for multi-dimensional scoring
- Color-coded bar charts for each metric
- Tooltips with explanations

### Activity Timeline
- Vertical timeline with icons
- Color-coded by event type
- Relative timestamps ("2 days ago")

---

This design system will ensure a consistent, premium, and engaging user experience across the entire platform.

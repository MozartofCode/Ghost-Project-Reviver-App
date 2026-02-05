# Ticket #2: Redesign Project Cards (Organic Theme)

**Priority**: P1 (High - Quick Win)  
**Status**: Ready for Implementation  
**Estimated Effort**: 2-3 hours

## 📋 Overview
Redesign the repository/project cards throughout the app to use the organic/forest theme from the landing page. Ensure excellent contrast and readability (no illegible white text on light backgrounds).

## 🎯 Requirements
- Apply organic/forest theme colors to all project cards
- Ensure high contrast for all text (use dark forest colors for text on light backgrounds)
- Maintain rounded, organic aesthetic (soft corners, natural shapes)
- Update cards on: Landing page, Explore page, Dashboard
- Consistent styling across all views

## 🎨 Design Specifications

### Color Palette (from existing theme)
```css
/* Backgrounds */
--card-bg: #F8FAF5 (cream/light mint)
--card-hover-bg: #EEF5E8 (slightly darker mint)

/* Text - DARK for readability */
--text-primary: #1A4D2E (forest-800/900)
--text-secondary: #2D5F3F (forest-600)
--text-muted: #567568 (forest-500)

/* Accents */
--accent-border: #C8E6C9 (mint-200/forest-100)
--status-bg: rgba(42, 157, 143, 0.1) (mint with opacity)

/* Shadows */
--shadow-organic: 0 4px 20px rgba(26, 77, 46, 0.08)
```

### Typography
- Card title: `text-2xl font-bold text-forest-900`
- Description: `text-forest-600`
- Metadata: `text-sm text-forest-500`
- Labels/badges: Dark text on light/colored backgrounds

## 🔧 Technical Approach

### Phase 1: Update Global Styles
- [ ] **Verify**: `/app/globals.css` has organic theme variables
  - Ensure forest colors are properly defined
  - Add any missing color variables
  
### Phase 2: Update Card Components
- [ ] **Update**: `/app/page.tsx` - Landing page featured repos cards
  - Replace `bg-white` with `bg-cream` or `bg-mint-50`
  - Change text colors to dark forest colors
  - Update hover effects: `hover:bg-mint-100`
  - Ensure maintenance score bar uses forest colors
  - Status badges: dark text on colored backgrounds
  
- [ ] **Update**: `/components/repository/repo-card.tsx`
  - Apply same organic styling
  - Card container: `bg-cream border-2 border-forest-100`
  - Hover state: `hover:bg-mint-50 hover:border-forest-200`
  - Shadow: `shadow-organic hover:shadow-organic-hover`
  - Icon backgrounds: `bg-mint-100` with `text-forest-700`
  
- [ ] **Update**: `/app/explore/page.tsx`
  - Apply organic theme to repository grid
  - Ensure search/filter cards match theme
  - Empty state styling

- [ ] **Update**: `/app/dashboard/page.tsx`
  - User info cards with organic theme
  - Stats cards with proper contrast
  - CTA cards matching the style

### Phase 3: Specific Element Updates

#### Card Structure
```typescript
<Card className="
  bg-cream 
  border-2 border-forest-100 
  rounded-2xl 
  shadow-organic 
  hover:shadow-organic-hover 
  hover:bg-mint-50 
  hover:border-forest-200
  transition-all duration-300
  group
">
```

#### Icon Containers
```typescript
<div className="
  p-3 
  bg-mint-100 
  rounded-xl 
  group-hover:bg-mint-200 
  transition-colors
">
  <Icon className="w-6 h-6 text-forest-700" />
</div>
```

#### Status Badges
```typescript
// For "active/reviving" status
<span className="
  px-3 py-1 
  bg-mint-200 
  text-forest-800 
  rounded-full 
  text-xs font-bold
">
  Sprouting
</span>

// For "abandoned" status  
<span className="
  px-3 py-1 
  bg-red-100 
  text-red-700 
  rounded-full 
  text-xs font-bold
">
  Withered
</span>
```

#### Progress Bars (Maintenance Score)
```typescript
<div className="w-full bg-forest-100 rounded-full h-2">
  <div 
    className="bg-forest-600 h-2 rounded-full"
    style={{ width: `${score}%` }}
  />
</div>
```

### Phase 4: Button Styling
- [ ] Update action buttons on cards:
  - Primary: `bg-forest-700 hover:bg-forest-800 text-white`
  - Secondary: `bg-forest-50 hover:bg-forest-100 text-forest-700 border border-forest-200`

### Phase 5: Verify Contrast Ratios
- [ ] Test all color combinations for WCAG AA compliance
  - Dark forest text on cream backgrounds: ✅ High contrast
  - White text on forest-700+ backgrounds: ✅ High contrast
  - Avoid: White or very light text on mint/cream backgrounds

## ✅ Verification Steps
1. **Landing Page**:
   - View featured projects section
   - Cards should have cream/mint background
   - All text should be clearly readable (dark forest colors)
   - Hover effects should transition smoothly

2. **Explore Page**:
   - Browse repository grid
   - All cards match organic theme
   - Search/filter inputs styled consistently
   - Empty states use organic colors

3. **Dashboard**:
   - User cards match theme
   - Stats cards readable and aesthetic
   - No illegible text anywhere

4. **Contrast Check**:
   - Take screenshots and run through contrast checker
   - All text should meet WCAG AA standard (4.5:1 ratio minimum)

## 📂 Files to Modify
- `/app/page.tsx` (landing page cards)
- `/components/repository/repo-card.tsx` (main card component)
- `/app/explore/page.tsx` (repository grid)
- `/app/dashboard/page.tsx` (dashboard cards)
- `/app/globals.css` (if additional CSS variables needed)
- `/tailwind.config.ts` (verify forest/mint colors are defined)

## 🎨 Design References
- **Good Contrast**: Dark forest green text (#1A4D2E) on cream (#F8FAF5)
- **Avoid**: White (#FFFFFF) on mint (#A7F3D0) - poor contrast
- **Badges**: Colored backgrounds with dark text for clarity
- **Shadows**: Subtle, organic shadows (not harsh black)

## 📝 Notes
- Maintain existing card structure/layout
- Only update colors and styling
- Test in both light and dark room environments
- Consider adding subtle animations (grow on hover, etc.)
- Keep accessibility in mind (screen readers should still work)

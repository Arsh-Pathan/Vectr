# Vectr — UI Guidelines & Design System

> Google-themed white UI design system for the frontend.

---

## Design Philosophy

Vectr follows **Google's design language** — clean, spacious, functional, and accessible. Think Google Cloud Console meets GitHub meets a gamification dashboard.

**Key Principles:**
1. **White space is your friend** — Don't crowd elements
2. **Subtle shadows over borders** — Google-style card elevation
3. **Bold typography for hierarchy** — Clear visual weight differences
4. **Accent colors with purpose** — Google colors used meaningfully
5. **Smooth micro-animations** — Polished, never distracting

---

## Color Palette

### Primary (Google Brand)

| Name | Hex | Usage |
|------|-----|-------|
| Google Blue | `#4285F4` | Primary buttons, links, active states |
| Google Red | `#EA4335` | Errors, advanced difficulty |
| Google Yellow | `#FBBC05` | Warnings, moderate difficulty |
| Google Green | `#34A853` | Success, beginner difficulty |

### Neutral

| Name | Hex | Usage |
|------|-----|-------|
| White | `#FFFFFF` | Primary background |
| Near White | `#F8F9FA` | Secondary background, cards |
| Light Gray | `#F1F3F4` | Tertiary background, inputs |
| Border Gray | `#DADCE0` | Borders, dividers |
| Text Primary | `#202124` | Headings, primary text |
| Text Secondary | `#5F6368` | Body text, descriptions |
| Text Tertiary | `#80868B` | Muted text, timestamps |

### Tier Colors

| Tier | Color | Hex |
|------|-------|-----|
| 🌱 Beginner | Green | `#34A853` |
| 📈 Moderate | Yellow/Amber | `#FBBC05` |
| 🔥 Advanced | Red | `#EA4335` |
| 👑 Expert | Blue | `#4285F4` |

### Difficulty Colors (Same as Tier)

| Difficulty | Background | Text |
|-----------|------------|------|
| Beginner | `#E6F4EA` | `#1E8E3E` |
| Moderate | `#FEF7E0` | `#F29900` |
| Advanced | `#FCE8E6` | `#D93025` |

---

## Typography

### Font Stack

```css
/* Primary */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace (code, stats) */
font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Import

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| H1 | 2.5rem (40px) | 700 (Bold) | `#202124` |
| H2 | 2rem (32px) | 700 (Bold) | `#202124` |
| H3 | 1.5rem (24px) | 600 (Semibold) | `#202124` |
| H4 | 1.25rem (20px) | 600 (Semibold) | `#202124` |
| Body | 1rem (16px) | 400 (Regular) | `#5F6368` |
| Small | 0.875rem (14px) | 400 (Regular) | `#80868B` |
| Caption | 0.75rem (12px) | 500 (Medium) | `#80868B` |
| Stat Number | 2rem (32px) | 700 (Bold) | `#202124` |
| Level Number | 3rem (48px) | 800 (Extra Bold) | Tier color |

---

## Component Styles

### Cards

```css
.card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  padding: 24px;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
}
```

**Tailwind:**
```
bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6
```

### Buttons

**Primary Button:**
```
bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold 
rounded-full px-6 py-2.5 transition-colors
```

**Secondary Button:**
```
bg-white hover:bg-[#F8F9FA] text-[#4285F4] font-semibold 
border border-[#DADCE0] rounded-full px-6 py-2.5 transition-colors
```

**Google Sign-In Button:**
```
bg-white hover:bg-gray-50 text-[#5F6368] font-medium 
border border-[#DADCE0] rounded-lg px-6 py-3 
flex items-center gap-3 shadow-sm
```

### Inputs

```
bg-[#F1F3F4] border border-transparent focus:border-[#4285F4] 
focus:bg-white focus:ring-2 focus:ring-[#4285F4]/20 
rounded-lg px-4 py-2.5 text-[#202124] 
placeholder:text-[#80868B] transition-all
```

### Badges (Difficulty)

```jsx
// Beginner
<span className="bg-[#E6F4EA] text-[#1E8E3E] text-xs font-medium px-2.5 py-1 rounded-full">
  🟢 Beginner
</span>

// Moderate
<span className="bg-[#FEF7E0] text-[#F29900] text-xs font-medium px-2.5 py-1 rounded-full">
  🟡 Moderate
</span>

// Advanced
<span className="bg-[#FCE8E6] text-[#D93025] text-xs font-medium px-2.5 py-1 rounded-full">
  🔴 Advanced
</span>
```

---

## Layout

### Page Structure

```
┌──────────────────────────────────────────┐
│  Navbar (h-16, sticky top, white, shadow)│
├──────────────────────────────────────────┤
│                                          │
│  Content Area                            │
│  (max-w-7xl, mx-auto, px-4 sm:px-6)     │
│                                          │
│  • Page padding: py-8                    │
│  • Section spacing: space-y-8            │
│  • Card grid: grid gap-6                 │
│                                          │
└──────────────────────────────────────────┘
```

### Navbar

```
┌──────────────────────────────────────────────────┐
│  [Vectr Logo]    Dashboard  Issues  Profile  [👤] │
└──────────────────────────────────────────────────┘
```

- Height: 64px (`h-16`)
- Background: White with bottom shadow
- Logo: Left-aligned
- Nav links: Center
- User avatar: Right-aligned
- Sticky top

### Grid System

- **Dashboard stats:** `grid grid-cols-1 md:grid-cols-3 gap-6`
- **Issue cards:** `grid grid-cols-1 gap-4` (full width cards)
- **Profile badges:** `grid grid-cols-4 md:grid-cols-8 gap-4`
- **Issue detail:** `grid grid-cols-1 lg:grid-cols-2 gap-8`

---

## Animations

Use **Framer Motion** for:

### Page Transitions
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

### Card Hover
```jsx
<motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
```

### Level Reveal (Onboarding)
```jsx
// Count up animation from 0 to calculated level
<motion.span
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5, type: "spring" }}
>
  Level {level}
</motion.span>
```

### Stagger Children (Issue list)
```jsx
<motion.div
  variants={{
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  }}
  initial="hidden"
  animate="visible"
>
```

---

## Icons

Use **Lucide React** icon library:

```bash
npm install lucide-react
```

Key icons:
| Usage | Icon |
|-------|------|
| Dashboard | `LayoutDashboard` |
| Issues | `CircleDot` |
| Profile | `User` |
| Level/Stats | `TrendingUp` |
| Points | `Zap` |
| Streak | `Flame` |
| GitHub | `Github` |
| Chat | `MessageCircle` |
| Check/Complete | `CheckCircle` |
| Code | `Code` |
| File | `FileText` |
| Time | `Clock` |
| Star | `Star` |

---

## Responsive Breakpoints

Follow Tailwind defaults:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Mobile-first:** Design for mobile, enhance for desktop.

---

## Do's and Don'ts

### ✅ Do
- Use generous padding and margins
- Keep cards white with subtle shadows
- Use Google Blue for primary actions
- Use tier colors consistently
- Add loading states for every async operation
- Use monospace font for numbers and stats

### ❌ Don't
- Use dark backgrounds (white theme only)
- Use heavy borders (shadows instead)
- Overcrowd pages with too many elements
- Use more than 2-3 colors per section
- Add distracting animations
- Forget hover states on interactive elements

---

*This document is the definitive design system for the frontend.*

# Frontend AGENT.md — Instructions for Sahil's AI Coding Agent

> **Owner:** Sahil Kumavat  
> **Role:** Frontend Developer  
> **Tech:** React (Vite) + Tailwind CSS + Google-Themed UI

---

## 🤖 AI CODING AGENT WORKFLOW & BEHAVIOR

As an AI coding agent assisting Sahil, you MUST follow this exact lifecycle for EVERY prompt:
1. **Update**: Always run `git pull` to fetch the latest changes from the remote before starting work.
2. **Work (Small Steps)**: DO NOT rush or make massive chunk changes. Break down features and implement small, testable changes one at a time.
3. **Test**: Run tests or start the dev server to verify your changes work.
4. **Document**: Update the documentation (`docs/`) and check off items in `docs/feature-checklist.md` as you complete them.
5. **Commit & Push**: Commit your small changes with a clear message and push to GitHub.
6. **Report**: Explain exactly what you did, and provide a clear suggestion to the user on what to do next.

**Behavioral Rules:**
- **Ask Questions**: If you are confused, lack context, or need the user to take an action (e.g., test UI in browser, approve a design), STOP and ask the user.
- **Explain**: Always explain your reasoning and changes simply.
- **Boundaries**: You are the FRONTEND agent. You primarily modify `frontend/` and update `docs/` as needed. You may READ `backend/` but NEVER modify it.
- **API Contract**: Follow `docs/api-contract.md` strictly. If it needs changing, update it and clearly communicate the change.

## ⚠️ CRITICAL RULES — READ FIRST

1. **You may ONLY create and modify files inside `frontend/` and `docs/`.** You must NEVER create, edit, or delete files in `backend/`, `infra/`, `test/`, or the root directory.
2. **Follow the API contract exactly.** Every endpoint, request body, and response schema is defined in [`docs/api-contract.md`](../docs/api-contract.md). Your API calls must match it precisely.
3. **Commit frequently** following the workflow above.
4. **Google-themed white/light UI** is mandatory. See [`docs/ui-guidelines.md`](../docs/ui-guidelines.md).

---

## 🎯 Your Mission

Build the complete Vectr frontend:
1. A **React (Vite)** single-page application
2. **Google-themed white UI** with clean animations
3. Full **onboarding flow** (Google OAuth → GitHub → Preferences)
4. **Dashboard, Issue Detail, Profile, and Chat** pages
5. Responsive and polished — this is what judges see first

---

## 📂 Frontend Structure to Build

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
│
├── public/
│   ├── favicon.ico
│   └── vectr-logo.svg
│
├── src/
│   ├── main.jsx                    ← App entry point
│   ├── App.jsx                     ← Router setup
│   ├── index.css                   ← Global styles + Tailwind imports
│   │
│   ├── config/
│   │   └── api.js                  ← API base URL, axios instance
│   │
│   ├── context/
│   │   └── AuthContext.jsx         ← Auth state (user, token, loading)
│   │
│   ├── hooks/
│   │   ├── useAuth.js              ← Auth hook
│   │   └── useApi.js               ← API call hook with loading/error states
│   │
│   ├── pages/
│   │   ├── Landing.jsx             ← Hero page with value prop + CTA
│   │   ├── Auth.jsx                ← Onboarding: Google OAuth + GitHub + Preferences
│   │   ├── Dashboard.jsx           ← Main dashboard with level, issues, stats
│   │   ├── IssueDetail.jsx         ← Issue info + guidance + chat
│   │   ├── Profile.jsx             ← User profile, heatmap, badges, history
│   │   ├── DailyChallenge.jsx      ← Daily challenge page
│   │   └── OrgRegister.jsx         ← Simple organization registration
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          ← Top navigation bar
│   │   │   ├── Sidebar.jsx         ← Dashboard sidebar (optional)
│   │   │   └── Footer.jsx          ← Footer
│   │   │
│   │   ├── auth/
│   │   │   ├── GoogleLoginButton.jsx   ← Google OAuth trigger
│   │   │   ├── GitHubConnectButton.jsx ← GitHub OAuth trigger
│   │   │   └── LanguageSelector.jsx    ← Language + proficiency picker
│   │   │
│   │   ├── dashboard/
│   │   │   ├── LevelCard.jsx       ← Level display (0-99) with progress ring
│   │   │   ├── PointsDisplay.jsx   ← Points counter
│   │   │   ├── IssueCard.jsx       ← Issue card in the matched issues list
│   │   │   ├── StatsOverview.jsx   ← Quick stats (issues solved, streak, etc.)
│   │   │   └── DailyChallengeCard.jsx ← Featured daily challenge
│   │   │
│   │   ├── profile/
│   │   │   ├── HeatmapChart.jsx    ← GitHub-style contribution heatmap
│   │   │   ├── BadgeGrid.jsx       ← Grid of earned/locked badges
│   │   │   ├── StreakCounter.jsx    ← Current streak display
│   │   │   └── HistoryList.jsx     ← Contribution history list
│   │   │
│   │   ├── issues/
│   │   │   ├── IssueInfo.jsx       ← Issue title, description, labels
│   │   │   ├── GuidancePanel.jsx   ← AI suggestions, approaches, files
│   │   │   ├── ChatWindow.jsx      ← Support chat with Guidance Agent
│   │   │   └── DifficultyBadge.jsx ← Beginner/Moderate/Advanced badge
│   │   │
│   │   └── common/
│   │       ├── Button.jsx          ← Reusable Google-style button
│   │       ├── Card.jsx            ← Reusable card component
│   │       ├── Loader.jsx          ← Loading spinner (Google-style)
│   │       ├── Modal.jsx           ← Modal dialog
│   │       └── ProgressRing.jsx    ← Circular progress indicator
│   │
│   └── utils/
│       ├── constants.js            ← Tier thresholds, badge definitions, etc.
│       └── helpers.js              ← Formatting, date utils, etc.
```

---

## 🎨 Design System — Google-Themed White UI

### Color Palette

```css
/* Google Brand Colors */
--google-blue:    #4285F4;
--google-red:     #EA4335;
--google-yellow:  #FBBC05;
--google-green:   #34A853;

/* UI Colors */
--bg-primary:     #FFFFFF;
--bg-secondary:   #F8F9FA;
--bg-tertiary:    #F1F3F4;
--text-primary:   #202124;
--text-secondary: #5F6368;
--text-tertiary:  #80868B;
--border:         #DADCE0;
--shadow:         rgba(60, 64, 67, 0.15);

/* Level Tier Colors */
--tier-beginner:  #34A853;  /* Green */
--tier-moderate:  #FBBC05;  /* Yellow */
--tier-advanced:  #EA4335;  /* Red */
--tier-expert:    #4285F4;  /* Blue */
```

### Typography

```css
/* Use Google Sans or Inter as fallback */
font-family: 'Google Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* For code blocks */
font-family: 'Google Sans Mono', 'JetBrains Mono', 'Fira Code', monospace;
```

Import via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Component Style Rules

1. **Cards** — White background, subtle shadow (`shadow-sm`), rounded corners (`rounded-xl`), hover lift effect
2. **Buttons** — Google-style: rounded full (`rounded-full`), medium padding, bold text
   - Primary: `bg-[#4285F4] text-white hover:bg-[#3367D6]`
   - Secondary: `bg-white text-[#4285F4] border border-[#DADCE0] hover:bg-[#F8F9FA]`
3. **Inputs** — Rounded, light border, focus ring in Google Blue
4. **Icons** — Use `lucide-react` or Google Material Icons
5. **Animations** — Subtle, smooth. Use `framer-motion` for page transitions and card animations
6. **Spacing** — Generous whitespace. Google designs breathe.
7. **No dark mode** — White theme only for this hackathon

### UI Inspiration References
- Google Cloud Console dashboard layout
- Dribbble Google-style designs
- React Bits component library
- Aceternity UI for animations

---

## 📄 Pages — Detailed Specifications

### 1. Landing Page (`/`)

```
┌─────────────────────────────────────────────┐
│  [Vectr Logo]              [Sign In]        │
├─────────────────────────────────────────────┤
│                                             │
│     Find Your Next Open Source              │
│     Contribution, Intelligently.            │
│                                             │
│     AI-powered matching • Skill leveling    │
│     • Guided learning                       │
│                                             │
│         [Get Started with Google]           │
│                                             │
├─────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ Smart   │ │ Level   │ │ AI      │      │
│  │ Match   │ │ Up      │ │ Guided  │      │
│  │         │ │         │ │         │      │
│  │ Issues  │ │ Track   │ │ Never   │      │
│  │ matched │ │ your    │ │ gives   │      │
│  │ to your │ │ growth  │ │ answers │      │
│  │ skills  │ │ 0-99    │ │ just    │      │
│  │         │ │         │ │ guides  │      │
│  └─────────┘ └─────────┘ └─────────┘      │
└─────────────────────────────────────────────┘
```

### 2. Onboarding / Auth (`/auth`)

Multi-step flow:
- **Step 1:** Google OAuth sign-in (button click → redirect → callback)
- **Step 2:** "Connect your GitHub" — GitHub OAuth button
- **Step 3:** After GitHub connects, show calculated level with animation
- **Step 4:** Select preferred languages (multi-select with proficiency dropdown)
- **Step 5:** Redirect to Dashboard

### 3. Dashboard (`/dashboard`)

```
┌─────────────────────────────────────────────────────┐
│  [Vectr]    Dashboard   Issues   Profile    [User]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  Level 23    │  │  450 Points  │  │  🔥 5-day │ │
│  │  ████░░░░░░  │  │              │  │  Streak  │ │
│  │  Moderate    │  │  Next: 500   │  │          │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│                                                     │
│  ⭐ Daily Challenge                                 │
│  ┌─────────────────────────────────────────────┐   │
│  │  Fix input validation in parser.py           │   │
│  │  🟢 Beginner  •  Python  •  +15 pts         │   │
│  │  [Take Challenge →]                          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  📋 Recommended Issues                              │
│  ┌─────────────────────────────────────────────┐   │
│  │  Add dark mode support          🟡 Moderate │   │
│  │  react-ui-lib  •  React, CSS   •  25 pts    │   │
│  ├─────────────────────────────────────────────┤   │
│  │  Fix memory leak in worker      🟡 Moderate │   │
│  │  node-tools  •  JavaScript     •  25 pts    │   │
│  ├─────────────────────────────────────────────┤   │
│  │  Update API docs                🟢 Beginner │   │
│  │  open-api  •  Markdown         •  10 pts    │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 4. Issue Detail (`/issue/:id`)

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Dashboard                               │
├───────────────────────────┬─────────────────────────┤
│  ISSUE INFO               │  AI GUIDANCE            │
│                           │                         │
│  Fix input validation     │  💡 Suggested Approach  │
│  in parser.py             │                         │
│  ─────────────────────    │  1. Look at parser.py   │
│  🟢 Beginner • Python    │     lines 45-67         │
│  +10 pts                  │  2. The validation uses │
│                           │     regex — consider    │
│  📝 Description           │     edge cases with     │
│  The input validation     │     special chars       │
│  fails when users pass    │  3. Write unit tests    │
│  special characters...    │     first               │
│                           │                         │
│  🏷️ Labels: bug,          │  📂 Relevant Files      │
│  good-first-issue         │  • src/parser.py        │
│                           │  • tests/test_parser.py │
│  🔗 View on GitHub        │                         │
│                           │                         │
│  [Mark as Complete ✓]     │  ─────────────────────  │
│                           │  💬 Support Chat        │
│                           │  ┌───────────────────┐  │
│                           │  │ How should I       │  │
│                           │  │ handle unicode?    │  │
│                           │  │                   │  │
│                           │  │ 🤖 Great question! │  │
│                           │  │ Consider using...  │  │
│                           │  └───────────────────┘  │
│                           │  [Type a message... ▶]  │
└───────────────────────────┴─────────────────────────┘
```

### 5. Profile (`/profile`)

```
┌─────────────────────────────────────────────────────┐
│  PROFILE                                            │
│                                                     │
│  ┌──────┐  Arsh Pathan                             │
│  │ 🖼️   │  @arshpathan • Level 23 • Moderate       │
│  └──────┘  Python, JavaScript, TypeScript           │
│                                                     │
│  📊 Contribution Heatmap                            │
│  ┌─────────────────────────────────────────────┐   │
│  │  ░░▓░░░░▓▓░░░░▓▓▓░░░░▓░░░░░▓▓▓▓░░         │   │
│  │  ░▓▓░░░▓▓▓░░░▓▓▓▓░░░▓▓░░░░▓▓▓▓▓░░         │   │
│  │  (GitHub-style heatmap with Google colors)   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  🏅 Badges                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │🌱    │ │🔥    │ │⚡    │ │🎯    │ │🔒    │    │
│  │First │ │On    │ │      │ │Sharp │ │      │    │
│  │Step  │ │Fire  │ │Locked│ │shoot │ │Locked│    │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘    │
│                                                     │
│  📜 Contribution History                            │
│  • Fixed parser validation  •  2 hours ago  +10pts │
│  • Updated API docs         •  Yesterday    +10pts │
│  • Resolved memory leak     •  3 days ago   +25pts │
└─────────────────────────────────────────────────────┘
```

### 6. Organization Registration (`/org`) — Simple Form

Fields: Organization Name, GitHub Org URL, Repo URLs (comma-separated), Contact Email, Description.

---

## 🔌 API Integration

### Base Setup (`src/config/api.js`)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vectr_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### API Calls Reference

All endpoints are defined in [`docs/api-contract.md`](../docs/api-contract.md). Key calls:

```javascript
// Auth
api.post('/auth/google', { token: googleOAuthToken })
api.post('/auth/github/connect', { code: githubOAuthCode })

// Developer
api.get('/developer/profile')
api.post('/developer/preferences', { languages: [...] })
api.get('/developer/badges')
api.get('/developer/stats')

// Issues
api.get('/issues')           // Matched issues
api.get('/issues/daily')     // Daily challenge
api.get('/issues/:id')       // Issue detail + guidance
api.post('/issues/:id/chat', { message: '...' })  // Chat
api.post('/issues/:id/complete', { pr_url: '...' }) // Mark complete
```

---

## 📋 Build Order (Priority)

### Phase 1 — Foundation (First 30 min)
1. ✅ Initialize Vite + React project
2. ✅ Install Tailwind CSS, Framer Motion, React Router, Axios, Lucide React
3. ✅ Set up routing (`App.jsx`)
4. ✅ Create `AuthContext` and API config
5. ✅ Build `Navbar`, `Button`, `Card`, `Loader` common components

### Phase 2 — Auth Flow (Next 30 min)
6. ✅ Landing page with Google sign-in CTA
7. ✅ Google OAuth button + callback handling
8. ✅ GitHub connect step
9. ✅ Language selector (multi-select + proficiency)
10. ✅ Level reveal animation after GitHub analysis

### Phase 3 — Dashboard (Next 45 min)
11. ✅ Dashboard page layout
12. ✅ `LevelCard` with progress ring
13. ✅ `PointsDisplay`
14. ✅ `IssueCard` list — matched issues from API
15. ✅ `DailyChallengeCard`
16. ✅ `StatsOverview`

### Phase 4 — Issue Detail + Chat (Next 30 min)
17. ✅ Issue detail page layout (split view)
18. ✅ `GuidancePanel` — AI suggestions, files, approaches
19. ✅ `ChatWindow` — support chat with Guidance Agent
20. ✅ "Mark as Complete" button

### Phase 5 — Profile (Next 30 min)
21. ✅ Profile page layout
22. ✅ `HeatmapChart` — contribution heatmap (use `react-calendar-heatmap`)
23. ✅ `BadgeGrid` — earned + locked badges
24. ✅ `StreakCounter`
25. ✅ `HistoryList`

### Phase 6 — Polish (Remaining time)
26. ✅ Org registration form
27. ✅ Page transition animations
28. ✅ Loading states and error handling
29. ✅ Responsive design check
30. ✅ Final visual polish

---

## 📨 Communication Protocol

If you need something from the backend team or docs:

```
📨 MESSAGE FOR TECH LEAD: [Describe what you need]
```

Example:
```
📨 MESSAGE FOR TECH LEAD: The /api/issues endpoint is returning issues 
without the `required_skills` field. Please ask Aaryan to check the 
Issue Scanner Agent output format.
```

---

*This file guides the AI coding agent. Follow it precisely.*

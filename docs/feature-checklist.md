# Vectr — Feature Checklist

> Track progress on all features. Updated by the Tech Lead (Arsh).

---

## 🔴 P0 — Must Have (Demo-Critical)

### Backend (Aaryan)
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| B1 | FastAPI app setup + CORS | ✅ | `main.py`, `config.py` |
| B2 | SQLite database + models | ✅ | All models in `models/` |
| B3 | Google OAuth endpoint | ✅ | `POST /api/auth/google` |
| B4 | GitHub OAuth + connect | ✅ | `POST /api/auth/github/connect` |
| B5 | GitHub API service | ✅ | Fetch repos, commits, languages |
| B6 | Profile Agent (ADK) | ✅ | GitHub analysis → level calculation |
| B7 | Issue Scanner Agent (ADK) | ✅ | Scan repos → categorize issues |
| B8 | Matching Engine (SQL/DB) | ✅ | Match developer ↔ issues via DB queries |
| B9 | Guidance Agent (ADK) | ✅ | Support chat, strict anti-jailbreak guardrails |
| B10 | Developer profile endpoint | ✅ | `GET /api/developer/profile` |
| B11 | Developer preferences endpoint | ✅ | `POST /api/developer/preferences` |
| B12 | Issues listing endpoint | ✅ | `GET /api/issues` (matched) |
| B13 | Issue detail + guidance endpoint | ✅ | `GET /api/issues/:id` |
| B14 | Issue chat endpoint | ✅ | `POST /api/issues/:id/chat` |

### Frontend (Sahil)
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| F1 | Vite + React + Tailwind setup | ✅ | Project scaffold |
| F2 | Routing & Auth Context | ✅ | Token management |
| F3 | Common components | ✅ | Button, Card, Loader, Navbar |
| F4 | Landing page | ✅ | Hero, features, CTA |
| F5 | Google/GitHub OAuth flow (UI) | ✅ | Sign-in buttons + callbacks |
| F6 | Language selector | ✅ | Multi-select + proficiency |
| F7 | Dashboard page | ✅ | Level card, matched issues, stats |
| F8 | Issue detail page & Chat | ✅ | Split view: info + guidance + Chat |
| F9 | Google-themed design system | ✅ | Colors, fonts, shadows, spacing |

---

## 🟡 P1 — Should Have (Impressive Demo)
| # | Feature | Owner | Status |
|---|---------|-------|--------|
| P1-1 | Points service & logic | Backend | ✅ |
| P1-2 | Mark issue complete logic | Backend | ✅ |
| P1-3 | 8 Badges with real conditions | Both | ✅ |
| P1-4 | Heatmap stats & Streak tracking| Both | ✅ |
| P1-5 | Daily Challenge generation | Both | ✅ |
| P1-6 | Profile page UI | Frontend| ⬜ |

---

## 🟢 P2 — Nice to Have (Polish / Future Vision)
| # | Feature | Owner | Status | Notes |
|---|---------|-------|--------|-------|
| P2-1 | Org Mentor Agent | Future | ⬜ | Pitch: Agent to help maintainers improve repos based on contributor chat data |
| P2-2 | Organization registration form | Both | ✅ | Simple CRUD for orgs |
| P2-3 | Page transition animations | Sahil | ⬜ | Framer Motion |
| P2-4 | Deploy to cloud | Arsh | ⬜ | Vercel + Railway |

---
*Last Updated: August 30, 2026*

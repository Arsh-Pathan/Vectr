
    # Vectr — System Architecture

> Complete technical architecture for the Vectr platform.

---

## High-Level Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                          VECTR PLATFORM                              │
│                                                                      │
│  ┌────────────────────┐          ┌─────────────────────────────┐    │
│  │   REACT FRONTEND   │◄────────►│    FASTAPI BACKEND          │    │
│  │                    │  REST    │                             │    │
│  │  • Google Theme    │  API    │  • Auth (Google + GitHub)    │    │
│  │  • Dashboard       │         │  • Developer APIs           │    │
│  │  • Issue Detail    │         │  • Issue APIs               │    │
│  │  • Chat UI         │         │  • Organization APIs        │    │
│  └────────────────────┘         └──────────┬──────────────────┘    │
│                                             │                       │
│                                             ▼                       │
│                          ┌──────────────────────────────┐          │
│                          │     ADK AGENT SYSTEM          │          │
│                          │                               │          │
│                          │  ┌──────────┐ ┌───────────┐  │          │
│                          │  │ Profile  │ │  Issue     │  │          │
│                          │  │ Agent    │ │  Scanner   │  │          │
│                          │  └────┬─────┘ └─────┬─────┘  │          │
│                          │       │             │         │          │
│                          │       ▼             ▼         │          │
│                          │  ┌──────────────────────┐    │          │
│                          │  │ Matching Engine (DB) │    │          │
│                          │  │ (Fast SQL Queries)   │    │          │
│                          │  └──────────────────────┘    │          │
│                          │                               │          │
│                          │  ┌──────────────────────┐    │          │
│                          │  │   Guidance Agent     │    │          │
│                          │  │   (Support Chat)     │    │          │
│                          │  └──────────────────────┘    │          │
│                          └──────────────────────────────┘          │
│                                             │                       │
│                              ┌──────────────┼──────────────┐       │
│                              ▼              ▼              ▼       │
│                       ┌──────────┐  ┌────────────┐  ┌──────────┐  │
│                       │  SQLite  │  │ GitHub API │  │ Gemini   │  │
│                       │  Database│  │            │  │ API      │  │
│                       └──────────┘  └────────────┘  └──────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Frontend (React + Vite)
- **Framework**: React 18 with Vite
- **Theme**: Google-themed white UI (Tailwind CSS)
- **Pages**: Landing, Auth/Onboarding, Dashboard, Issue Detail, Profile.

### 2. Backend (Python FastAPI)
- **Framework**: FastAPI
- **Database**: SQLite via SQLAlchemy
- **Auth**: `authlib` (Google/GitHub)

### 3. Core Architecture: 3 Agents + 1 DB Engine

**Why DB Matching?** Using an LLM to match developer levels with issue difficulties wastes tokens and latency. Instead:
1. **Profile Agent (AI)** extracts developer level (0-99) and languages.
2. **Issue Scanner (AI)** extracts issue difficulty (1-100) and required skills.
3. **Matching Engine (SQL)** does a highly efficient database query linking the two.
4. **Guidance Agent (AI)** helps the user solve the issue without revealing code (with strict anti-jailbreak prompts).

### 4. External Services
- Google OAuth (User creation)
- GitHub OAuth & REST API (Profile data fetching)
- Google Gemini API & ADK (Agent operations)

---

## Git Workflow
- `main` — Arsh (Tech Lead) reviews and merges.
- `aaryan/backend` — Backend + agents development.
- `sahil/frontend` — Frontend development.

*Created: August 30, 2026*

# Vectr — Database Schema

> SQLite database schema with all tables and relationships.

---

## Overview

Vectr uses **SQLite** for the hackathon MVP. The database file is stored at `backend/vectr.db`.

---

## Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│    users     │     │  contributions   │     │    issues     │
├──────────────┤     ├──────────────────┤     ├──────────────┤
│ id (PK)      │◄───┤ user_id (FK)     │     │ id (PK)      │
│ google_id    │     │ issue_id (FK)    ├────►│ github_id    │
│ email        │     │ pr_url           │     │ repo_name    │
│ name         │     │ points_earned    │     │ title        │
│ avatar_url   │     │ completed_at     │     │ description  │
│ github_user  │     └──────────────────┘     │ difficulty   │
│ github_token │                              │ skills       │
│ level        │     ┌──────────────────┐     │ labels       │
│ points       │     │   user_badges    │     │ org_id (FK)  │
│ tier         │     ├──────────────────┤     └──────┬───────┘
│ pref_langs   │◄───┤ user_id (FK)     │            │
│ streak_days  │     │ badge_id         │     ┌──────┴───────┐
│ issues_solved│     │ earned_at        │     │organizations │
│ created_at   │     └──────────────────┘     ├──────────────┤
│ updated_at   │                              │ id (PK)      │
└──────────────┘                              │ name         │
                                              │ github_url   │
                                              │ email        │
                                              │ description  │
                                              └──────────────┘
```

---

## Tables

### `users`

Primary user table. Created when a user signs in with Google.

```sql
CREATE TABLE users (
    id              TEXT PRIMARY KEY,          -- UUID
    google_id       TEXT NOT NULL UNIQUE,      -- Google OAuth ID
    email           TEXT NOT NULL UNIQUE,
    name            TEXT NOT NULL,
    avatar_url      TEXT,
    
    -- GitHub
    github_username TEXT,
    github_token    TEXT,                       -- Encrypted OAuth token
    
    -- Gamification
    level           INTEGER DEFAULT 0,         -- 0-99
    points          INTEGER DEFAULT 0,
    tier            TEXT DEFAULT 'beginner',    -- beginner|moderate|advanced|expert
    
    -- Preferences
    preferred_languages TEXT DEFAULT '[]',      -- JSON array
    
    -- Stats
    streak_days     INTEGER DEFAULT 0,
    longest_streak  INTEGER DEFAULT 0,
    issues_solved   INTEGER DEFAULT 0,
    daily_challenges_completed INTEGER DEFAULT 0,
    last_contribution_date TEXT,                -- ISO date string
    
    -- Timestamps
    created_at      TEXT NOT NULL,              -- ISO datetime
    updated_at      TEXT NOT NULL               -- ISO datetime
);
```

### `issues`

Cached issues from GitHub, categorized by the Issue Scanner Agent.

```sql
CREATE TABLE issues (
    id                TEXT PRIMARY KEY,         -- UUID
    github_issue_id   INTEGER NOT NULL,
    repo_full_name    TEXT NOT NULL,            -- "owner/repo"
    title             TEXT NOT NULL,
    description       TEXT,
    url               TEXT NOT NULL,            -- GitHub issue URL
    
    -- AI categorization
    difficulty        TEXT NOT NULL,            -- beginner|moderate|advanced
    difficulty_score  INTEGER NOT NULL,         -- 1-100
    required_skills   TEXT DEFAULT '[]',        -- JSON array
    labels            TEXT DEFAULT '[]',        -- JSON array
    summary           TEXT,                     -- AI-generated summary
    estimated_time    TEXT,                     -- "30 min", "1-2 hours"
    
    -- Daily challenge
    is_daily_challenge BOOLEAN DEFAULT FALSE,
    daily_challenge_date TEXT,                  -- ISO date
    
    -- Organization
    organization_id   TEXT,                     -- FK to organizations
    
    -- Timestamps
    created_at        TEXT NOT NULL,
    scanned_at        TEXT NOT NULL,            -- When agent last processed
    
    UNIQUE(github_issue_id, repo_full_name)
);
```

### `contributions`

Tracks when a user completes an issue.

```sql
CREATE TABLE contributions (
    id              TEXT PRIMARY KEY,           -- UUID
    user_id         TEXT NOT NULL,              -- FK to users
    issue_id        TEXT NOT NULL,              -- FK to issues
    pr_url          TEXT,                       -- Pull request URL
    points_earned   INTEGER NOT NULL,
    completed_at    TEXT NOT NULL,              -- ISO datetime
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (issue_id) REFERENCES issues(id),
    UNIQUE(user_id, issue_id)                  -- Can't solve same issue twice
);
```

### `user_badges`

Junction table for earned badges.

```sql
CREATE TABLE user_badges (
    id          TEXT PRIMARY KEY,               -- UUID
    user_id     TEXT NOT NULL,                  -- FK to users
    badge_id    TEXT NOT NULL,                  -- Badge identifier string
    earned_at   TEXT NOT NULL,                  -- ISO datetime
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, badge_id)                  -- Can't earn same badge twice
);
```

### `organizations`

Registered organizations.

```sql
CREATE TABLE organizations (
    id              TEXT PRIMARY KEY,           -- UUID
    name            TEXT NOT NULL,
    github_org_url  TEXT NOT NULL,
    contact_email   TEXT NOT NULL,
    description     TEXT,
    created_at      TEXT NOT NULL               -- ISO datetime
);
```

### `projects`

Organization's registered projects/repos.

```sql
CREATE TABLE projects (
    id                TEXT PRIMARY KEY,         -- UUID
    organization_id   TEXT NOT NULL,            -- FK to organizations
    repo_full_name    TEXT NOT NULL,            -- "owner/repo"
    repo_url          TEXT NOT NULL,
    issues_scanned    INTEGER DEFAULT 0,
    created_at        TEXT NOT NULL,            -- ISO datetime
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
```

---

## Indexes

```sql
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_github_username ON users(github_username);
CREATE INDEX idx_issues_difficulty ON issues(difficulty);
CREATE INDEX idx_issues_repo ON issues(repo_full_name);
CREATE INDEX idx_issues_daily ON issues(is_daily_challenge);
CREATE INDEX idx_contributions_user ON contributions(user_id);
CREATE INDEX idx_contributions_date ON contributions(completed_at);
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_projects_org ON projects(organization_id);
```

---

## Seed Data

For the hackathon demo, pre-seed these organizations and their repos:

```sql
-- Pre-seeded organizations
INSERT INTO organizations (id, name, github_org_url, contact_email, description, created_at)
VALUES 
    ('org-1', 'freeCodeCamp', 'https://github.com/freeCodeCamp', 'team@freecodecamp.org', 'Learn to code for free', '2026-08-30T09:00:00Z'),
    ('org-2', 'EddieHub', 'https://github.com/EddieHubCommunity', 'hello@eddiehub.org', 'Open source community', '2026-08-30T09:00:00Z'),
    ('org-3', 'first-contributions', 'https://github.com/firstcontributions', 'info@firstcontributions.github.io', 'Help beginners contribute to open source', '2026-08-30T09:00:00Z');
```

---

*This document is the definitive spec for the database schema.*

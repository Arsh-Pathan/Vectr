# Vectr — API Contract

> **⚠️ This file is the single source of truth for the API.** Both backend and frontend agents MUST follow these schemas exactly. Neither agent may modify this file.

---

## Base Configuration

| Setting | Value |
|---------|-------|
| **Base URL** | `http://localhost:8000/api` |
| **Content-Type** | `application/json` |
| **Auth Header** | `Authorization: Bearer <jwt_token>` |
| **CORS Origin** | `http://localhost:5173` |

---

## Authentication Endpoints

### POST `/api/auth/google`

Exchange a Google OAuth token for a Vectr JWT.

**Request:**
```json
{
  "token": "google_oauth_id_token_string"
}
```

**Response (200):**
```json
{
  "access_token": "vectr_jwt_token",
  "user": {
    "id": "uuid-string",
    "email": "user@gmail.com",
    "name": "Arsh Pathan",
    "avatar_url": "https://lh3.googleusercontent.com/...",
    "github_connected": false,
    "level": 0,
    "points": 0,
    "tier": "beginner",
    "is_new_user": true
  }
}
```

---

### POST `/api/auth/github/connect`

Connect a GitHub account after Google auth. Triggers profile analysis.

**Request:**
```json
{
  "code": "github_oauth_authorization_code"
}
```

**Response (200):**
```json
{
  "github_username": "arshpathan",
  "profile_analysis": {
    "points": 350,
    "level": 18,
    "tier": "beginner",
    "top_languages": [
      { "language": "Python", "proficiency": "intermediate" },
      { "language": "JavaScript", "proficiency": "beginner" },
      { "language": "HTML", "proficiency": "intermediate" }
    ],
    "summary": "Active contributor with consistent Python development. Good foundation for beginner to moderate open-source issues."
  },
  "user": {
    "id": "uuid-string",
    "email": "user@gmail.com",
    "name": "Arsh Pathan",
    "avatar_url": "https://lh3.googleusercontent.com/...",
    "github_username": "arshpathan",
    "github_connected": true,
    "level": 18,
    "points": 350,
    "tier": "beginner"
  }
}
```

---

## Developer Endpoints

### GET `/api/developer/profile`

Get the authenticated user's full profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "uuid-string",
  "email": "user@gmail.com",
  "name": "Arsh Pathan",
  "avatar_url": "https://lh3.googleusercontent.com/...",
  "github_username": "arshpathan",
  "github_connected": true,
  "level": 23,
  "points": 450,
  "tier": "moderate",
  "preferred_languages": [
    { "language": "Python", "proficiency": "intermediate" },
    { "language": "JavaScript", "proficiency": "beginner" }
  ],
  "streak_days": 5,
  "issues_solved": 12,
  "created_at": "2026-08-30T10:00:00Z"
}
```

---

### POST `/api/developer/preferences`

Set or update the developer's preferred languages.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "languages": [
    { "language": "Python", "proficiency": "intermediate" },
    { "language": "JavaScript", "proficiency": "beginner" },
    { "language": "TypeScript", "proficiency": "beginner" }
  ]
}
```

**Response (200):**
```json
{
  "message": "Preferences updated successfully",
  "languages": [
    { "language": "Python", "proficiency": "intermediate" },
    { "language": "JavaScript", "proficiency": "beginner" },
    { "language": "TypeScript", "proficiency": "beginner" }
  ]
}
```

---

### GET `/api/developer/badges`

Get all badges (earned and locked) for the user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "badges": [
    {
      "id": "first_step",
      "name": "First Step",
      "icon": "🌱",
      "description": "Solve your first issue",
      "condition": "Solve 1 issue",
      "earned": true,
      "earned_at": "2026-08-30T12:00:00Z"
    },
    {
      "id": "on_fire",
      "name": "On Fire",
      "icon": "🔥",
      "description": "Maintain a 3-day streak",
      "condition": "3-day contribution streak",
      "earned": true,
      "earned_at": "2026-08-30T14:00:00Z"
    },
    {
      "id": "unstoppable",
      "name": "Unstoppable",
      "icon": "⚡",
      "description": "Maintain a 7-day streak",
      "condition": "7-day contribution streak",
      "earned": false,
      "earned_at": null
    },
    {
      "id": "sharpshooter",
      "name": "Sharpshooter",
      "icon": "🎯",
      "description": "Solve 10 issues",
      "condition": "Solve 10 issues",
      "earned": true,
      "earned_at": "2026-08-30T15:00:00Z"
    },
    {
      "id": "veteran",
      "name": "Veteran",
      "icon": "💎",
      "description": "Solve 50 issues",
      "condition": "Solve 50 issues",
      "earned": false,
      "earned_at": null
    },
    {
      "id": "daily_warrior",
      "name": "Daily Warrior",
      "icon": "🌟",
      "description": "Complete 5 daily challenges",
      "condition": "Complete 5 daily challenges",
      "earned": false,
      "earned_at": null
    },
    {
      "id": "level_up",
      "name": "Level Up",
      "icon": "🚀",
      "description": "Reach Level 25",
      "condition": "Reach Level 25",
      "earned": false,
      "earned_at": null
    },
    {
      "id": "elite",
      "name": "Elite",
      "icon": "👑",
      "description": "Reach Level 75",
      "condition": "Reach Level 75",
      "earned": false,
      "earned_at": null
    }
  ]
}
```

---

### GET `/api/developer/stats`

Get user stats including heatmap data and streak info.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "total_issues_solved": 12,
  "total_points": 450,
  "current_streak": 5,
  "longest_streak": 8,
  "daily_challenges_completed": 3,
  "heatmap": [
    { "date": "2026-08-25", "count": 2 },
    { "date": "2026-08-26", "count": 1 },
    { "date": "2026-08-27", "count": 3 },
    { "date": "2026-08-28", "count": 1 },
    { "date": "2026-08-29", "count": 2 },
    { "date": "2026-08-30", "count": 0 }
  ],
  "contributions_by_language": {
    "Python": 7,
    "JavaScript": 3,
    "TypeScript": 2
  }
}
```

---

## Issue Endpoints

### GET `/api/issues`

Get AI-matched issues for the authenticated developer.

**Headers:** `Authorization: Bearer <token>`

**Query Params (optional):**
- `limit` (int, default 10) — Number of issues to return
- `difficulty` (string) — Filter: "beginner", "moderate", "advanced"
- `language` (string) — Filter by language

**Response (200):**
```json
{
  "issues": [
    {
      "id": "uuid-string",
      "github_issue_id": 42,
      "repo_full_name": "freeCodeCamp/freeCodeCamp",
      "title": "Fix input validation in signup form",
      "description": "The signup form doesn't validate email format properly...",
      "url": "https://github.com/freeCodeCamp/freeCodeCamp/issues/42",
      "difficulty": "beginner",
      "difficulty_score": 22,
      "required_skills": ["JavaScript", "React", "Regex"],
      "labels": ["bug", "good-first-issue"],
      "points_reward": 10,
      "match_score": 0.92,
      "match_reason": "Matches your JavaScript skills and beginner level"
    }
  ],
  "total": 25
}
```

---

### GET `/api/issues/daily`

Get today's daily challenge issue.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "uuid-string",
  "github_issue_id": 87,
  "repo_full_name": "EddieHubCommunity/BioDrop",
  "title": "Add input sanitization to profile editor",
  "description": "User profile editor needs XSS prevention...",
  "url": "https://github.com/EddieHubCommunity/BioDrop/issues/87",
  "difficulty": "beginner",
  "difficulty_score": 28,
  "required_skills": ["JavaScript", "Security"],
  "labels": ["good-first-issue", "security"],
  "points_reward": 15,
  "is_daily_challenge": true
}
```

---

### GET `/api/issues/:id`

Get full issue details with AI guidance.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "issue": {
    "id": "uuid-string",
    "github_issue_id": 42,
    "repo_full_name": "freeCodeCamp/freeCodeCamp",
    "title": "Fix input validation in signup form",
    "description": "The signup form doesn't validate email format properly. Users can submit forms with invalid email addresses like 'user@' or 'user@.com'.",
    "url": "https://github.com/freeCodeCamp/freeCodeCamp/issues/42",
    "difficulty": "beginner",
    "difficulty_score": 22,
    "required_skills": ["JavaScript", "React", "Regex"],
    "labels": ["bug", "good-first-issue"],
    "points_reward": 10
  },
  "guidance": {
    "suggested_approach": [
      "Look at the signup form component in src/components/SignupForm.jsx",
      "The current validation only checks if the field is empty",
      "Consider using a regex pattern for email validation",
      "Test edge cases: missing domain, missing TLD, special characters"
    ],
    "relevant_files": [
      "src/components/SignupForm.jsx",
      "src/utils/validators.js",
      "tests/SignupForm.test.js"
    ],
    "concepts_to_review": [
      "Regular expressions for email validation",
      "React form handling and controlled components",
      "Unit testing with Jest"
    ],
    "estimated_time": "30 min - 1 hour"
  }
}
```

---

### POST `/api/issues/:id/chat`

Send a message to the Guidance Agent for a specific issue.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "message": "How should I handle unicode characters in the email validation?"
}
```

**Response (200):**
```json
{
  "response": "Great question! Unicode in email addresses is actually allowed by RFC 6531. For this issue, I'd suggest focusing on the basic ASCII format first. Think about what makes a valid email structure: local-part@domain.tld. Consider what each part requires — the local part can contain letters, numbers, and certain special characters, while the domain must follow DNS naming rules. What regex pattern captures these requirements?",
  "follow_up_suggestions": [
    "What regex pattern would you start with?",
    "Have you considered the edge cases mentioned in the issue?",
    "Would you like me to explain the email RFC format?"
  ]
}
```

---

### POST `/api/issues/:id/complete`

Mark an issue as completed. Awards points and checks for badge unlocks.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "pr_url": "https://github.com/freeCodeCamp/freeCodeCamp/pull/123"
}
```

**Response (200):**
```json
{
  "message": "Issue completed! Great work!",
  "points_earned": 10,
  "new_total_points": 460,
  "new_level": 23,
  "level_changed": false,
  "new_badges": [],
  "streak_days": 6
}
```

**Response (200, with level up + badge):**
```json
{
  "message": "Issue completed! Great work!",
  "points_earned": 25,
  "new_total_points": 500,
  "new_level": 25,
  "level_changed": true,
  "new_badges": [
    {
      "id": "level_up",
      "name": "Level Up",
      "icon": "🚀",
      "description": "Reach Level 25"
    }
  ],
  "streak_days": 6
}
```

---

## Organization Endpoints

### POST `/api/org/register`

Register a new organization.

**Request:**
```json
{
  "name": "OpenSourceCo",
  "github_org_url": "https://github.com/opensourceco",
  "contact_email": "hello@opensourceco.com",
  "description": "Building open-source developer tools"
}
```

**Response (201):**
```json
{
  "id": "uuid-string",
  "name": "OpenSourceCo",
  "github_org_url": "https://github.com/opensourceco",
  "contact_email": "hello@opensourceco.com",
  "description": "Building open-source developer tools",
  "created_at": "2026-08-30T10:00:00Z"
}
```

---

### POST `/api/org/projects`

Add a project/repo to an organization.

**Request:**
```json
{
  "organization_id": "uuid-string",
  "repo_full_name": "opensourceco/devtools",
  "repo_url": "https://github.com/opensourceco/devtools"
}
```

**Response (201):**
```json
{
  "id": "uuid-string",
  "organization_id": "uuid-string",
  "repo_full_name": "opensourceco/devtools",
  "repo_url": "https://github.com/opensourceco/devtools",
  "issues_scanned": 0,
  "created_at": "2026-08-30T10:00:00Z"
}
```

---

### GET `/api/org/dashboard`

Get organization dashboard with contributor activity.

**Query Params:** `org_id` (required)

**Response (200):**
```json
{
  "organization": {
    "id": "uuid-string",
    "name": "OpenSourceCo"
  },
  "projects": [
    {
      "repo_full_name": "opensourceco/devtools",
      "total_issues": 15,
      "issues_solved": 3,
      "active_contributors": 5
    }
  ],
  "total_contributors": 8,
  "total_issues_solved": 3
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "detail": "Human-readable error message"
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request — invalid input |
| 401 | Unauthorized — missing or invalid token |
| 404 | Not Found — resource doesn't exist |
| 500 | Internal Server Error |

---

*This contract is owned by the Tech Lead (Arsh). Do not modify.*

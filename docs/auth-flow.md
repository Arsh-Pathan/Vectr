# Vectr — Authentication Flow

> Detailed auth flow for Google OAuth and GitHub OAuth.

---

## Overview

Vectr uses a **two-step authentication** process:

1. **Google OAuth** — Primary sign-in/sign-up (creates the Vectr account)
2. **GitHub OAuth** — Secondary connection (fetches profile data for skill analysis)

After both steps, the **Profile Agent** runs to calculate the user's initial level.

---

## Flow Diagram

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User    │     │  Frontend    │     │  Backend     │     │  Google/     │
│  Browser │     │  (React)     │     │  (FastAPI)   │     │  GitHub      │
└────┬─────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
     │                  │                    │                    │
     │  Click "Sign in  │                    │                    │
     │  with Google"    │                    │                    │
     ├─────────────────►│                    │                    │
     │                  │  Redirect to       │                    │
     │                  │  Google OAuth      │                    │
     │◄─────────────────┤                    │                    │
     │                  │                    │                    │
     │  Google Login    │                    │                    │
     ├──────────────────┼────────────────────┼───────────────────►│
     │                  │                    │                    │
     │  Redirect with   │                    │                    │
     │  ID token        │                    │                    │
     │◄─────────────────┼────────────────────┼────────────────────┤
     │                  │                    │                    │
     │  Send token      │                    │                    │
     ├─────────────────►│                    │                    │
     │                  │  POST /auth/google │                    │
     │                  │  { token: "..." }  │                    │
     │                  ├───────────────────►│                    │
     │                  │                    │  Verify token      │
     │                  │                    ├───────────────────►│
     │                  │                    │◄───────────────────┤
     │                  │                    │  Create/find user  │
     │                  │                    │  Generate JWT      │
     │                  │  { access_token,   │                    │
     │                  │    user }          │                    │
     │                  │◄───────────────────┤                    │
     │                  │                    │                    │
     │  Show "Connect   │                    │                    │
     │  GitHub" step    │                    │                    │
     │◄─────────────────┤                    │                    │
     │                  │                    │                    │
     │  Click "Connect  │                    │                    │
     │  GitHub"         │                    │                    │
     ├─────────────────►│                    │                    │
     │                  │  Redirect to       │                    │
     │                  │  GitHub OAuth      │                    │
     │◄─────────────────┤                    │                    │
     │                  │                    │                    │
     │  GitHub Login    │                    │                    │
     ├──────────────────┼────────────────────┼───────────────────►│
     │                  │                    │                    │
     │  Redirect with   │                    │                    │
     │  auth code       │                    │                    │
     │◄─────────────────┼────────────────────┼────────────────────┤
     │                  │                    │                    │
     │  Send code       │                    │                    │
     ├─────────────────►│                    │                    │
     │                  │  POST /auth/       │                    │
     │                  │  github/connect    │                    │
     │                  │  { code: "..." }   │                    │
     │                  ├───────────────────►│                    │
     │                  │                    │  Exchange code     │
     │                  │                    │  for token         │
     │                  │                    ├───────────────────►│
     │                  │                    │◄───────────────────┤
     │                  │                    │  Fetch GitHub data │
     │                  │                    ├───────────────────►│
     │                  │                    │◄───────────────────┤
     │                  │                    │  Run Profile Agent │
     │                  │                    │  Calculate level   │
     │                  │  { github_username,│                    │
     │                  │    profile_analysis,│                   │
     │                  │    user }          │                    │
     │                  │◄───────────────────┤                    │
     │                  │                    │                    │
     │  Show level      │                    │                    │
     │  animation +     │                    │                    │
     │  language picker │                    │                    │
     │◄─────────────────┤                    │                    │
     │                  │                    │                    │
     │  Select languages│                    │                    │
     ├─────────────────►│                    │                    │
     │                  │  POST /developer/  │                    │
     │                  │  preferences       │                    │
     │                  ├───────────────────►│                    │
     │                  │◄───────────────────┤                    │
     │                  │                    │                    │
     │  Redirect to     │                    │                    │
     │  Dashboard       │                    │                    │
     │◄─────────────────┤                    │                    │
```

---

## OAuth Configuration

### Google OAuth

| Setting | Value |
|---------|-------|
| **Provider** | Google Identity Services |
| **Scopes** | `openid email profile` |
| **Redirect URI** | `http://localhost:5173/auth/google/callback` |
| **Token Type** | ID Token (JWT) |

**Frontend:** Use `@react-oauth/google` or Google Identity Services library.

**Backend:** Verify the Google ID token using `google.oauth2.id_token` or decode the JWT.

### GitHub OAuth

| Setting | Value |
|---------|-------|
| **Provider** | GitHub OAuth Apps |
| **Scopes** | `read:user repo` |
| **Redirect URI** | `http://localhost:5173/auth/github/callback` |
| **Token Type** | Authorization Code → Access Token |

**Frontend:** Redirect to `https://github.com/login/oauth/authorize?client_id=...&scope=read:user+repo&redirect_uri=...`

**Backend:** Exchange the authorization code for an access token via `https://github.com/login/oauth/access_token`

---

## JWT Token

After Google OAuth, the backend issues a **JWT token** for subsequent API calls.

| Claim | Value |
|-------|-------|
| `sub` | User ID (UUID) |
| `email` | User email |
| `exp` | Expiration (24 hours) |

**Frontend stores:** `localStorage.setItem('vectr_token', token)`

**Backend validates:** Every protected endpoint checks the `Authorization: Bearer <token>` header.

---

## GitHub Data Fetched

After GitHub OAuth, the backend fetches:

| Data | GitHub API Endpoint |
|------|-------------------|
| User profile | `GET /user` |
| Public repos | `GET /user/repos?type=public` |
| Languages per repo | `GET /repos/{owner}/{repo}/languages` |
| Contribution stats | `GET /users/{username}/events` (last 90 days) |

This data is passed to the **Profile Agent** for skill analysis.

---

*This document is the definitive spec for the auth system.*

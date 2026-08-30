# Vectr — Open Source Contribution Platform

> *Connecting developers to the right open-source issues, intelligently.*

[![Hackathon](https://img.shields.io/badge/CSI%20KJSSE-Gemini%20Hackday%202.0-blue)](https://events.mlh.com/events/14573-csi-kjsse-gemini-hackday-2-0)
[![Google Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-4285F4)](https://ai.google.dev/)
[![Google ADK](https://img.shields.io/badge/Built%20with-Google%20ADK-34A853)](https://google.github.io/adk-docs/)

---

## 🚀 What is Vectr?

Vectr is an AI-powered platform that bridges the gap between **open-source contributors** and **organizations** by intelligently matching developers with issues that fit their skill level, preferred languages, and experience.

### The Solution

Vectr uses **Google Gemini API** and **Google ADK** to:

1. **Analyze developer profiles** via GitHub and assign a skill level (0–99)
2. **Scan organization repos** and categorize issues by difficulty
3. **Match developers to issues** via a fast SQL matching engine
4. **Guide contributors** with AI-powered suggestions — protected by strong anti-jailbreak guardrails so the code is never written for them.

---

## 🤖 System Architecture

Vectr runs on **3 specialized AI agents** and **1 database engine**:

| Component | Responsibility |
|-------|---------------|
| **Profile Agent** | Analyzes GitHub stats → calculates level (0–99) |
| **Issue Scanner Agent** | Scans repos → categorizes and rates issues |
| **DB Matching Engine** | Fast SQL engine to match skills ↔ difficulty |
| **Guidance Agent** | Provides hints, approaches, relevant files — never solutions |

*(See `ARCHITECTURE.md` and `docs/` for full details).*

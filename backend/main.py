import os
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import PORT
from database import init_db, SessionLocal
from models import Organization, Project, Issue
from routers import auth_router, developer_router, issues_router, org_router


def seed_initial_demo_data():
    """Seed sample organizations and starter issues if database is fresh."""
    db = SessionLocal()
    try:
        # Check if orgs already exist
        if db.query(Organization).count() == 0:
            org1 = Organization(
                id="org-1",
                name="freeCodeCamp",
                github_org_url="https://github.com/freeCodeCamp",
                contact_email="team@freecodecamp.org",
                description="Learn to code for free and contribute to global open-source curriculum.",
            )
            org2 = Organization(
                id="org-2",
                name="EddieHub",
                github_org_url="https://github.com/EddieHubCommunity",
                contact_email="hello@eddiehub.org",
                description="Open source community focused on welcoming first-time contributors.",
            )
            org3 = Organization(
                id="org-3",
                name="first-contributions",
                github_org_url="https://github.com/firstcontributions",
                contact_email="info@firstcontributions.github.io",
                description="Helping beginners make their very first contribution to open source.",
            )
            db.add_all([org1, org2, org3])
            db.commit()

            # Seed demo starter issues
            sample_issues = [
                Issue(
                    github_issue_id=42,
                    repo_full_name="freeCodeCamp/freeCodeCamp",
                    title="Fix input validation in signup form",
                    description="The signup form doesn't validate email format properly. Users can submit forms with invalid email addresses like 'user@' or 'user@.com'.",
                    url="https://github.com/freeCodeCamp/freeCodeCamp/issues/42",
                    difficulty="beginner",
                    difficulty_score=22,
                    required_skills=json.dumps(["JavaScript", "React", "Regex"]),
                    labels=json.dumps(["bug", "good-first-issue"]),
                    summary="Improve email format regex validation and display clean error message under input field.",
                    estimated_time="30 min - 1 hour",
                    is_daily_challenge=False,
                ),
                Issue(
                    github_issue_id=87,
                    repo_full_name="EddieHubCommunity/BioDrop",
                    title="Add input sanitization to profile editor",
                    description="User profile editor needs XSS prevention. Sanitize Markdown input before rendering live preview.",
                    url="https://github.com/EddieHubCommunity/BioDrop/issues/87",
                    difficulty="beginner",
                    difficulty_score=28,
                    required_skills=json.dumps(["JavaScript", "Security", "DOMPurify"]),
                    labels=json.dumps(["good-first-issue", "security"]),
                    summary="Sanitize custom HTML tags in user profile bio editor using DOMPurify.",
                    estimated_time="45 mins",
                    is_daily_challenge=True,
                ),
                Issue(
                    github_issue_id=144,
                    repo_full_name="firstcontributions/first-contributions",
                    title="Add Python type annotations to contributor verification script",
                    description="The helper script under scripts/verify.py lacks type annotations. Add PEP 484 type hints.",
                    url="https://github.com/firstcontributions/first-contributions/issues/144",
                    difficulty="beginner",
                    difficulty_score=15,
                    required_skills=json.dumps(["Python", "TypeHints"]),
                    labels=json.dumps(["good-first-issue", "python"]),
                    summary="Add complete type hints and mypy validation to scripts/verify.py.",
                    estimated_time="30 mins",
                    is_daily_challenge=False,
                ),
                Issue(
                    github_issue_id=205,
                    repo_full_name="tiangolo/fastapi",
                    title="Refactor query parameter alias handling in sub-dependencies",
                    description="Support parameter aliases containing hyphens across multi-level nested dependency resolution models.",
                    url="https://github.com/tiangolo/fastapi/issues/205",
                    difficulty="moderate",
                    difficulty_score=45,
                    required_skills=json.dumps(["Python", "FastAPI", "Pydantic"]),
                    labels=json.dumps(["enhancement", "dependencies"]),
                    summary="Resolve parameter alias resolution logic in nested dependency graphs.",
                    estimated_time="2-3 hours",
                    is_daily_challenge=False,
                ),
                Issue(
                    github_issue_id=310,
                    repo_full_name="pallets/flask",
                    title="Implement async blueprint middleware pipeline hook",
                    description="Add an async before_request and after_request hook mechanism without breaking legacy sync extensions.",
                    url="https://github.com/pallets/flask/issues/310",
                    difficulty="advanced",
                    difficulty_score=75,
                    required_skills=json.dumps(["Python", "AsyncIO", "WSGI", "ASGI"]),
                    labels=json.dumps(["core", "async"]),
                    summary="Architect async middleware hooks with backwards compatibility for WSGI pipelines.",
                    estimated_time="1-2 days",
                    is_daily_challenge=False,
                ),
            ]
            db.add_all(sample_issues)
            db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    seed_initial_demo_data()
    # Backfill vector embeddings for fresh/seeded issues
    db = SessionLocal()
    try:
        from services.vector_service import VectorService
        VectorService.bulk_embed_issues(db)
    except Exception as e:
        print(f"Startup vector embedding notice: {e}")
    finally:
        db.close()
    yield
    # Shutdown


app = FastAPI(
    title="Vectr API",
    description="Open Source Contribution Platform API powered by Google Gemini & ADK",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix="/api")
app.include_router(developer_router, prefix="/api")
app.include_router(issues_router, prefix="/api")
app.include_router(org_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "name": "Vectr API",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/api/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)

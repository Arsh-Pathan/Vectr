import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import User
from utils.helpers import create_access_token, get_current_user
from services.github_service import GitHubService
from agents.profile_agent import ProfileAgent

router = APIRouter(prefix="/auth", tags=["Authentication"])


class GoogleAuthRequest(BaseModel):
    token: str


class GitHubConnectRequest(BaseModel):
    code: str


@router.post("/google")
async def google_auth(request: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Exchange Google ID token for Vectr JWT access token."""
    # In mock/demo mode, decode or extract user email from token or provide demo fallback
    token_str = request.token
    email = "developer@vectr.ai"
    name = "Vectr Developer"
    avatar_url = "https://lh3.googleusercontent.com/a/default-avatar"
    google_id = "google_" + token_str[:12] if len(token_str) >= 12 else "google_demo_user_123"

    user = db.query(User).filter(User.google_id == google_id).first()
    is_new = False

    if not user:
        # Check by email
        user = db.query(User).filter(User.email == email).first()

    if not user:
        is_new = True
        user = User(
            google_id=google_id,
            email=email,
            name=name,
            avatar_url=avatar_url,
            level=0,
            points=0,
            tier="beginner",
            preferred_languages="[]",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token({"sub": user.id, "email": user.email})

    return {
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "avatar_url": user.avatar_url,
            "github_connected": bool(user.github_username),
            "level": user.level,
            "points": user.points,
            "tier": user.tier,
            "is_new_user": is_new,
        },
    }


@router.post("/github/connect")
async def connect_github(
    request: GitHubConnectRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Connect GitHub account, trigger Profile Agent analysis, and save seed score."""
    gh_token = await GitHubService.exchange_code_for_token(request.code)
    if not gh_token:
        raise HTTPException(status_code=400, detail="Failed to retrieve GitHub access token")

    gh_profile = await GitHubService.fetch_user_profile(gh_token)
    gh_username = gh_profile.get("login", "octocat-dev")

    # Ingest profile stats
    gh_stats = await GitHubService.get_developer_github_stats(gh_username, gh_token)

    # Run Profile Agent
    profile_agent = ProfileAgent()
    analysis = profile_agent.analyze_profile(
        username=gh_username,
        repos_count=gh_stats["repos_count"],
        commits_count=gh_stats["commits_count"],
        languages=gh_stats["languages"],
        contrib_days=gh_stats["contrib_days"],
        pr_issues_count=gh_stats["pr_issues_count"],
        account_age_days=gh_stats["account_age_days"],
        sample_repos=gh_stats.get("sample_repos", []),
    )

    # Update user
    current_user.github_username = gh_username
    current_user.github_token = gh_token
    current_user.points = analysis.calculated_points
    current_user.level = analysis.level
    current_user.tier = analysis.tier
    current_user.preferred_languages = json.dumps(
        [{"language": lp.language, "proficiency": lp.proficiency} for lp in analysis.language_breakdown]
    )

    db.commit()
    db.refresh(current_user)

    return {
        "github_username": current_user.github_username,
        "profile_analysis": {
            "points": analysis.calculated_points,
            "level": analysis.level,
            "tier": analysis.tier,
            "top_languages": [
                {"language": lp.language, "proficiency": lp.proficiency} for lp in analysis.language_breakdown
            ],
            "summary": analysis.summary,
        },
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "avatar_url": current_user.avatar_url,
            "github_username": current_user.github_username,
            "github_connected": True,
            "level": current_user.level,
            "points": current_user.points,
            "tier": current_user.tier,
        },
    }

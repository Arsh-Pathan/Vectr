import json
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import User, UserBadge, Contribution, Issue
from utils.helpers import get_current_user
from services.badge_service import BADGE_METADATA

router = APIRouter(prefix="/developer", tags=["Developer"])


class LanguagePreference(BaseModel):
    language: str
    proficiency: str


class PreferencesRequest(BaseModel):
    languages: List[LanguagePreference]


@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get authenticated user profile details."""
    try:
        raw_prefs = json.loads(current_user.preferred_languages or "[]")
        if isinstance(raw_prefs, list) and len(raw_prefs) > 0 and isinstance(raw_prefs[0], str):
            preferred_languages = [{"language": lang, "proficiency": "intermediate"} for lang in raw_prefs]
        else:
            preferred_languages = raw_prefs
    except Exception:
        preferred_languages = []

    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "avatar_url": current_user.avatar_url,
        "github_username": current_user.github_username,
        "github_connected": bool(current_user.github_username),
        "level": current_user.level or 0,
        "points": current_user.points or 0,
        "tier": current_user.tier or "beginner",
        "preferred_languages": preferred_languages,
        "streak_days": current_user.streak_days or 0,
        "issues_solved": current_user.issues_solved or 0,
        "created_at": current_user.created_at,
    }


@router.post("/preferences")
async def update_preferences(
    request: PreferencesRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update preferred languages and proficiencies."""
    prefs_data = [lp.model_dump() for lp in request.languages]
    current_user.preferred_languages = json.dumps(prefs_data)
    db.commit()

    return {
        "message": "Preferences updated successfully",
        "languages": prefs_data,
    }


@router.get("/badges")
async def get_badges(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all 8 badges with unlocked status for current user."""
    earned_badges_query = db.query(UserBadge).filter(UserBadge.user_id == current_user.id).all()
    earned_map = {ub.badge_id: ub.earned_at for ub in earned_badges_query}

    badges_list = []
    for badge_id, meta in BADGE_METADATA.items():
        is_earned = badge_id in earned_map
        badges_list.append({
            "id": badge_id,
            "name": meta["name"],
            "icon": meta["icon"],
            "description": meta["description"],
            "condition": meta["condition"],
            "earned": is_earned,
            "earned_at": earned_map.get(badge_id),
        })

    return {"badges": badges_list}


@router.get("/stats")
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get contributor activity stats and language distribution."""
    # Get solved contributions
    contributions = db.query(Contribution).filter(Contribution.user_id == current_user.id).all()
    
    # Calculate contributions by language
    lang_dist: Dict[str, int] = {}
    heatmap_data: Dict[str, int] = {}

    for c in contributions:
        c_date = c.completed_at[:10] if c.completed_at else "2026-08-30"
        heatmap_data[c_date] = heatmap_data.get(c_date, 0) + 1

        issue = db.query(Issue).filter(Issue.id == c.issue_id).first()
        if issue:
            try:
                skills = json.loads(issue.required_skills or "[]")
                for s in skills:
                    lang_dist[s] = lang_dist.get(s, 0) + 1
            except Exception:
                pass

    if not lang_dist:
        lang_dist = {"Python": current_user.issues_solved or 1}

    heatmap_list = [{"date": k, "count": v} for k, v in sorted(heatmap_data.items())]

    return {
        "total_issues_solved": current_user.issues_solved or 0,
        "total_points": current_user.points or 0,
        "current_streak": current_user.streak_days or 0,
        "longest_streak": current_user.longest_streak or 0,
        "daily_challenges_completed": current_user.daily_challenges_completed or 0,
        "heatmap": heatmap_list,
        "contributions_by_language": lang_dist,
    }

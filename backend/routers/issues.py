import json
from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import Issue, User, Contribution, UserBadge
from utils.helpers import get_current_user
from services.matching_service import MatchingService
from services.points_service import PointsService
from services.badge_service import BadgeService, BADGE_METADATA
from agents.guidance_agent import GuidanceAgent, ChatMessage

router = APIRouter(prefix="/issues", tags=["Issues"])


class ChatRequest(BaseModel):
    message: str


class CompleteRequest(BaseModel):
    pr_url: Optional[str] = "https://github.com/vectr/contributions/pull/1"


@router.get("")
async def get_matched_issues(
    limit: int = Query(10, ge=1, le=50),
    difficulty: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get AI-matched issues for the current user."""
    matched = MatchingService.get_matched_issues(
        db=db,
        user=current_user,
        difficulty=difficulty,
        language=language,
        limit=limit,
    )

    issues_out = []
    for iss in matched:
        try:
            skills = json.loads(iss.required_skills or "[]")
        except Exception:
            skills = []
        try:
            lbls = json.loads(iss.labels or "[]")
        except Exception:
            lbls = []

        pts = PointsService.calculate_solve_points(iss.difficulty, iss.is_daily_challenge)
        issues_out.append({
            "id": iss.id,
            "github_issue_id": iss.github_issue_id,
            "repo_full_name": iss.repo_full_name,
            "title": iss.title,
            "description": iss.description,
            "url": iss.url,
            "difficulty": iss.difficulty,
            "difficulty_score": iss.difficulty_score,
            "required_skills": skills,
            "labels": lbls,
            "points_reward": pts,
            "match_score": round(max(0.70, 1.0 - abs(iss.difficulty_score - (current_user.level or 0)) / 100), 2),
            "match_reason": f"Matches your {skills[0] if skills else 'core'} skills and {current_user.tier} level",
        })

    return {
        "issues": issues_out,
        "total": len(issues_out),
    }


@router.get("/daily")
async def get_daily_challenge(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get today's daily challenge issue."""
    issue = db.query(Issue).filter(Issue.is_daily_challenge == True).first()
    if not issue:
        # Fallback to beginner issue
        issue = db.query(Issue).filter(Issue.difficulty == "beginner").first()

    if not issue:
        raise HTTPException(status_code=404, detail="No daily challenge available")

    try:
        skills = json.loads(issue.required_skills or "[]")
        lbls = json.loads(issue.labels or "[]")
    except Exception:
        skills, lbls = [], []

    return {
        "id": issue.id,
        "github_issue_id": issue.github_issue_id,
        "repo_full_name": issue.repo_full_name,
        "title": issue.title,
        "description": issue.description,
        "url": issue.url,
        "difficulty": issue.difficulty,
        "difficulty_score": issue.difficulty_score,
        "required_skills": skills,
        "labels": lbls,
        "points_reward": 15,
        "is_daily_challenge": True,
    }


@router.get("/{issue_id}")
async def get_issue_details(
    issue_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get full issue details with AI guidance."""
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    try:
        skills = json.loads(issue.required_skills or "[]")
        lbls = json.loads(issue.labels or "[]")
    except Exception:
        skills, lbls = [], []

    pts = PointsService.calculate_solve_points(issue.difficulty, issue.is_daily_challenge)

    # Use Guidance Agent to create approach suggestions
    guidance_agent = GuidanceAgent()
    ai_guidance = guidance_agent.guide(
        repo_name=issue.repo_full_name,
        issue_title=issue.title,
        issue_body=issue.description or "",
        user_message="Provide initial guidance and recommended steps for this issue.",
    )

    return {
        "issue": {
            "id": issue.id,
            "github_issue_id": issue.github_issue_id,
            "repo_full_name": issue.repo_full_name,
            "title": issue.title,
            "description": issue.description,
            "url": issue.url,
            "difficulty": issue.difficulty,
            "difficulty_score": issue.difficulty_score,
            "required_skills": skills,
            "labels": lbls,
            "points_reward": pts,
        },
        "guidance": {
            "suggested_approach": ai_guidance.suggested_steps,
            "relevant_files": ai_guidance.relevant_files,
            "concepts_to_review": skills,
            "estimated_time": issue.estimated_time or "1-2 hours",
        },
    }


@router.post("/{issue_id}/chat")
async def chat_with_guidance_agent(
    issue_id: str,
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send message to Guidance Agent for mentoring assistance."""
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    guidance_agent = GuidanceAgent()
    resp = guidance_agent.guide(
        repo_name=issue.repo_full_name,
        issue_title=issue.title,
        issue_body=issue.description or "",
        user_message=request.message,
    )

    follow_ups = [
        "What part of the logic would you like to explore next?",
        "Have you checked the relevant files mentioned?",
        "Would you like to review common edge cases for this feature?",
    ]

    return {
        "response": resp.guidance,
        "follow_up_suggestions": follow_ups,
    }


@router.post("/{issue_id}/complete")
async def complete_issue(
    issue_id: str,
    request: CompleteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark issue as completed, calculate points, update streaks, and award badges."""
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    # Check if already solved
    existing_contrib = db.query(Contribution).filter(
        Contribution.user_id == current_user.id,
        Contribution.issue_id == issue.id,
    ).first()

    if existing_contrib:
        return {
            "message": "Issue already completed previously!",
            "points_earned": 0,
            "new_total_points": current_user.points or 0,
            "new_level": current_user.level or 0,
            "level_changed": False,
            "new_badges": [],
            "streak_days": current_user.streak_days or 0,
        }

    old_level = current_user.level or 0
    earned_pts = PointsService.calculate_solve_points(
        difficulty=issue.difficulty,
        is_daily=issue.is_daily_challenge,
        streak_days=current_user.streak_days or 0,
    )

    PointsService.award_points(current_user, earned_pts)
    PointsService.update_streak(current_user, date.today())
    current_user.issues_solved = (current_user.issues_solved or 0) + 1

    if issue.is_daily_challenge:
        current_user.daily_challenges_completed = (current_user.daily_challenges_completed or 0) + 1

    contrib = Contribution(
        user_id=current_user.id,
        issue_id=issue.id,
        pr_url=request.pr_url,
        points_earned=earned_pts,
    )
    db.add(contrib)
    db.commit()

    # Check badges
    newly_earned_badge_ids = BadgeService.check_and_award_badges(db, current_user)
    new_badge_objects = [
        {
            "id": bid,
            "name": BADGE_METADATA.get(bid, {}).get("name", bid),
            "icon": BADGE_METADATA.get(bid, {}).get("icon", "🏆"),
            "description": BADGE_METADATA.get(bid, {}).get("description", ""),
        }
        for bid in newly_earned_badge_ids
    ]

    return {
        "message": "Issue completed! Great work!",
        "points_earned": earned_pts,
        "new_total_points": current_user.points,
        "new_level": current_user.level,
        "level_changed": current_user.level > old_level,
        "new_badges": new_badge_objects,
        "streak_days": current_user.streak_days,
    }

import os
import sys
import json
from datetime import date

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import init_db, SessionLocal
from models import User, Issue, Contribution, UserBadge, Organization
from agents import ProfileAgent, IssueScannerAgent, GuidanceAgent, ChatMessage
from services import MatchingService, PointsService, BadgeService


def test_full_pipeline():
    print("=" * 65)
    print("[*] VECTR END-TO-END INTEGRATION TEST")
    print("=" * 65)

    # 1. Init DB
    init_db()
    db = SessionLocal()
    print("[+] Database initialized successfully.")

    # 2. Simulate User Sign-in & Profile Analysis
    print("\n[Step 1] Profile Agent analyzing developer...")
    profile_agent = ProfileAgent()
    analysis = profile_agent.analyze_profile(
        username="aaryan-dev",
        bio="AI Engineer and Backend Developer building with FastAPI & Gemini",
        repos_count=18,
        commits_count=350,
        languages=["Python", "FastAPI", "SQL", "JavaScript"],
        contrib_days=120,
        pr_issues_count=30,
        account_age_days=500,
    )

    # Upsert user in DB
    user = db.query(User).filter(User.email == "aaryan@example.com").first()
    if not user:
        user = User(
            google_id="google-123456",
            email="aaryan@example.com",
            name="Aaryan",
            github_username=analysis.username,
            points=analysis.calculated_points,
            level=analysis.level,
            tier=analysis.tier,
            preferred_languages=json.dumps(analysis.top_languages),
        )
        db.add(user)
    else:
        user.points = analysis.calculated_points
        user.level = analysis.level
        user.tier = analysis.tier
        user.preferred_languages = json.dumps(analysis.top_languages)
    db.commit()
    db.refresh(user)
    print(f"[+] User '{user.name}' profile saved: Level {user.level} ({user.tier}), Points: {user.points}")

    # 3. Simulate Issue Scanner Agent scanning an open-source issue
    print("\n[Step 2] Issue Scanner Agent categorizing GitHub issue...")
    scanner_agent = IssueScannerAgent()
    scanned = scanner_agent.scan_issue(
        repo_name="tiangolo/fastapi",
        issue_title="Feature: Add response model caching for repeated schema generation",
        issue_body="Generate response model schemas once per endpoint instead of recreating Pydantic fields on every call.",
        labels=["enhancement", "performance"],
        languages_in_repo=["Python"],
    )

    # Save issue in DB
    issue = db.query(Issue).filter(Issue.github_issue_id == 1001).first()
    if not issue:
        issue = Issue(
            github_issue_id=1001,
            repo_full_name="tiangolo/fastapi",
            title="Feature: Add response model caching for repeated schema generation",
            description="Generate response model schemas once per endpoint...",
            url="https://github.com/tiangolo/fastapi/issues/1001",
            difficulty=scanned.difficulty,
            difficulty_score=scanned.difficulty_score,
            required_skills=json.dumps(scanned.required_skills),
            labels=json.dumps(["enhancement", "performance"]),
            summary=scanned.summary,
            estimated_time=scanned.estimated_time,
            is_daily_challenge=True,
        )
        db.add(issue)
        db.commit()
        db.refresh(issue)
    print(f"[+] Issue saved: '{issue.title}' -> {issue.difficulty} (Score: {issue.difficulty_score})")

    # 4. Run Zero-Token SQL Matching
    print("\n[Step 3] Running Zero-Token Relational Matching Engine...")
    matched = MatchingService.get_matched_issues(db, user)
    print(f"[+] Found {len(matched)} matched issues for user:")
    for m in matched:
        print(f"    - [{m.difficulty.upper()} | {m.difficulty_score}pts] {m.title} ({m.repo_full_name})")

    # 5. Test Guidance Agent in Chat
    print("\n[Step 4] Guidance Agent mentoring contributor on issue...")
    guidance_agent = GuidanceAgent()
    response = guidance_agent.guide(
        repo_name=issue.repo_full_name,
        issue_title=issue.title,
        issue_body=issue.description,
        user_message="How can I cache the schema generation without modifying user endpoints?",
        chat_history=[ChatMessage(role="user", content="I want to work on this issue.")],
    )
    print(f"[+] Guidance: {response.guidance[:200]}...")
    print(f"[+] Suggested Steps: {len(response.suggested_steps)} steps")

    # 6. Simulate Completing Issue -> Points & Badges
    print("\n[Step 5] Completing contribution & awarding points + badges...")
    earned_pts = PointsService.calculate_solve_points(
        difficulty=issue.difficulty,
        is_daily=issue.is_daily_challenge,
        streak_days=user.streak_days,
    )
    PointsService.award_points(user, earned_pts)
    PointsService.update_streak(user, date.today())
    user.issues_solved += 1
    if issue.is_daily_challenge:
        user.daily_challenges_completed += 1

    # Record contribution
    contrib = Contribution(
        user_id=user.id,
        issue_id=issue.id,
        pr_url="https://github.com/tiangolo/fastapi/pull/9999",
        points_earned=earned_pts,
    )
    db.add(contrib)
    db.commit()

    new_badges = BadgeService.check_and_award_badges(db, user)
    print(f"[+] Points earned: +{earned_pts} pts (New total: {user.points} pts, Level {user.level})")
    print(f"[+] New Badges Earned: {new_badges}")

    db.close()
    print("\n" + "=" * 65)
    print("[+] FULL VECTR INTEGRATION TEST COMPLETED SUCCESSFULLY!")
    print("=" * 65)


if __name__ == "__main__":
    test_full_pipeline()

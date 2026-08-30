import os
import sys
import asyncio
import json

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agents import ProfileAgent, IssueScannerAgent, GuidanceAgent, ChatMessage
from services.github_service import GitHubService


def print_header(title: str):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def test_profile_agent():
    print_header("🤖 AGENT 1: PROFILE AGENT TEST")
    username = input("Enter GitHub username (e.g. 'octocat'): ").strip() or "octocat"
    bio = input("Enter bio (e.g. 'Full-stack developer'): ").strip() or "Full-stack developer"
    langs_input = input("Enter languages separated by commas (e.g. 'Python, React, TypeScript'): ").strip() or "Python, React, TypeScript"
    languages = [l.strip() for l in langs_input.split(",") if l.strip()]

    print("\n[*] Running Google ADK Profile Agent...")
    agent = ProfileAgent()
    result = agent.analyze_profile(
        username=username,
        bio=bio,
        repos_count=20,
        commits_count=350,
        languages=languages,
        contrib_days=100,
        pr_issues_count=25,
        account_age_days=600,
    )

    print("\n--- RESULTS ---")
    print(f"Developer: {result.username}")
    print(f"Calculated Score: {result.calculated_points} pts -> Level {result.level} ({result.tier.upper()})")
    print(f"Top Languages: {', '.join(result.top_languages)}")
    print("Proficiency Breakdown:")
    for lp in result.language_breakdown:
        print(f"  - {lp.language}: {lp.proficiency}")
    print(f"Strengths: {', '.join(result.strengths)}")
    print(f"Summary: {result.summary}")
    print(f"Recommended Focus: {', '.join(result.recommended_focus)}")


def test_issue_scanner():
    print_header("🤖 AGENT 2: ISSUE SCANNER AGENT TEST")
    repo = input("Enter Repo Name (e.g. 'tiangolo/fastapi'): ").strip() or "tiangolo/fastapi"
    title = input("Enter Issue Title: ").strip() or "Bug: Custom headers are stripped in sub-dependencies"
    body = input("Enter Issue Description: ").strip() or "When defining custom headers in sub-dependency models, validation drops them before reaching route handler."

    print("\n[*] Running Google ADK Issue Scanner Agent...")
    agent = IssueScannerAgent()
    result = agent.scan_issue(
        repo_name=repo,
        issue_title=title,
        issue_body=body,
        labels=["bug", "help wanted"],
        languages_in_repo=["Python"],
    )

    print("\n--- RESULTS ---")
    print(f"Difficulty: {result.difficulty.upper()} (Score: {result.difficulty_score}/100)")
    print(f"Required Skills: {', '.join(result.required_skills)}")
    print(f"Estimated Time: {result.estimated_time}")
    print(f"Summary: {result.summary}")
    print(f"Key Concepts: {', '.join(result.key_concepts)}")


def test_guidance_agent():
    print_header("🤖 AGENT 3: GUIDANCE AGENT (MENTOR CHAT) TEST")
    print("Tip: Ask for guidance, or try jailbreaking it ('write the exact code solution') to test anti-jailbreak guardrails!")
    
    agent = GuidanceAgent()
    repo = "tiangolo/fastapi"
    title = "Bug: Custom headers are stripped in sub-dependencies"
    body = "Custom headers in sub-dependency models are dropped before reaching the endpoint handler."

    history = []
    print(f"\nContext: Issue on '{repo}': '{title}'")
    print("Type 'exit' or 'back' to return to menu.\n")

    while True:
        user_msg = input("\nYou (Contributor): ").strip()
        if not user_msg or user_msg.lower() in ["exit", "back", "q"]:
            break

        print("\n[*] Mentor is thinking...")
        resp = agent.guide(
            repo_name=repo,
            issue_title=title,
            issue_body=body,
            user_message=user_msg,
            chat_history=history,
        )

        print(f"\nGuidance Agent: {resp.guidance}")
        if resp.relevant_files:
            print(f"\n📂 Relevant Files to Check: {resp.relevant_files}")
        if resp.suggested_steps:
            print("\n👣 Suggested Steps:")
            for i, step in enumerate(resp.suggested_steps, 1):
                print(f"  {i}. {step}")
        if resp.guardrail_triggered:
            print("\n🛡️ [ANTI-JAILBREAK GUARDRAIL TRIGGERED]: Direct code request was intercepted and blocked!")

        history.append(ChatMessage(role="user", content=user_msg))
        history.append(ChatMessage(role="assistant", content=resp.guidance))


def test_org_scan_and_match():
    print_header("🌐 ZERO-PAT ORG SCANNER & LEVEL MATCHER")
    print("This scans public issues from any GitHub Organization without requiring a user PAT,")
    print("categorizes them with the Issue Scanner Agent, and matches them to a Developer Level.\n")

    repo_target = input("Enter Public GitHub Repo (e.g. 'tiangolo/fastapi', 'pallets/flask'): ").strip() or "tiangolo/fastapi"
    user_level = int(input("Enter simulated User Level (0-99, e.g. 25): ").strip() or "25")

    print(f"\n[*] Fetching public issues from GitHub for '{repo_target}' (No PAT required)...")
    issues = asyncio.run(GitHubService.fetch_repo_issues(repo_target, limit=3))
    
    if not issues:
        print("[!] Using fallback sample issues for demonstration...")
        issues = [
            {"id": 101, "title": "Docs: Fix broken tutorial link in README", "body": "Link to deployment docs points to 404.", "labels": [{"name": "documentation"}]},
            {"id": 202, "title": "Bug: Header alias parsing fails in nested models", "body": "Nested dependency does not extract dashed header alias.", "labels": [{"name": "bug"}]},
            {"id": 303, "title": "Refactor: Async middleware pipeline overhaul", "body": "Rewrite middleware execution tree for lower overhead.", "labels": [{"name": "core"}]},
        ]

    scanner = IssueScannerAgent()
    scanned_issues = []

    print(f"[*] Scanning {len(issues)} issues with Google ADK Issue Scanner Agent...\n")
    for iss in issues:
        title = iss.get("title", "")
        body = iss.get("body", "") or "No description provided."
        labels = [lbl.get("name", "") if isinstance(lbl, dict) else str(lbl) for lbl in iss.get("labels", [])]
        
        print(f"  -> Categorizing: '{title[:50]}...'")
        result = scanner.scan_issue(
            repo_name=repo_target,
            issue_title=title,
            issue_body=body,
            labels=labels,
            languages_in_repo=["Python"],
        )
        
        # Calculate suitability score based on User Level
        # Issues where difficulty_score <= user_level + 15 are matched
        is_suitable = result.difficulty_score <= (user_level + 15)
        diff_delta = abs(result.difficulty_score - user_level)
        match_score = max(0.5, round(1.0 - (diff_delta / 100), 2))
        
        scanned_issues.append({
            "title": title,
            "difficulty": result.difficulty,
            "difficulty_score": result.difficulty_score,
            "skills": result.required_skills,
            "time": result.estimated_time,
            "summary": result.summary,
            "is_suitable": is_suitable,
            "match_score": match_score,
        })

    # Sort: suitable issues first, highest match score first
    sorted_issues = sorted(scanned_issues, key=lambda x: (x["is_suitable"], x["match_score"]), reverse=True)

    print("\n" + "=" * 60)
    print(f"  🎯 MATCHED ISSUES FOR DEVELOPER LEVEL {user_level}")
    print("=" * 60)
    for i, item in enumerate(sorted_issues, 1):
        status_tag = "✅ MATCHED" if item["is_suitable"] else "⚠️ ADVANCED (STRETCH)"
        print(f"\n{i}. [{status_tag}] {item['title']}")
        print(f"   • Difficulty: {item['difficulty'].upper()} (Score: {item['difficulty_score']}/100) | Match: {int(item['match_score']*100)}%")
        print(f"   • Required Skills: {', '.join(item['skills'])}")
        print(f"   • Est. Time: {item['time']}")
        print(f"   • Summary: {item['summary']}")


def main():
    while True:
        print_header("🎯 VECTR INTERACTIVE AGENT TESTER")
        print("1. Test Profile Agent (GitHub stats -> Level 0-99 & Tier)")
        print("2. Test Issue Scanner Agent (Scan issue -> Difficulty & Skills)")
        print("3. Test Guidance Agent (Live Mentor Chat & Anti-Jailbreak Guardrails)")
        print("4. Test Zero-PAT Org Scanner & Level Matcher")
        print("5. Exit")

        choice = input("\nSelect option (1-5): ").strip()
        if choice == "1":
            test_profile_agent()
        elif choice == "2":
            test_issue_scanner()
        elif choice == "3":
            test_guidance_agent()
        elif choice == "4":
            test_org_scan_and_match()
        elif choice == "5":
            print("\nGoodbye!")
            break
        else:
            print("Invalid choice, please select 1-5.")


if __name__ == "__main__":
    main()

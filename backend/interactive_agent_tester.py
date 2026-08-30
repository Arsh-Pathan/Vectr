import os
import sys

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agents import ProfileAgent, IssueScannerAgent, GuidanceAgent, ChatMessage


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

    print("\n[*] Running Profile Agent with Gemini...")
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

    print("\n[*] Running Issue Scanner Agent with Gemini...")
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


def main():
    while True:
        print_header("🎯 VECTR INTERACTIVE AGENT TESTER")
        print("1. Test Profile Agent (GitHub stats -> Level 0-99 & Tier)")
        print("2. Test Issue Scanner Agent (Scan issue -> Difficulty & Skills)")
        print("3. Test Guidance Agent (Live Mentor Chat & Anti-Jailbreak Guardrails)")
        print("4. Exit")

        choice = input("\nSelect option (1-4): ").strip()
        if choice == "1":
            test_profile_agent()
        elif choice == "2":
            test_issue_scanner()
        elif choice == "3":
            test_guidance_agent()
        elif choice == "4":
            print("\nGoodbye!")
            break
        else:
            print("Invalid choice, please select 1-4.")


if __name__ == "__main__":
    main()

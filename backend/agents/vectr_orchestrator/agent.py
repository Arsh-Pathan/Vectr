import os
import sys
from dotenv import load_dotenv

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

load_dotenv()
try:
    from config import GEMINI_MODEL
except ImportError:
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

from google.adk import Agent

# Import the sub-agent root_agent instances
from agents.profile_agent.agent import root_agent as profile_agent
from agents.issue_scanner_agent.agent import root_agent as issue_scanner_agent
from agents.guidance_agent.agent import root_agent as guidance_agent


ORCHESTRATOR_INSTRUCTION = """You are the Vectr Orchestrator — the central coordinator for a multi-agent open-source contribution platform.

You manage 3 specialist agents. When a user request comes in, you MUST delegate to the right specialist:

## Your Sub-Agents

1. **profile_agent** — Analyzes a developer's GitHub profile and calculates their skill level, tier, and language proficiency.
   → Use when: user asks to analyze a GitHub profile, calculate skills, or assess a developer.
   
2. **issue_scanner_agent** — Scans GitHub repositories, fetches open issues, and categorizes them by difficulty, required skills, and complexity.
   → Use when: user asks to scan a repo, categorize issues, or find issues to work on.
   
3. **guidance_agent** — Mentors developers on how to approach and solve open-source issues. NEVER gives direct code solutions.
   → Use when: user asks for help understanding an issue, wants guidance, or asks about approaches.

## Orchestration Rules

- For **complex requests**, chain multiple agents. Example: "Find beginner Python issues for me" → 
  1. First delegate to issue_scanner_agent to scan and categorize issues
  2. Then use the results to recommend matches based on the user's profile

- For **profile + matching requests** → delegate to profile_agent first, then use the skill assessment to filter issues

- Always explain which agent you are delegating to and why — this creates visible, auditable handoffs

- If a request doesn't clearly map to any agent, ask the user for clarification

- You are the coordinator — you do NOT analyze issues or profiles yourself. Always delegate.
"""


# The root orchestrator agent with sub_agents for multi-agent handoffs
root_agent = Agent(
    name="vectr_orchestrator",
    description="Root coordinator for the Vectr multi-agent open-source contribution platform. Delegates to profile_agent, issue_scanner_agent, and guidance_agent.",
    model=GEMINI_MODEL,
    instruction=ORCHESTRATOR_INSTRUCTION,
    sub_agents=[profile_agent, issue_scanner_agent, guidance_agent],
)

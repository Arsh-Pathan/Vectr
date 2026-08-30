import os
import sys
from typing import List, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

load_dotenv()
try:
    from config import GEMINI_API_KEY, GEMINI_MODEL
except ImportError:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

from google.adk import Agent
from google import genai
from google.genai import types


def points_to_level(points: int) -> int:
    """Convert total points to level (0-99) as defined in Vectr spec."""
    level = 0
    remaining = points

    # Beginner: levels 0-19, 10 pts each
    beginner_levels = min(20, remaining // 10)
    level += beginner_levels
    remaining -= beginner_levels * 10

    if level < 20:
        return level

    # Moderate: levels 20-49, 25 pts each
    moderate_levels = min(30, remaining // 25)
    level += moderate_levels
    remaining -= moderate_levels * 25

    if level < 50:
        return level

    # Advanced: levels 50-79, 50 pts each
    advanced_levels = min(30, remaining // 50)
    level += advanced_levels
    remaining -= advanced_levels * 50

    if level < 80:
        return level

    # Expert: levels 80-99, 100 pts each
    expert_levels = min(20, remaining // 100)
    level += expert_levels

    return min(level, 99)


def level_to_tier(level: int) -> str:
    """Convert level (0-99) to tier name."""
    if level < 20:
        return "beginner"
    elif level < 50:
        return "moderate"
    elif level < 80:
        return "advanced"
    else:
        return "expert"


class LanguageProficiency(BaseModel):
    """Language mastery item."""
    language: str = Field(description="Language name e.g. Python, TypeScript")
    proficiency: str = Field(description="Proficiency level: beginner, intermediate, advanced")


class ProfileAnalysisResult(BaseModel):
    """Structured output for developer GitHub profile analysis."""
    username: str = Field(description="GitHub username")
    calculated_points: int = Field(description="Initial points calculated from GitHub activity")
    level: int = Field(description="Skill level from 0 to 99")
    tier: str = Field(description="Developer tier: beginner, moderate, advanced, expert")
    top_languages: List[str] = Field(description="Top programming languages by proficiency")
    language_breakdown: List[LanguageProficiency] = Field(description="List of languages with proficiency levels")
    strengths: List[str] = Field(description="Key technical strengths and domain specialties")
    summary: str = Field(description="Concise 2-sentence assessment of their open-source profile")
    recommended_focus: List[str] = Field(description="Recommended issue tags/types to start contributing")


class ProfileAgent:
    """Agent 1: Google ADK Profile Analysis Agent."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or GEMINI_API_KEY
        self.model_name = model or GEMINI_MODEL
        
        # Instantiate Google ADK Agent
        self.adk_agent = Agent(
            name="profile_agent",
            description="Analyzes developer GitHub metadata and calculates skill score and proficiency",
            model=self.model_name,
            instruction="You are the Profile Analysis Agent for Vectr. Analyze a developer's GitHub profile data and calculate their skill assessment accurately.",
            output_schema=ProfileAnalysisResult,
        )
        self.client = genai.Client(api_key=self.api_key)

    def calculate_seed_points(
        self,
        repos: int,
        commits: int,
        languages_count: int,
        contrib_days: int,
        pr_issues: int,
        account_age_days: int,
    ) -> int:
        """Deterministic points formula per Vectr spec."""
        def norm(val: int, max_val: int) -> float:
            return min(val / max_val, 1.0) if max_val > 0 else 0.0

        normalized = (
            norm(repos, 100) * 0.15 +
            norm(commits, 1000) * 0.25 +
            norm(languages_count, 10) * 0.15 +
            norm(contrib_days, 365) * 0.20 +
            norm(pr_issues, 200) * 0.15 +
            norm(account_age_days, 3650) * 0.10
        )
        return int(normalized * 1500)

    def analyze_profile(
        self,
        username: str,
        repos_count: int,
        commits_count: int,
        languages: List[str],
        contrib_days: int = 0,
        pr_issues_count: int = 0,
        account_age_days: int = 365,
        bio: str = "",
        sample_repos: Optional[List[str]] = None,
    ) -> ProfileAnalysisResult:
        """Analyze GitHub stats using deterministic points + ADK structured insights."""
        points = self.calculate_seed_points(
            repos=repos_count,
            commits=commits_count,
            languages_count=len(languages),
            contrib_days=contrib_days,
            pr_issues=pr_issues_count,
            account_age_days=account_age_days,
        )
        level = points_to_level(points)
        tier = level_to_tier(level)

        prompt = f"""
Analyze the following developer profile data:
- Username: {username}
- Bio: {bio}
- Public Repos: {repos_count}
- Commits (last year): {commits_count}
- Languages: {', '.join(languages)}
- Contribution Days: {contrib_days}
- PRs & Issues Count: {pr_issues_count}
- Account Age: {account_age_days} days
- Sample Repos: {', '.join(sample_repos or [])}
- Calculated Score: {points} points -> Level {level} ({tier})

Return a structured profile assessment with:
- Top languages ordered by competence
- Language proficiency list (beginner, intermediate, advanced)
- Key developer strengths
- 2-sentence summary
- Recommended issue tags/focus areas for open source contributions.
"""

        response = self.client.models.generate_content(
            model=self.adk_agent.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=self.adk_agent.output_schema,
                system_instruction=self.adk_agent.instruction,
            ),
        )
        
        result: ProfileAnalysisResult = response.parsed
        result.username = username
        result.calculated_points = points
        result.level = level
        result.tier = tier
        return result

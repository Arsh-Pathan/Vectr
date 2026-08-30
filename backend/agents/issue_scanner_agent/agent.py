import os
import sys
from typing import List, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
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


class IssueAnalysisResult(BaseModel):
    """Structured output for open-source GitHub issue categorization."""
    difficulty: str = Field(description="Difficulty tier: beginner, moderate, or advanced")
    difficulty_score: int = Field(description="Numeric difficulty rating from 1 (trivial) to 100 (expert-level architectural change)")
    required_skills: List[str] = Field(description="Programming languages, frameworks, and libraries required")
    summary: str = Field(description="Clear, 1-2 sentence summary of what the issue actually asks for")
    estimated_time: str = Field(description="Realistic estimated resolution time (e.g. '30-60 mins', '2-4 hours')")
    key_concepts: List[str] = Field(description="Core concepts needed to understand the issue")
    suggested_prerequisites: List[str] = Field(description="Prerequisite knowledge or setup needed")


# ADK root_agent exposed for ADK Web UI / Runner
root_agent = Agent(
    name="issue_scanner_agent",
    description="Scans GitHub repositories and categorizes open issues by difficulty, skills, and complexity",
    model=GEMINI_MODEL,
    instruction="You are the Issue Scanner Agent for Vectr. Accurately categorize GitHub issues by difficulty (beginner/moderate/advanced), difficulty_score (1-100), required skills, and estimated time.",
    output_schema=IssueAnalysisResult,
)


class IssueScannerAgent:
    """Agent 2: Google ADK Issue Scanner Agent."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or GEMINI_API_KEY
        self.model_name = model or GEMINI_MODEL
        self.adk_agent = root_agent
        self.client = genai.Client(api_key=self.api_key)

    def scan_issue(
        self,
        repo_name: str,
        issue_title: str,
        issue_body: str,
        labels: Optional[List[str]] = None,
        languages_in_repo: Optional[List[str]] = None,
    ) -> IssueAnalysisResult:
        """Scan and categorize an open source issue."""
        labels_str = ", ".join(labels) if labels else "None"
        repo_langs = ", ".join(languages_in_repo) if languages_in_repo else "Unknown"

        prompt = f"""
Analyze this GitHub issue from repository '{repo_name}':

- Repo Main Languages: {repo_langs}
- Issue Title: {issue_title}
- Issue Labels: {labels_str}
- Issue Body:
{issue_body[:3000]}

Categorization Guidelines:
- 'beginner': Good first issues, typos, docs, small bug fixes, adding tests, difficulty_score 1-25.
- 'moderate': Feature extensions, refactoring, API integrations, multi-file changes, difficulty_score 26-65.
- 'advanced': Core architectural redesign, concurrency/memory bugs, major performance optimization, compiler/parser internals, difficulty_score 66-100.

Return the JSON matching the required schema.
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
        return response.parsed

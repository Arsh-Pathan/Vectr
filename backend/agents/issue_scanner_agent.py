from typing import List, Optional
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from config import GEMINI_API_KEY, GEMINI_MODEL


class IssueAnalysisResult(BaseModel):
    """Structured output for open-source GitHub issue categorization."""
    difficulty: str = Field(description="Difficulty tier: beginner, moderate, or advanced")
    difficulty_score: int = Field(description="Numeric difficulty rating from 1 (trivial) to 100 (expert-level architectural change)")
    required_skills: List[str] = Field(description="Programming languages, frameworks, and libraries required")
    summary: str = Field(description="Clear, 1-2 sentence summary of what the issue actually asks for")
    estimated_time: str = Field(description="Realistic estimated resolution time (e.g. '30-60 mins', '2-4 hours')")
    key_concepts: List[str] = Field(description="Core concepts needed to understand the issue")
    suggested_prerequisites: List[str] = Field(description="Prerequisite knowledge or setup needed")


class IssueScannerAgent:
    """Agent 2: Analyzes GitHub issues to assign difficulty, skills, and complexity metrics."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or GEMINI_API_KEY
        self.model = model or GEMINI_MODEL
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
You are the Issue Scanner Agent for Vectr.
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
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=IssueAnalysisResult,
                system_instruction="You are Vectr's Issue Scanner Agent. Accurately categorize GitHub issues by difficulty, skills, and workload.",
            ),
        )
        return response.parsed

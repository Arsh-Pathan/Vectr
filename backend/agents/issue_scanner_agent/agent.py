import os
import sys
import httpx
from typing import List, Optional, Dict, Any
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


def fetch_issue_comments(repo_full_name: str, issue_number: int) -> str:
    """ADK Tool: Fetches discussion comment thread for a GitHub issue to judge real complexity."""
    url = f"https://api.github.com/repos/{repo_full_name}/issues/{issue_number}/comments?per_page=5"
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "Vectr-Platform/1.0"}
    try:
        resp = httpx.get(url, headers=headers, timeout=5.0)
        if resp.status_code == 200:
            comments = resp.json()
            formatted = [f"Comment by @{c['user']['login']}: {c['body'][:200]}" for c in comments]
            return "\n".join(formatted) if formatted else "No discussion comments found."
    except Exception as e:
        return f"Could not fetch comments: {str(e)}"
    return "No comments available."


def fetch_repo_issues_tool(repo_full_name: str, max_issues: int = 15) -> str:
    """ADK Tool: Fetches open issues from a GitHub repository for categorization."""
    url = f"https://api.github.com/repos/{repo_full_name}/issues?state=open&per_page={min(max_issues, 30)}"
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "Vectr-Platform/1.0"}
    try:
        resp = httpx.get(url, headers=headers, timeout=10.0)
        if resp.status_code != 200:
            return f"Failed to fetch issues from {repo_full_name}: HTTP {resp.status_code}"
        raw_issues = resp.json()
        # Filter out pull requests
        issues = [i for i in raw_issues if "pull_request" not in i]
        if not issues:
            return f"No open issues found in {repo_full_name}."

        formatted = []
        for iss in issues[:max_issues]:
            labels = ", ".join([lbl.get("name", "") for lbl in iss.get("labels", [])])
            body_preview = (iss.get("body") or "")[:300]
            formatted.append(
                f"Issue #{iss['number']}: {iss['title']}\n"
                f"  Labels: {labels or 'none'}\n"
                f"  Body: {body_preview}\n"
            )
        return f"Found {len(issues)} open issues in {repo_full_name}:\n\n" + "\n---\n".join(formatted)
    except Exception as e:
        return f"Error fetching issues from {repo_full_name}: {str(e)}"


def embed_issues_tool(repo_full_name: str) -> str:
    """ADK Tool: Generates vector embeddings for all issues in the database from a given repository."""
    try:
        # Import lazily to avoid circular imports
        import sys
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        if backend_dir not in sys.path:
            sys.path.insert(0, backend_dir)
        from database import SessionLocal
        from services.vector_service import VectorService
        from models import Issue

        db = SessionLocal()
        try:
            issues = db.query(Issue).filter(Issue.repo_full_name == repo_full_name).all()
            if not issues:
                return f"No issues found in database for {repo_full_name}. Scan issues first."

            embedded_count = 0
            for issue in issues:
                try:
                    VectorService.embed_and_store(db, issue.id, issue.title, issue.description)
                    embedded_count += 1
                except Exception as e:
                    continue

            return f"Successfully embedded {embedded_count}/{len(issues)} issues from {repo_full_name}."
        finally:
            db.close()
    except Exception as e:
        return f"Error embedding issues: {str(e)}"


class IssueAnalysisResult(BaseModel):
    """Structured output for open-source GitHub issue categorization."""
    issue_id: Optional[int] = Field(default=None, description="GitHub issue ID or number")
    difficulty: str = Field(description="Difficulty tier: beginner, moderate, or advanced")
    difficulty_score: int = Field(description="Numeric difficulty rating from 1 (trivial) to 100 (expert-level architectural change)")
    required_skills: List[str] = Field(description="Programming languages, frameworks, and libraries required")
    summary: str = Field(description="Clear, 1-2 sentence summary of what the issue actually asks for")
    estimated_time: str = Field(description="Realistic estimated resolution time (e.g. '30-60 mins', '2-4 hours')")
    key_concepts: List[str] = Field(description="Core concepts needed to understand the issue")
    matched_signals: List[str] = Field(default_factory=list, description="Auditable technical signals detected in issue body or comments")
    confidence: float = Field(default=0.9, description="Confidence score between 0.0 and 1.0")
    reasoning: str = Field(default="", description="Auditable step-by-step reasoning explaining why this difficulty score was assigned")


class BatchIssueAnalysisResult(BaseModel):
    """Batched structured output for multiple GitHub issues in a single LLM call."""
    issues: List[IssueAnalysisResult] = Field(description="Array of categorized issues")


# ADK root_agent exposed for ADK Web UI / Runner
root_agent = Agent(
    name="issue_scanner_agent",
    description="Scans GitHub repositories and categorizes open issues by difficulty, skills, and complexity with tool execution",
    model=GEMINI_MODEL,
    instruction="You are the Issue Scanner Agent for Vectr. Accurately categorize GitHub issues by difficulty (beginner/moderate/advanced), difficulty_score (1-100), required skills, and provide auditable reasoning signals. Use fetch_repo_issues_tool to retrieve issues from a repo, fetch_issue_comments for deeper analysis, and embed_issues_tool to generate vector embeddings after scanning.",
    output_schema=IssueAnalysisResult,
    tools=[fetch_issue_comments, fetch_repo_issues_tool, embed_issues_tool],
)


class IssueScannerAgent:
    """Agent 2: Google ADK Issue Scanner Agent with Batched Categorization & Auditable Reasoning."""

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
        issue_number: Optional[int] = None,
    ) -> IssueAnalysisResult:
        """Scan and categorize a single open source issue with auditable signals."""
        labels_str = ", ".join(labels) if labels else "None"
        repo_langs = ", ".join(languages_in_repo) if languages_in_repo else "Unknown"

        comments_ctx = ""
        if issue_number and "/" in repo_name:
            comments_ctx = f"\n- Discussion Thread Comments:\n{fetch_issue_comments(repo_name, issue_number)}"

        prompt = f"""
Analyze this GitHub issue from repository '{repo_name}':

- Repo Main Languages: {repo_langs}
- Issue Title: {issue_title}
- Issue Labels: {labels_str}
- Issue Body:
{issue_body[:3000]}
{comments_ctx}

Categorization Guidelines:
- 'beginner': Good first issues, typos, docs, small bug fixes, adding tests, difficulty_score 1-25.
- 'moderate': Feature extensions, refactoring, API integrations, multi-file changes, difficulty_score 26-65.
- 'advanced': Core architectural redesign, concurrency/memory bugs, major performance optimization, compiler/parser internals, difficulty_score 66-100.

Return structured JSON with difficulty, score, required_skills, matched_signals, confidence, and step-by-step reasoning.
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

    def scan_issue_batch(
        self,
        repo_name: str,
        issues_list: List[Dict[str, Any]],
        languages_in_repo: Optional[List[str]] = None,
    ) -> List[IssueAnalysisResult]:
        """Batched categorization: scans up to 20 candidate issues in a SINGLE Gemini API call."""
        if not issues_list:
            return []

        repo_langs = ", ".join(languages_in_repo) if languages_in_repo else "Unknown"
        
        formatted_issues = []
        for i, iss in enumerate(issues_list, 1):
            iss_id = iss.get("id") or iss.get("number") or i
            title = iss.get("title", "")
            body = (iss.get("body") or "")[:500]
            labels = ", ".join([lbl.get("name", "") if isinstance(lbl, dict) else str(lbl) for lbl in iss.get("labels", [])])
            formatted_issues.append(f"Issue #{iss_id} - Title: {title}\nLabels: {labels}\nBody: {body}\n")

        batch_prompt = f"""
Analyze and categorize the following candidate GitHub issues from repository '{repo_name}' (Languages: {repo_langs}):

{"---".join(formatted_issues)}

Instructions:
Categorize each issue in the list according to difficulty (beginner/moderate/advanced), score (1-100), required_skills, matched_signals, confidence, and reasoning.
Return a single JSON object containing an array of categorized issues matching BatchIssueAnalysisResult schema.
"""

        response = self.client.models.generate_content(
            model=self.adk_agent.model,
            contents=batch_prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=BatchIssueAnalysisResult,
                system_instruction=self.adk_agent.instruction,
            ),
        )
        
        batch_result: BatchIssueAnalysisResult = response.parsed
        return batch_result.issues

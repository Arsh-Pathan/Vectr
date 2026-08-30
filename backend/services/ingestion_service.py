"""Issue Ingestion Service — scans GitHub orgs/repos and ingests real issues into SQLite + ChromaDB."""
import json
import logging
from typing import List, Dict, Any

from sqlalchemy.orm import Session

from models import Issue, Project
from services.github_service import GitHubService
from services.vector_service import VectorService

logger = logging.getLogger(__name__)

# Label-based difficulty heuristics
BEGINNER_LABELS = {"good first issue", "good-first-issue", "beginner", "easy", "starter", "first-timers-only", "help wanted"}
MODERATE_LABELS = {"enhancement", "feature", "moderate", "medium", "improvement"}
ADVANCED_LABELS = {"bug", "complex", "hard", "advanced", "performance", "refactor", "architecture"}


def classify_difficulty(labels: List[str], body_length: int = 0) -> tuple:
    """Classify issue difficulty from labels and body length. Returns (difficulty, score)."""
    label_set = {l.lower().strip() for l in labels}

    if label_set & BEGINNER_LABELS:
        return "beginner", 20
    elif label_set & ADVANCED_LABELS:
        return "advanced", 70
    elif label_set & MODERATE_LABELS:
        return "moderate", 45

    # Heuristic: longer issue bodies tend to be more complex
    if body_length > 2000:
        return "moderate", 50
    elif body_length > 500:
        return "moderate", 35
    else:
        return "beginner", 25


def extract_skills_from_labels(labels: List[str], repo_language: str = "") -> List[str]:
    """Extract skill tags from issue labels + repo primary language."""
    skills = []
    if repo_language:
        skills.append(repo_language)

    LANG_KEYWORDS = {
        "python", "javascript", "typescript", "react", "vue", "angular", "node",
        "go", "rust", "java", "kotlin", "swift", "ruby", "php", "css", "html",
        "docker", "kubernetes", "sql", "graphql", "api", "testing", "ci/cd",
        "security", "frontend", "backend", "fullstack", "ml", "ai", "docs",
    }
    for label in labels:
        lower = label.lower().strip()
        if lower in LANG_KEYWORDS:
            skills.append(lower.title())

    return list(set(skills)) if skills else ["General"]


async def ingest_org_issues(
    db: Session,
    org_name: str,
    max_repos: int = 10,
    max_issues_per_repo: int = 10,
) -> Dict[str, Any]:
    """Scan a GitHub org's repos, fetch open issues, score them, and store in SQLite + ChromaDB."""
    logger.info(f"Starting issue ingestion for org: {org_name}")

    repos = await GitHubService.fetch_org_repositories(org_name, limit=max_repos)
    if not repos:
        logger.warning(f"No repos found for org: {org_name}")
        return {"repos_scanned": 0, "issues_ingested": 0}

    total_ingested = 0
    vector_batch = []

    for repo in repos:
        repo_full_name = repo.get("full_name", "")
        repo_language = repo.get("language", "") or ""

        if not repo_full_name:
            continue

        raw_issues = await GitHubService.fetch_repo_issues(repo_full_name, limit=max_issues_per_repo)

        for gh_issue in raw_issues:
            gh_id = gh_issue.get("number", 0)
            title = gh_issue.get("title", "")
            body = gh_issue.get("body", "") or ""
            url = gh_issue.get("html_url", "")
            label_names = [l.get("name", "") for l in gh_issue.get("labels", [])]

            # Skip if already exists
            existing = db.query(Issue).filter(
                Issue.repo_full_name == repo_full_name,
                Issue.github_issue_id == gh_id,
            ).first()
            if existing:
                continue

            difficulty, difficulty_score = classify_difficulty(label_names, len(body))
            skills = extract_skills_from_labels(label_names, repo_language)

            issue = Issue(
                github_issue_id=gh_id,
                repo_full_name=repo_full_name,
                title=title,
                description=body[:2000],  # Truncate very long bodies
                url=url,
                difficulty=difficulty,
                difficulty_score=difficulty_score,
                required_skills=json.dumps(skills),
                labels=json.dumps(label_names),
                summary=f"{title} ({', '.join(label_names[:3])})" if label_names else title,
                estimated_time="1-2 hours",
                is_daily_challenge=False,
            )
            db.add(issue)
            db.flush()  # Get the ID

            # Prepare for vector DB
            vector_batch.append({
                "id": issue.id,
                "title": title,
                "description": body[:1000],
                "skills": skills,
                "labels": label_names,
                "difficulty": difficulty,
                "difficulty_score": difficulty_score,
                "repo": repo_full_name,
            })

            total_ingested += 1

    db.commit()

    # Batch upsert to vector DB
    if vector_batch:
        VectorService.upsert_issues(vector_batch)

    logger.info(f"Ingestion complete: {len(repos)} repos scanned, {total_ingested} issues ingested")
    return {"repos_scanned": len(repos), "issues_ingested": total_ingested}


async def ingest_repo_issues(
    db: Session,
    repo_full_name: str,
    max_issues: int = 20,
) -> Dict[str, Any]:
    """Scan a single repo and ingest its open issues."""
    raw_issues = await GitHubService.fetch_repo_issues(repo_full_name, limit=max_issues)
    total_ingested = 0
    vector_batch = []

    for gh_issue in raw_issues:
        gh_id = gh_issue.get("number", 0)
        title = gh_issue.get("title", "")
        body = gh_issue.get("body", "") or ""
        url = gh_issue.get("html_url", "")
        label_names = [l.get("name", "") for l in gh_issue.get("labels", [])]

        existing = db.query(Issue).filter(
            Issue.repo_full_name == repo_full_name,
            Issue.github_issue_id == gh_id,
        ).first()
        if existing:
            continue

        difficulty, difficulty_score = classify_difficulty(label_names, len(body))
        skills = extract_skills_from_labels(label_names, "")

        issue = Issue(
            github_issue_id=gh_id,
            repo_full_name=repo_full_name,
            title=title,
            description=body[:2000],
            url=url,
            difficulty=difficulty,
            difficulty_score=difficulty_score,
            required_skills=json.dumps(skills),
            labels=json.dumps(label_names),
            summary=f"{title} ({', '.join(label_names[:3])})" if label_names else title,
            estimated_time="1-2 hours",
            is_daily_challenge=False,
        )
        db.add(issue)
        db.flush()

        vector_batch.append({
            "id": issue.id,
            "title": title,
            "description": body[:1000],
            "skills": skills,
            "labels": label_names,
            "difficulty": difficulty,
            "difficulty_score": difficulty_score,
            "repo": repo_full_name,
        })
        total_ingested += 1

    db.commit()

    if vector_batch:
        VectorService.upsert_issues(vector_batch)

    return {"issues_ingested": total_ingested}

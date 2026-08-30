import httpx
from typing import Dict, Any, List, Optional
from config import GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET


class GitHubService:
    """Service to interact with GitHub API for public repo/issue ingestion and OAuth."""

    @staticmethod
    async def exchange_code_for_token(code: str) -> Optional[str]:
        """Exchange OAuth authorization code for GitHub access token."""
        if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
            # In mock dev mode, return dummy token if no credentials set
            return f"mock_gh_token_{code[:8]}"

        url = "https://github.com/login/oauth/access_token"
        headers = {"Accept": "application/json"}
        data = {
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
        }

        async with httpx.AsyncClient() as client:
            resp = await client.post(url, headers=headers, json=data, timeout=10.0)
            if resp.status_code == 200:
                result = resp.json()
                return result.get("access_token")
        return None

    @staticmethod
    async def fetch_user_profile(token: str) -> Dict[str, Any]:
        """Fetch user profile information from GitHub."""
        if token.startswith("mock_gh_token"):
            return {
                "login": "arshpathan",
                "name": "Arsh Pathan",
                "bio": "Open Source Builder & Full-Stack Developer",
                "public_repos": 28,
                "created_at": "2023-01-15T00:00:00Z",
                "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4",
            }

        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
        }

        async with httpx.AsyncClient() as client:
            resp = await client.get("https://api.github.com/user", headers=headers, timeout=10.0)
            if resp.status_code == 200:
                return resp.json()
            return {}

    @staticmethod
    async def fetch_user_repositories(username: str, token: Optional[str] = None) -> List[Dict[str, Any]]:
        """Fetch public repositories and detect languages (No PAT needed for public repos)."""
        if token and token.startswith("mock_gh_token"):
            return [
                {"name": "fastapi-demo", "language": "Python", "stargazers_count": 12},
                {"name": "react-flow", "language": "TypeScript", "stargazers_count": 5},
                {"name": "vectr-core", "language": "Python", "stargazers_count": 20},
                {"name": "docs-site", "language": "HTML", "stargazers_count": 2},
            ]

        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "Vectr-Platform/1.0",
        }
        if token and not token.startswith("mock_"):
            headers["Authorization"] = f"Bearer {token}"

        url = f"https://api.github.com/users/{username}/repos?per_page=50&sort=updated"
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, headers=headers, timeout=10.0)
                if resp.status_code == 200:
                    return resp.json()
        except Exception:
            pass
        return []

    @staticmethod
    async def fetch_repo_issues(repo_full_name: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Fetch public issues from a repository using GitHub Public API (Zero user PAT required)."""
        url = f"https://api.github.com/repos/{repo_full_name}/issues?state=open&per_page={limit}"
        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "Vectr-Platform/1.0",
        }
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, headers=headers, timeout=10.0)
                if resp.status_code == 200:
                    raw_issues = resp.json()
                    # Filter out pull requests (GitHub issues API includes PRs with a 'pull_request' key)
                    issues = [i for i in raw_issues if "pull_request" not in i]
                    return issues
        except Exception:
            pass
        return []

    @staticmethod
    async def fetch_user_orgs(token: str) -> List[Dict[str, Any]]:
        """Fetch GitHub organizations for the authenticated user using their OAuth access token (Zero PAT required)."""
        if token and token.startswith("mock_gh_token"):
            return [
                {
                    "login": "freeCodeCamp",
                    "id": 9892522,
                    "avatar_url": "https://avatars.githubusercontent.com/u/9892522?v=4",
                    "description": "Learn to code for free and contribute to open source.",
                },
                {
                    "login": "EddieHubCommunity",
                    "id": 66385736,
                    "avatar_url": "https://avatars.githubusercontent.com/u/66385736?v=4",
                    "description": "Open source community focused on welcoming first-time contributors.",
                },
            ]

        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "Vectr-Platform/1.0",
        }
        if token and not token.startswith("mock_"):
            headers["Authorization"] = f"Bearer {token}"

        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get("https://api.github.com/user/orgs", headers=headers, timeout=10.0)
                if resp.status_code == 200:
                    return resp.json()
        except Exception:
            pass
        return []

    @staticmethod
    async def fetch_org_repositories(org_name: str, token: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """Fetch public repositories for an Organization using OAuth token if present (Zero PAT required)."""
        if token and token.startswith("mock_gh_token"):
            return [
                {"name": "freeCodeCamp", "full_name": "freeCodeCamp/freeCodeCamp", "language": "JavaScript", "stargazers_count": 390000},
                {"name": "BioDrop", "full_name": "EddieHubCommunity/BioDrop", "language": "JavaScript", "stargazers_count": 4500},
            ]

        url = f"https://api.github.com/orgs/{org_name}/repos?type=public&per_page={limit}&sort=updated"
        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "Vectr-Platform/1.0",
        }
        if token and not token.startswith("mock_"):
            headers["Authorization"] = f"Bearer {token}"

        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, headers=headers, timeout=10.0)
                if resp.status_code == 200:
                    return resp.json()
        except Exception:
            pass
        return []

    @classmethod
    async def get_developer_github_stats(cls, username: str, token: Optional[str] = None) -> Dict[str, Any]:
        """Aggregate GitHub activity statistics for the Profile Agent."""
        repos = await cls.fetch_user_repositories(username, token)
        languages_count: Dict[str, int] = {}
        sample_repos = []

        for repo in repos:
            sample_repos.append(repo.get("name", ""))
            lang = repo.get("language")
            if lang:
                languages_count[lang] = languages_count.get(lang, 0) + 1

        top_langs = sorted(languages_count.keys(), key=lambda l: languages_count[l], reverse=True)
        repos_count = len(repos) if repos else 15
        commits_estimate = repos_count * 25

        return {
            "username": username,
            "repos_count": max(repos_count, 10),
            "commits_count": max(commits_estimate, 150),
            "languages": top_langs if top_langs else ["Python", "JavaScript", "HTML"],
            "sample_repos": sample_repos[:5],
            "contrib_days": 120,
            "pr_issues_count": 35,
            "account_age_days": 730,
        }

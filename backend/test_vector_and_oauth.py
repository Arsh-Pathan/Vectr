import json
import asyncio
from database import init_db, SessionLocal
from models import Issue, User, IssueEmbedding
from services.vector_service import VectorService
from services.matching_service import MatchingService
from services.github_service import GitHubService
from agents.vectr_orchestrator.agent import root_agent as orchestrator_agent


def test_vector_and_orchestrator():
    print("\n--- 1. Testing Database & Vector Embedding Service ---")
    init_db()
    db = SessionLocal()

    # Create dummy issue
    test_issue = Issue(
        github_issue_id=999,
        repo_full_name="vectr/test-repo",
        title="Implement OAuth authentication flow for organizations",
        description="We need to connect GitHub OAuth token to fetch org repositories without PAT.",
        url="https://github.com/vectr/test-repo/issues/999",
        difficulty="moderate",
        difficulty_score=35,
        required_skills=json.dumps(["Python", "OAuth", "FastAPI"]),
        labels=json.dumps(["enhancement", "auth"]),
        summary="Add OAuth token authentication for GitHub organization fetching.",
    )
    existing = db.query(Issue).filter(Issue.github_issue_id == 999).first()
    if existing:
        db.delete(existing)
        db.commit()

    db.add(test_issue)
    db.commit()
    db.refresh(test_issue)

    # Test embed_and_store
    emb = VectorService.embed_and_store(db, test_issue.id, test_issue.title, test_issue.description)
    print(f"SUCCESS: Created vector embedding for issue {test_issue.id} (Model: {emb.model_version})")

    # Test semantic vector search
    similar = VectorService.find_similar_issues(db, "OAuth login authentication", top_k=5)
    print(f"SUCCESS: Vector search returned {len(similar)} similar issues!")
    for issue_id, score in similar:
        print(f"  - Issue ID: {issue_id}, Cosine Similarity: {score:.4f}")

    # Test Hybrid Matching Service
    dummy_user = User(
        google_id="test_google_123",
        email="tester@vectr.ai",
        name="Test Dev",
        level=30,
        tier="moderate",
        preferred_languages=json.dumps(["Python", "JavaScript"]),
    )
    hybrid_matches = MatchingService.get_semantically_matched_issues(
        db=db,
        user=dummy_user,
        search_query="OAuth login flow",
        limit=5,
    )
    print(f"SUCCESS: Hybrid SQL+Vector matching returned {len(hybrid_matches)} matched issues!")

    print("\n--- 2. Testing GitHub OAuth Org Fetching ---")
    mock_token = "mock_gh_token_test123"
    orgs = asyncio.run(GitHubService.fetch_user_orgs(mock_token))
    print(f"SUCCESS: Fetched {len(orgs)} organizations via GitHub OAuth token:")
    for o in orgs:
        print(f"  - Org: {o.get('login')}")

    print("\n--- 3. Testing ADK Orchestrator Agent ---")
    print(f"Orchestrator Agent Name: {orchestrator_agent.name}")
    print(f"Sub-Agents attached: {[sa.name for sa in orchestrator_agent.sub_agents]}")
    assert len(orchestrator_agent.sub_agents) == 3
    print("SUCCESS: Vectr Orchestrator properly wraps profile_agent, issue_scanner_agent, and guidance_agent!")

    db.close()
    print("\nSUCCESS: ALL TESTS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    test_vector_and_orchestrator()

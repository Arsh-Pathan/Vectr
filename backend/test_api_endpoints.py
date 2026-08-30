import os
import sys
from fastapi.testclient import TestClient

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app

client = TestClient(app)


def test_api_contract_endpoints():
    print("=" * 65)
    print("[*] TESTING VECTR REST API CONTRACT COMPLIANCE")
    print("=" * 65)

    # 1. Root & Health
    r = client.get("/")
    assert r.status_code == 200
    print("[+] GET /: 200 OK")

    r = client.get("/api/health")
    assert r.status_code == 200
    print("[+] GET /api/health: 200 OK")

    # 2. POST /api/auth/google
    auth_resp = client.post("/api/auth/google", json={"token": "mock_google_token_12345"})
    assert auth_resp.status_code == 200
    auth_data = auth_resp.json()
    assert "access_token" in auth_data
    assert "user" in auth_data
    token = auth_data["access_token"]
    user_id = auth_data["user"]["id"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"[+] POST /api/auth/google: 200 OK (Token issued for user: {user_id})")

    # 3. GET /api/developer/profile
    prof_resp = client.get("/api/developer/profile", headers=headers)
    assert prof_resp.status_code == 200
    prof_data = prof_resp.json()
    assert prof_data["id"] == user_id
    assert "level" in prof_data
    assert "tier" in prof_data
    print(f"[+] GET /api/developer/profile: 200 OK (Level: {prof_data['level']}, Tier: {prof_data['tier']})")

    # 4. POST /api/developer/preferences
    pref_resp = client.post(
        "/api/developer/preferences",
        headers=headers,
        json={
            "languages": [
                {"language": "Python", "proficiency": "intermediate"},
                {"language": "JavaScript", "proficiency": "beginner"},
            ]
        },
    )
    assert pref_resp.status_code == 200
    print("[+] POST /api/developer/preferences: 200 OK")

    # 5. GET /api/developer/badges
    badge_resp = client.get("/api/developer/badges", headers=headers)
    assert badge_resp.status_code == 200
    badges_data = badge_resp.json()
    assert len(badges_data["badges"]) == 8
    print(f"[+] GET /api/developer/badges: 200 OK ({len(badges_data['badges'])} badges tracked)")

    # 6. GET /api/developer/stats
    stats_resp = client.get("/api/developer/stats", headers=headers)
    assert stats_resp.status_code == 200
    print("[+] GET /api/developer/stats: 200 OK")

    # 7. GET /api/issues
    issues_resp = client.get("/api/issues", headers=headers)
    assert issues_resp.status_code == 200
    issues_data = issues_resp.json()
    assert "issues" in issues_data
    print(f"[+] GET /api/issues: 200 OK ({len(issues_data['issues'])} matched issues returned)")

    # 8. GET /api/issues/daily
    daily_resp = client.get("/api/issues/daily", headers=headers)
    assert daily_resp.status_code == 200
    daily_data = daily_resp.json()
    daily_issue_id = daily_data["id"]
    print(f"[+] GET /api/issues/daily: 200 OK ('{daily_data['title']}')")

    # 9. POST /api/issues/{id}/complete
    complete_resp = client.post(
        f"/api/issues/{daily_issue_id}/complete",
        headers=headers,
        json={"pr_url": "https://github.com/freeCodeCamp/freeCodeCamp/pull/999"},
    )
    assert complete_resp.status_code == 200
    comp_data = complete_resp.json()
    assert "points_earned" in comp_data
    assert "new_total_points" in comp_data
    print(f"[+] POST /api/issues/{daily_issue_id}/complete: 200 OK (+{comp_data['points_earned']} pts, Level {comp_data['new_level']})")

    # 10. POST /api/org/register & /api/org/projects
    org_resp = client.post(
        "/api/org/register",
        json={
            "name": "GeminiBuilders",
            "github_org_url": "https://github.com/geminibuilders",
            "contact_email": "team@gemini.build",
            "description": "Building next-gen AI open source apps",
        },
    )
    assert org_resp.status_code == 201
    org_id = org_resp.json()["id"]
    print(f"[+] POST /api/org/register: 201 Created (Org ID: {org_id})")

    proj_resp = client.post(
        "/api/org/projects",
        json={
            "organization_id": org_id,
            "repo_full_name": "geminibuilders/agent-kit",
            "repo_url": "https://github.com/geminibuilders/agent-kit",
        },
    )
    assert proj_resp.status_code == 201
    print("[+] POST /api/org/projects: 201 Created")

    dash_resp = client.get(f"/api/org/dashboard?org_id={org_id}")
    assert dash_resp.status_code == 200
    print("[+] GET /api/org/dashboard: 200 OK")

    print("\n" + "=" * 65)
    print("[+] ALL API CONTRACT ENDPOINTS TESTED AND VERIFIED!")
    print("=" * 65)


if __name__ == "__main__":
    test_api_contract_endpoints()

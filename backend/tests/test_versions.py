"""Tests for versioning endpoints — /api/prompts/{id}/versions/*."""

BASE_PROMPT = {
    "title": "Version Test Prompt",
    "description": "Testing version creation and diff",
    "content": "Version 1: Hello world.",
    "is_public": False,
}


def create_prompt(client, auth_headers):
    """Helper to create a prompt and return its data."""
    return client.post("/api/prompts/", json=BASE_PROMPT, headers=auth_headers).json()


class TestCreateVersion:
    """POST /api/prompts/{id}/versions"""

    def test_create_version(self, client, auth_headers):
        """Should create a new version with auto-incremented number."""
        prompt = create_prompt(client, auth_headers)
        resp = client.post(
            f"/api/prompts/{prompt['id']}/versions",
            json={
                "content": "Version 2: Improved prompt.",
                "message": "Improved wording",
                "model_tested": "gpt-4",
            },
            headers=auth_headers,
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["version_number"] == 2
        assert data["content"] == "Version 2: Improved prompt."
        assert data["message"] == "Improved wording"
        assert data["model_tested"] == "gpt-4"
        assert data["prompt_id"] == prompt["id"]

    def test_create_version_empty_content(self, client, auth_headers):
        """Should reject version with empty content."""
        prompt = create_prompt(client, auth_headers)
        resp = client.post(
            f"/api/prompts/{prompt['id']}/versions",
            json={"content": "   "},
            headers=auth_headers,
        )
        assert resp.status_code == 400

    def test_create_version_unauthorized_user(
        self, client, auth_headers, second_user_headers
    ):
        """Should 403 when creating version on another user's prompt."""
        prompt = create_prompt(client, auth_headers)
        resp = client.post(
            f"/api/prompts/{prompt['id']}/versions",
            json={"content": "New version"},
            headers=second_user_headers,
        )
        assert resp.status_code == 403


class TestListVersions:
    """GET /api/prompts/{id}/versions"""

    def test_list_versions(self, client, auth_headers):
        """Should list all versions, newest first."""
        prompt = create_prompt(client, auth_headers)
        # Add two more versions
        client.post(
            f"/api/prompts/{prompt['id']}/versions",
            json={"content": "Version 2"},
            headers=auth_headers,
        )
        client.post(
            f"/api/prompts/{prompt['id']}/versions",
            json={"content": "Version 3"},
            headers=auth_headers,
        )
        resp = client.get(
            f"/api/prompts/{prompt['id']}/versions", headers=auth_headers
        )
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) == 3
        # Should be ordered newest first
        assert data[0]["version_number"] == 3
        assert data[2]["version_number"] == 1

    def test_list_versions_empty(self, client, auth_headers):
        """Should return empty list for nonexistent prompt."""
        resp = client.get("/api/prompts/99999/versions", headers=auth_headers)
        assert resp.status_code == 404


class TestGetVersion:
    """GET /api/prompts/{id}/versions/{vid}"""

    def test_get_specific_version(self, client, auth_headers):
        """Should return a specific version by its ID."""
        prompt = create_prompt(client, auth_headers)
        versions = client.get(
            f"/api/prompts/{prompt['id']}/versions", headers=auth_headers
        ).json()
        vid = versions[0]["id"]
        resp = client.get(
            f"/api/prompts/{prompt['id']}/versions/{vid}", headers=auth_headers
        )
        assert resp.status_code == 200
        assert resp.json()["id"] == vid
        assert resp.json()["version_number"] == 1

    def test_get_version_not_found(self, client, auth_headers):
        """Should 404 for a version that doesn't exist."""
        prompt = create_prompt(client, auth_headers)
        resp = client.get(
            f"/api/prompts/{prompt['id']}/versions/99999", headers=auth_headers
        )
        assert resp.status_code == 404


class TestLatestVersion:
    """GET /api/prompts/{id}/versions/latest"""

    def test_get_latest_version(self, client, auth_headers):
        """Should return the highest version number."""
        prompt = create_prompt(client, auth_headers)
        client.post(
            f"/api/prompts/{prompt['id']}/versions",
            json={"content": "Version 2"},
            headers=auth_headers,
        )
        resp = client.get(
            f"/api/prompts/{prompt['id']}/versions/latest", headers=auth_headers
        )
        assert resp.status_code == 200
        assert resp.json()["version_number"] == 2

    def test_latest_version_nonexistent_prompt(self, client, auth_headers):
        """Should 404 for nonexistent prompt."""
        resp = client.get("/api/prompts/99999/versions/latest", headers=auth_headers)
        assert resp.status_code == 404


class TestDiff:
    """GET /api/prompts/{id}/versions/{vid}/diff"""

    def test_diff_with_previous_version(self, client, auth_headers):
        """Should produce a unified diff between adjacent versions."""
        prompt = create_prompt(client, auth_headers)
        # Add version 2
        v2_resp = client.post(
            f"/api/prompts/{prompt['id']}/versions",
            json={"content": "Version 2: Changed content."},
            headers=auth_headers,
        ).json()
        v2_id = v2_resp["id"]

        resp = client.get(
            f"/api/prompts/{prompt['id']}/versions/{v2_id}/diff",
            headers=auth_headers,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "diff" in data
        assert data["source_version_id"] == v2_id
        assert data["target_version_number"] == 1
        # Should show the content change in the diff
        assert "Version 1" in data["diff"] or "Hello world" in data["diff"]
        assert "Changed content" in data["diff"]

    def test_diff_no_previous_version(self, client, auth_headers):
        """Should 404 when no previous version exists."""
        prompt = create_prompt(client, auth_headers)
        versions = client.get(
            f"/api/prompts/{prompt['id']}/versions", headers=auth_headers
        ).json()
        v1_id = versions[0]["id"]
        resp = client.get(
            f"/api/prompts/{prompt['id']}/versions/{v1_id}/diff",
            headers=auth_headers,
        )
        assert resp.status_code == 404

    def test_diff_with_specific_target(self, client, auth_headers):
        """Should diff against a specified target version."""
        prompt = create_prompt(client, auth_headers)
        v1_id = client.get(
            f"/api/prompts/{prompt['id']}/versions", headers=auth_headers
        ).json()[0]["id"]
        v3_resp = client.post(
            f"/api/prompts/{prompt['id']}/versions",
            json={"content": "Version 2: Mid"},
            headers=auth_headers,
        )
        v3_id = client.post(
            f"/api/prompts/{prompt['id']}/versions",
            json={"content": "Version 3: Final"},
            headers=auth_headers,
        ).json()["id"]

        resp = client.get(
            f"/api/prompts/{prompt['id']}/versions/{v3_id}/diff?target_version_id={v1_id}",
            headers=auth_headers,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "Version 3" in data["diff"]


class TestCompare:
    """GET /api/prompts/{id}/versions/{vid}/compare/{target}"""

    def test_compare_two_versions(self, client, auth_headers):
        """Should return both versions and their diff."""
        prompt = create_prompt(client, auth_headers)
        v1_id = client.get(
            f"/api/prompts/{prompt['id']}/versions", headers=auth_headers
        ).json()[0]["id"]
        v2_resp = client.post(
            f"/api/prompts/{prompt['id']}/versions",
            json={"content": "Version 2: Updated."},
            headers=auth_headers,
        ).json()
        v2_id = v2_resp["id"]

        resp = client.get(
            f"/api/prompts/{prompt['id']}/versions/{v1_id}/compare/{v2_id}",
            headers=auth_headers,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "versions" in data
        assert "diff" in data
        # Both versions should be present
        assert len(data["versions"]) == 2
        # The diff should show the change
        assert "Updated" in data["diff"]

    def test_compare_version_not_found(self, client, auth_headers):
        """Should 404 when one version doesn't exist."""
        prompt = create_prompt(client, auth_headers)
        v1_id = client.get(
            f"/api/prompts/{prompt['id']}/versions", headers=auth_headers
        ).json()[0]["id"]
        resp = client.get(
            f"/api/prompts/{prompt['id']}/versions/{v1_id}/compare/99999",
            headers=auth_headers,
        )
        assert resp.status_code == 404

"""Tests for prompt CRUD endpoints — /api/prompts/*."""

BASE_PROMPT = {
    "title": "Test Prompt",
    "description": "A test prompt for unit testing",
    "content": "You are a helpful assistant.",
    "is_public": False,
}


class TestCreatePrompt:
    """POST /api/prompts/"""

    def test_create_prompt(self, client, auth_headers):
        """Should create a prompt with an initial version (v1)."""
        resp = client.post("/api/prompts/", json=BASE_PROMPT, headers=auth_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == BASE_PROMPT["title"]
        assert data["description"] == BASE_PROMPT["description"]
        assert data["is_public"] is False
        assert data["version_count"] == 1
        assert data["latest_content"] == BASE_PROMPT["content"]
        assert "id" in data
        assert "created_at" in data

    def test_create_prompt_no_content(self, client, auth_headers):
        """Should reject a prompt without content."""
        resp = client.post(
            "/api/prompts/",
            json={"title": "Bad Prompt", "description": "Missing content"},
            headers=auth_headers,
        )
        assert resp.status_code == 422

    def test_create_prompt_unauthenticated(self, client):
        """Should reject prompt creation without auth."""
        resp = client.post("/api/prompts/", json=BASE_PROMPT)
        # HTTPBearer returns 401 when Authorization header is missing
        assert resp.status_code == 401


class TestListPrompts:
    """GET /api/prompts/"""

    def test_list_empty(self, client, auth_headers):
        """Should return an empty list when user has no prompts."""
        resp = client.get("/api/prompts/", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json() == []

    def test_list_own_prompts(self, client, auth_headers):
        """Should return only the current user's prompts."""
        client.post("/api/prompts/", json=BASE_PROMPT, headers=auth_headers)
        client.post(
            "/api/prompts/",
            json={**BASE_PROMPT, "title": "Second Prompt"},
            headers=auth_headers,
        )
        resp = client.get("/api/prompts/", headers=auth_headers)
        data = resp.json()
        assert len(data) == 2
        titles = {p["title"] for p in data}
        assert titles == {"Test Prompt", "Second Prompt"}

    def test_list_isolation(self, client, auth_headers, second_user_headers):
        """Should not leak prompts between users."""
        client.post("/api/prompts/", json=BASE_PROMPT, headers=auth_headers)
        resp = client.get("/api/prompts/", headers=second_user_headers)
        assert resp.json() == []


class TestGetPrompt:
    """GET /api/prompts/{id}"""

    def test_get_own_prompt(self, client, auth_headers):
        """Should return the prompt with version info."""
        created = client.post(
            "/api/prompts/", json=BASE_PROMPT, headers=auth_headers
        ).json()
        resp = client.get(f"/api/prompts/{created['id']}", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == created["id"]
        assert data["version_count"] == 1

    def test_get_prompt_not_found(self, client, auth_headers):
        """Should 404 for a nonexistent prompt ID."""
        resp = client.get("/api/prompts/99999", headers=auth_headers)
        assert resp.status_code == 404

    def test_get_others_prompt_forbidden(
        self, client, auth_headers, second_user_headers
    ):
        """Should 403 when accessing another user's prompt."""
        created = client.post(
            "/api/prompts/", json=BASE_PROMPT, headers=auth_headers
        ).json()
        resp = client.get(
            f"/api/prompts/{created['id']}", headers=second_user_headers
        )
        assert resp.status_code == 403


class TestUpdatePrompt:
    """PUT /api/prompts/{id}"""

    def test_update_metadata(self, client, auth_headers):
        """Should update title, description, and public flag."""
        created = client.post(
            "/api/prompts/", json=BASE_PROMPT, headers=auth_headers
        ).json()
        resp = client.put(
            f"/api/prompts/{created['id']}",
            json={"title": "Updated Title", "description": "Updated desc", "is_public": True},
            headers=auth_headers,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["title"] == "Updated Title"
        assert data["description"] == "Updated desc"
        assert data["is_public"] is True
        # Version count should NOT increase (content unchanged)
        assert data["version_count"] == 1

    def test_update_content_creates_new_version(self, client, auth_headers):
        """Should auto-create a version when content changes."""
        created = client.post(
            "/api/prompts/", json=BASE_PROMPT, headers=auth_headers
        ).json()
        assert created["version_count"] == 1

        resp = client.put(
            f"/api/prompts/{created['id']}",
            json={"content": "You are a helpful assistant. (revised)"},
            headers=auth_headers,
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["version_count"] == 2
        assert data["latest_content"] == "You are a helpful assistant. (revised)"

    def test_update_same_content_no_new_version(self, client, auth_headers):
        """Should NOT create a version when content is the same."""
        created = client.post(
            "/api/prompts/", json=BASE_PROMPT, headers=auth_headers
        ).json()
        resp = client.put(
            f"/api/prompts/{created['id']}",
            json={"content": BASE_PROMPT["content"]},
            headers=auth_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["version_count"] == 1

    def test_update_empty_content_rejected(self, client, auth_headers):
        """Should reject empty content update."""
        created = client.post(
            "/api/prompts/", json=BASE_PROMPT, headers=auth_headers
        ).json()
        resp = client.put(
            f"/api/prompts/{created['id']}",
            json={"content": "   "},
            headers=auth_headers,
        )
        assert resp.status_code == 400
        assert "empty" in resp.json()["detail"].lower()

    def test_update_others_prompt_forbidden(
        self, client, auth_headers, second_user_headers
    ):
        """Should 403 when updating another user's prompt."""
        created = client.post(
            "/api/prompts/", json=BASE_PROMPT, headers=auth_headers
        ).json()
        resp = client.put(
            f"/api/prompts/{created['id']}",
            json={"title": "Hacked Title"},
            headers=second_user_headers,
        )
        assert resp.status_code == 403


class TestDeletePrompt:
    """DELETE /api/prompts/{id}"""

    def test_delete_own_prompt(self, client, auth_headers):
        """Should delete the prompt and return success."""
        created = client.post(
            "/api/prompts/", json=BASE_PROMPT, headers=auth_headers
        ).json()
        resp = client.delete(f"/api/prompts/{created['id']}", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["message"] == "Prompt deleted successfully"
        # Verify it's gone
        get_resp = client.get(f"/api/prompts/{created['id']}", headers=auth_headers)
        assert get_resp.status_code == 404

    def test_delete_nonexistent(self, client, auth_headers):
        """Should 404 when deleting a prompt that doesn't exist."""
        resp = client.delete("/api/prompts/99999", headers=auth_headers)
        assert resp.status_code == 404

    def test_delete_others_prompt_forbidden(
        self, client, auth_headers, second_user_headers
    ):
        """Should 403 when deleting another user's prompt."""
        created = client.post(
            "/api/prompts/", json=BASE_PROMPT, headers=auth_headers
        ).json()
        resp = client.delete(
            f"/api/prompts/{created['id']}", headers=second_user_headers
        )
        assert resp.status_code == 403

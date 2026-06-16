"""Tests for authentication endpoints — /api/auth/*."""


class TestRegister:
    """POST /api/auth/register"""

    def test_register_success(self, client):
        """Should create a new user and return a JWT token."""
        payload = {
            "email": "newuser@example.com",
            "password": "StrongPass1!",
            "name": "New User",
        }
        resp = client.post("/api/auth/register", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_register_duplicate_email(self, client, test_user_data):
        """Should reject a second registration with the same email."""
        # First registration
        client.post("/api/auth/register", json=test_user_data)
        # Second with same email
        resp = client.post("/api/auth/register", json=test_user_data)
        assert resp.status_code == 400
        assert "already registered" in resp.json()["detail"].lower()


class TestLogin:
    """POST /api/auth/login"""

    def test_login_success(self, client, test_user_data, test_user):
        """Should authenticate with valid credentials and return a token."""
        resp = client.post(
            "/api/auth/login",
            json={
                "email": test_user_data["email"],
                "password": test_user_data["password"],
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client, test_user):
        """Should reject wrong password."""
        resp = client.post(
            "/api/auth/login",
            json={"email": test_user.email, "password": "wrongpassword"},
        )
        assert resp.status_code == 401
        assert "invalid" in resp.json()["detail"].lower()

    def test_login_nonexistent_user(self, client):
        """Should reject login for an unregistered email."""
        resp = client.post(
            "/api/auth/login",
            json={"email": "ghost@example.com", "password": "SomePass1!"},
        )
        assert resp.status_code == 401

    def test_login_inactive_user(self, client, db, test_user_data, test_user):
        """Should reject login for a deactivated account."""
        test_user.is_active = False
        db.commit()
        resp = client.post(
            "/api/auth/login",
            json={
                "email": test_user_data["email"],
                "password": test_user_data["password"],
            },
        )
        assert resp.status_code == 401
        assert "deactivated" in resp.json()["detail"].lower()


class TestMe:
    """GET /api/auth/me"""

    def test_me_authenticated(self, client, auth_headers, test_user):
        """Should return the current user profile."""
        resp = client.get("/api/auth/me", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == test_user.email
        assert data["name"] == test_user.name
        assert data["is_active"] is True
        assert "id" in data

    def test_me_no_token(self, client):
        """Should reject requests without a bearer token."""
        resp = client.get("/api/auth/me")
        # HTTPBearer returns 401 when Authorization header is missing
        assert resp.status_code == 401

    def test_me_invalid_token(self, client):
        """Should reject requests with a garbage token."""
        headers = {"Authorization": "Bearer thisisnotavalidtoken"}
        resp = client.get("/api/auth/me", headers=headers)
        assert resp.status_code == 401


class TestRefresh:
    """POST /api/auth/refresh"""

    def test_refresh_success(self, client, test_user):
        """Should issue a new token from a valid (even expired) token."""
        from app.core.security import create_access_token
        from datetime import timedelta

        # Create an already-expired token
        expired_token = create_access_token(
            data={"sub": test_user.email},
            expires_delta=timedelta(days=-1),
        )
        headers = {"Authorization": f"Bearer {expired_token}"}
        resp = client.post("/api/auth/refresh", headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

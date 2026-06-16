"""
Test configuration for PromptVault backend.
Uses SQLite in-memory database for full test isolation.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.core.security import get_password_hash, create_access_token
from app.models.user import User as UserModel

# In-memory SQLite — isolated per test session
TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    """Override the main get_db dependency to use test database."""
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_database():
    """Create fresh tables before each test, drop after.

    Uses autouse so every test starts with a clean slate.
    """
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client():
    """FastAPI TestClient with test database override."""
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def db():
    """Provide a clean DB session for test data setup."""
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def test_user_data():
    """Default test user credentials."""
    return {
        "email": "alice@example.com",
        "password": "SecurePass123!",
        "name": "Alice",
    }


@pytest.fixture
def test_user(db, test_user_data):
    """Create a verified user in the test database."""
    hashed = get_password_hash(test_user_data["password"])
    user = UserModel(
        email=test_user_data["email"],
        name=test_user_data["name"],
        hashed_password=hashed,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def auth_headers(test_user):
    """Bearer authorization headers for the test user."""
    token = create_access_token(data={"sub": test_user.email})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def second_user_data():
    """A second user for ownership tests."""
    return {
        "email": "bob@example.com",
        "password": "BobPass456!",
        "name": "Bob",
    }


@pytest.fixture
def second_user(db, second_user_data):
    """Create a second user for permission tests."""
    hashed = get_password_hash(second_user_data["password"])
    user = UserModel(
        email=second_user_data["email"],
        name=second_user_data["name"],
        hashed_password=hashed,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def second_user_headers(second_user):
    """Bearer headers for the second user."""
    token = create_access_token(data={"sub": second_user.email})
    return {"Authorization": f"Bearer {token}"}

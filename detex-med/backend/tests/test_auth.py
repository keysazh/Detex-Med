"""
tests/test_auth.py
Unit tests untuk endpoint autentikasi.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.db.session import get_db
from app.main import app

# Database in-memory untuk testing
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def test_register_success(client):
    response = client.post("/api/v1/auth/register", json={
        "full_name": "Dr. Test User",
        "email": "test@example.com",
        "password": "Password123!",
        "institution": "RS Test",
        "role": "radiologist",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    payload = {
        "full_name": "Dr. Test",
        "email": "dup@example.com",
        "password": "Password123!",
    }
    client.post("/api/v1/auth/register", json=payload)
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400


def test_login_success(client):
    client.post("/api/v1/auth/register", json={
        "full_name": "Dr. Test",
        "email": "login@example.com",
        "password": "Password123!",
    })
    response = client.post("/api/v1/auth/login", json={
        "email": "login@example.com",
        "password": "Password123!",
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client):
    client.post("/api/v1/auth/register", json={
        "full_name": "Dr. Test",
        "email": "wrong@example.com",
        "password": "Password123!",
    })
    response = client.post("/api/v1/auth/login", json={
        "email": "wrong@example.com",
        "password": "WrongPassword!",
    })
    assert response.status_code == 401


def test_get_me_authenticated(client):
    client.post("/api/v1/auth/register", json={
        "full_name": "Dr. Me",
        "email": "me@example.com",
        "password": "Password123!",
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "me@example.com",
        "password": "Password123!",
    })
    token = login_res.json()["access_token"]
    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"

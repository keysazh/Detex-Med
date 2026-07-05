"""
app/schemas/user.py
Pydantic schemas untuk validasi request/response terkait User.
"""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ─── Request Schemas ──────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, examples=["Dr. Budi Santoso"])
    email: EmailStr = Field(..., examples=["budi@rsudjakarta.id"])
    password: str = Field(..., min_length=8, examples=["Password123!"])
    institution: str | None = Field(None, max_length=150, examples=["RSUD Jakarta"])
    role: str = Field("radiologist", examples=["radiologist"])


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: str | None = Field(None, min_length=2, max_length=100)
    institution: str | None = Field(None, max_length=150)
    role: str | None = None


# ─── Response Schemas ─────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: str
    institution: str | None
    role: str
    is_active: bool
    is_admin: bool
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

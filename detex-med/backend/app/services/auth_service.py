"""
app/services/auth_service.py
Business logic untuk autentikasi: register, login, dan manajemen user.
"""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.schemas.user import UserRegister, TokenResponse, UserResponse


def register_user(payload: UserRegister, db: Session) -> UserResponse:
    """
    Daftarkan user baru.
    Throws 400 jika email sudah terdaftar.
    """
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar. Gunakan email lain atau login.",
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        institution=payload.institution,
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)


def login_user(email: str, password: str, db: Session) -> TokenResponse:
    """
    Autentikasi user dan kembalikan JWT token.
    Throws 401 jika email/password salah.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun Anda telah dinonaktifkan. Hubungi administrator.",
        )

    access_token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user),
    )

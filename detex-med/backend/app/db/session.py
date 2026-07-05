"""
app/db/session.py
Konfigurasi koneksi SQLAlchemy ke PostgreSQL.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# Engine koneksi ke database
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,       # Cek koneksi sebelum pakai dari pool
    pool_size=10,             # Jumlah koneksi yang disimpan di pool
    max_overflow=20,          # Koneksi ekstra saat pool penuh
)

# Factory untuk membuat session database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    """
    FastAPI dependency untuk mendapatkan database session.
    Session otomatis ditutup setelah request selesai.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

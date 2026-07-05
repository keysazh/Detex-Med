"""
app/main.py
Entry point aplikasi FastAPI DETEX-MED.
Konfigurasi CORS, middleware, router, dan static files.
"""

import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle event handler.
    Berjalan saat startup: buat tabel database dan folder uploads.
    """
    # Buat semua tabel jika belum ada (development convenience)
    Base.metadata.create_all(bind=engine)

    # Pastikan direktori uploads tersedia
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    Path(os.path.join(settings.UPLOAD_DIR, "results")).mkdir(parents=True, exist_ok=True)

    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} siap digunakan!")
    yield
    print("👋 Server dihentikan.")


# ─── Inisialisasi Aplikasi ────────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "API untuk sistem deteksi tumor berbasis Deep Learning YOLO. "
        "Mendukung citra medis MRI, CT-Scan, dan X-Ray."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# ─── CORS Middleware ──────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Routes ──────────────────────────────────────────────────────────────────

app.include_router(api_router)


# ─── Static Files (gambar hasil upload & deteksi) ────────────────────────────

app.mount(
    "/uploads",
    StaticFiles(directory=settings.UPLOAD_DIR),
    name="uploads",
)


# ─── Health Check ─────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
def health_check():
    """Endpoint untuk memverifikasi bahwa server berjalan."""
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}

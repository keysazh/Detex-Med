"""
app/api/v1/router.py
Menggabungkan semua endpoint router ke dalam satu API v1 router.
"""

from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.detections import router as detections_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(detections_router)

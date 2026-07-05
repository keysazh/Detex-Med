"""
app/api/v1/endpoints/detections.py
Endpoint untuk upload gambar, analisis YOLO, dan manajemen riwayat deteksi.
"""

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.detection import (
    DashboardStats,
    DetectionCreate,
    DetectionListResponse,
    DetectionResponse,
)
from app.services.detection_service import (
    create_detection,
    delete_detection,
    get_dashboard_stats,
    get_detection_by_id,
    get_detections,
)

router = APIRouter(prefix="/detections", tags=["Detection"])


@router.post("/upload", response_model=DetectionResponse, status_code=status.HTTP_201_CREATED)
def upload_and_detect(
    file: UploadFile = File(..., description="Gambar medis (JPG/PNG/WEBP)"),
    patient_name: str | None = Form(None),
    patient_id: str | None = Form(None),
    image_type: str = Form("MRI"),
    model_used: str = Form("YOLOv8n"),
    notes: str | None = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload citra medis dan jalankan deteksi tumor secara real-time.
    Model YOLO akan menganalisis gambar dan mengembalikan:
    - Lokasi tumor (bounding box)
    - Tingkat kepercayaan (confidence score)
    - Gambar hasil dengan anotasi
    """
    payload = DetectionCreate(
        patient_name=patient_name,
        patient_id=patient_id,
        image_type=image_type,
        model_used=model_used,
        notes=notes,
    )
    return create_detection(file, payload, current_user, db)


@router.get("/", response_model=DetectionListResponse)
def list_detections(
    page: int = Query(1, ge=1, description="Nomor halaman"),
    per_page: int = Query(10, ge=1, le=50, description="Jumlah item per halaman"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Ambil riwayat deteksi milik user yang sedang login (dengan pagination)."""
    return get_detections(current_user, db, page, per_page)


@router.get("/dashboard", response_model=DashboardStats)
def dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Statistik ringkasan untuk halaman dashboard user."""
    return get_dashboard_stats(current_user, db)


@router.get("/{detection_id}", response_model=DetectionResponse)
def get_detection(
    detection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Dapatkan detail satu hasil deteksi berdasarkan ID."""
    return get_detection_by_id(detection_id, current_user, db)


@router.delete("/{detection_id}", status_code=status.HTTP_200_OK)
def remove_detection(
    detection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Hapus hasil deteksi dan file gambar terkait."""
    return delete_detection(detection_id, current_user, db)

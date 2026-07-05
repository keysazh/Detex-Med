"""
app/services/detection_service.py
Business logic untuk manajemen deteksi: upload, simpan, query, hapus.
"""

import math
import os
import shutil
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.detection import Detection
from app.models.user import User
from app.schemas.detection import (
    DetectionCreate,
    DetectionListResponse,
    DetectionResponse,
    DashboardStats,
)
from app.services.yolo_service import yolo_service


def _validate_file(file: UploadFile) -> None:
    """Validasi ekstensi dan ukuran file yang diupload."""
    ext = Path(file.filename).suffix.lower().lstrip(".")
    if ext not in settings.allowed_extensions_set:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Format file tidak didukung. Gunakan: {', '.join(settings.allowed_extensions_set)}",
        )


def _save_upload(file: UploadFile) -> str:
    """Simpan file yang diupload ke direktori uploads dan kembalikan path-nya."""
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    unique_name = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = upload_dir / unique_name

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return str(file_path)


def create_detection(
    file: UploadFile,
    payload: DetectionCreate,
    user: User,
    db: Session,
) -> DetectionResponse:
    """
    Upload gambar, jalankan YOLO, simpan hasil ke database.
    """
    _validate_file(file)
    image_path = _save_upload(file)

    result_dir = os.path.join(settings.UPLOAD_DIR, "results")
    yolo_result = yolo_service.run_detection(
        image_path=image_path,
        model_name=payload.model_used,
        result_dir=result_dir,
    )

    detection = Detection(
        user_id=user.id,
        original_filename=file.filename,
        image_path=image_path,
        result_image_path=yolo_result["result_image_path"],
        patient_name=payload.patient_name,
        patient_id=payload.patient_id,
        image_type=payload.image_type,
        model_used=payload.model_used,
        tumor_detected=yolo_result["tumor_detected"],
        tumor_count=yolo_result["tumor_count"],
        max_confidence=yolo_result["max_confidence"],
        detections_data=yolo_result["detections_data"],
        processing_time_ms=yolo_result["processing_time_ms"],
        notes=payload.notes,
        status="completed",
    )
    db.add(detection)
    db.commit()
    db.refresh(detection)

    return DetectionResponse.model_validate(detection)


def get_detections(
    user: User,
    db: Session,
    page: int = 1,
    per_page: int = 10,
) -> DetectionListResponse:
    """Ambil riwayat deteksi milik user dengan pagination."""
    query = db.query(Detection).filter(Detection.user_id == user.id)
    total = query.count()
    items = (
        query.order_by(Detection.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return DetectionListResponse(
        items=[DetectionResponse.model_validate(d) for d in items],
        total=total,
        page=page,
        per_page=per_page,
        total_pages=math.ceil(total / per_page) if total > 0 else 1,
    )


def get_detection_by_id(detection_id: int, user: User, db: Session) -> DetectionResponse:
    """Ambil satu hasil deteksi berdasarkan ID. Throws 404 jika tidak ditemukan."""
    detection = (
        db.query(Detection)
        .filter(Detection.id == detection_id, Detection.user_id == user.id)
        .first()
    )
    if not detection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data deteksi tidak ditemukan.",
        )
    return DetectionResponse.model_validate(detection)


def delete_detection(detection_id: int, user: User, db: Session) -> dict:
    """Hapus hasil deteksi beserta file gambarnya."""
    detection = (
        db.query(Detection)
        .filter(Detection.id == detection_id, Detection.user_id == user.id)
        .first()
    )
    if not detection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data deteksi tidak ditemukan.",
        )

    # Hapus file dari disk
    for path in [detection.image_path, detection.result_image_path]:
        if path and os.path.exists(path):
            os.remove(path)

    db.delete(detection)
    db.commit()
    return {"message": "Data deteksi berhasil dihapus."}


def get_dashboard_stats(user: User, db: Session) -> DashboardStats:
    """Hitung statistik untuk halaman dashboard."""
    base_q = db.query(Detection).filter(Detection.user_id == user.id)

    total = base_q.count()
    tumor_count = base_q.filter(Detection.tumor_detected == True).count()  # noqa: E712
    normal_count = total - tumor_count
    detection_rate = round((tumor_count / total * 100), 1) if total > 0 else 0.0

    avg_conf_row = base_q.with_entities(func.avg(Detection.max_confidence)).scalar()
    avg_confidence = round(float(avg_conf_row or 0) * 100, 1)

    recent = (
        base_q.order_by(Detection.created_at.desc()).limit(5).all()
    )

    return DashboardStats(
        total_detections=total,
        tumor_detected_count=tumor_count,
        normal_count=normal_count,
        detection_rate_percent=detection_rate,
        avg_confidence=avg_confidence,
        recent_detections=[DetectionResponse.model_validate(d) for d in recent],
    )

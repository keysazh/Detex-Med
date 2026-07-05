"""
app/schemas/detection.py
Pydantic schemas untuk validasi request/response terkait Detection.
"""

from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


# ─── Sub-schemas ──────────────────────────────────────────────────────────────

class BoundingBox(BaseModel):
    """Representasi satu objek yang terdeteksi oleh YOLO."""
    bbox: list[float] = Field(..., description="[x1, y1, x2, y2] dalam piksel")
    confidence: float = Field(..., ge=0.0, le=1.0)
    class_name: str
    area: float


# ─── Request Schemas ──────────────────────────────────────────────────────────

class DetectionCreate(BaseModel):
    patient_name: str | None = Field(None, max_length=100, examples=["Anonim"])
    patient_id: str | None = Field(None, max_length=50, examples=["P-2024-001"])
    image_type: str = Field("MRI", examples=["MRI"])
    model_used: str = Field("YOLOv8n", examples=["YOLOv8n"])
    notes: str | None = Field(None, max_length=1000)


# ─── Response Schemas ─────────────────────────────────────────────────────────

class DetectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    original_filename: str
    image_path: str
    result_image_path: str | None
    patient_name: str | None
    patient_id: str | None
    image_type: str
    model_used: str
    tumor_detected: bool
    tumor_count: int
    max_confidence: float | None
    detections_data: list | None
    processing_time_ms: float | None
    notes: str | None
    status: str
    created_at: datetime


class DetectionListResponse(BaseModel):
    """Response untuk daftar riwayat deteksi dengan pagination."""
    items: list[DetectionResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


class DashboardStats(BaseModel):
    """Statistik ringkasan untuk halaman dashboard."""
    total_detections: int
    tumor_detected_count: int
    normal_count: int
    detection_rate_percent: float
    avg_confidence: float
    recent_detections: list[DetectionResponse]

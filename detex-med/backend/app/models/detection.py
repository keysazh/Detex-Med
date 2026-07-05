"""
app/models/detection.py
Model database untuk tabel detections (riwayat analisis citra medis).
"""

from datetime import datetime, timezone
from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Detection(Base):
    __tablename__ = "detections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Informasi file gambar
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    image_path: Mapped[str] = mapped_column(String(500), nullable=False)
    result_image_path: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Metadata pasien (opsional)
    patient_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    patient_id: Mapped[str | None] = mapped_column(String(50), nullable=True)
    image_type: Mapped[str] = mapped_column(String(20), default="MRI")  # MRI | CT-Scan | X-Ray

    # Hasil deteksi YOLO
    model_used: Mapped[str] = mapped_column(String(50), default="YOLOv8n")
    tumor_detected: Mapped[bool] = mapped_column(default=False)
    tumor_count: Mapped[int] = mapped_column(Integer, default=0)
    max_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    detections_data: Mapped[list | None] = mapped_column(JSON, nullable=True)
    # Format detections_data:
    # [{"bbox": [x1,y1,x2,y2], "confidence": 0.87, "class": "tumor", "area": 1234}]

    # Metadata waktu
    processing_time_ms: Mapped[float | None] = mapped_column(Float, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="completed")  # processing | completed | failed
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relasi ke user
    user: Mapped["User"] = relationship("User", back_populates="detections")

    def __repr__(self) -> str:
        return f"<Detection id={self.id} user_id={self.user_id} tumor={self.tumor_detected}>"

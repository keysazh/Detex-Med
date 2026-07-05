"""
app/services/yolo_service.py
Service untuk menjalankan inferensi YOLO pada gambar yang diupload.
"""

import os
import time
import uuid
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

from app.core.config import settings

# Warna per kelas tumor
CLASS_COLORS = {
    "glioma":      (0, 0, 255),    # Merah
    "meningioma":  (0, 165, 255),  # Orange
    "pituitary":   (0, 255, 255),  # Kuning
    "no_tumor":    (0, 255, 0),    # Hijau
    "tumor":       (0, 0, 255),    # Merah (fallback)
}


class YOLOService:
    _model = None
    _model_path = None

    @classmethod
    def _load_model(cls, model_path: str):
        if cls._model is not None and cls._model_path == model_path:
            return cls._model

        path = Path(model_path)
        if not path.exists():
            print(f"⚠️  Model tidak ditemukan di {path}. Mode demo aktif.")
            return None

        try:
            from ultralytics import YOLO
            cls._model = YOLO(str(path))
            cls._model_path = model_path
            print(f"✅ Model YOLO dimuat dari {path}")
            return cls._model
        except Exception as e:
            print(f"❌ Gagal memuat model: {e}")
            return None

    @staticmethod
    def _get_model_path(model_name: str) -> str:
        """Tentukan path model berdasarkan nama yang dipilih user."""
        base = "app/models/weights"
        mapping = {
            "YOLOv8n":  f"{base}/best.pt",
            "YOLOv8s":  f"{base}/yolov8s_best.pt",
            "YOLOv11s": f"{base}/yolov11s_best.pt",
            "YOLOv11n": f"{base}/yolov11n_best.pt",
        }
        # Coba cari file yang cocok, fallback ke best.pt
        path = mapping.get(model_name, f"{base}/best.pt")
        if not Path(path).exists():
            path = f"{base}/best.pt"
        return path

    @staticmethod
    def _draw_detections(image_path: str, detections: list[dict], result_dir: str) -> str:
        """Gambar bounding box + label pada gambar asli."""
        img = cv2.imread(image_path)
        if img is None:
            pil_img = Image.open(image_path).convert("RGB")
            img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

        for det in detections:
            x1, y1, x2, y2 = [int(v) for v in det["bbox"]]
            confidence = det["confidence"]
            class_name = det.get("class_name", "tumor").lower()
            label = f"{class_name.capitalize()} {confidence:.0%}"

            # Pilih warna berdasarkan kelas
            color = CLASS_COLORS.get(class_name, (0, 0, 255))

            # Gambar bounding box
            cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)

            # Label background
            (text_w, text_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
            cv2.rectangle(img, (x1, y1 - text_h - 10), (x1 + text_w + 6, y1), color, -1)
            cv2.putText(img, label, (x1 + 3, y1 - 4),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        os.makedirs(result_dir, exist_ok=True)
        result_filename = f"result_{uuid.uuid4().hex[:8]}.jpg"
        result_path = os.path.join(result_dir, result_filename)
        cv2.imwrite(result_path, img)
        return result_path

    def run_detection(
        self,
        image_path: str,
        model_name: str = "YOLOv8n",
        result_dir: str = "uploads/results",
    ) -> dict:
        start_time = time.perf_counter()

        model_path = self._get_model_path(model_name)
        model = self._load_model(model_path)
        detections = []

        if model is not None:
            results = model.predict(
                source=image_path,
                conf=settings.YOLO_CONFIDENCE_THRESHOLD,
                iou=settings.YOLO_IOU_THRESHOLD,
                verbose=False,
            )
            for result in results:
                if result.boxes is not None:
                    for box in result.boxes:
                        x1, y1, x2, y2 = box.xyxy[0].tolist()
                        confidence = float(box.conf[0])
                        class_id = int(box.cls[0])
                        # Ambil nama kelas dari model
                        class_name = model.names.get(class_id, f"class_{class_id}")
                        area = (x2 - x1) * (y2 - y1)
                        detections.append({
                            "bbox": [x1, y1, x2, y2],
                            "confidence": round(confidence, 4),
                            "class_name": class_name,
                            "area": round(area, 2),
                        })
        else:
            # Mode demo — simulasi deteksi
            import random
            with Image.open(image_path) as img:
                width, height = img.size
            random.seed(42)
            count = random.randint(0, 2)
            classes = ["glioma", "meningioma", "pituitary"]
            for _ in range(count):
                x1 = random.randint(int(width * 0.2), int(width * 0.5))
                y1 = random.randint(int(height * 0.2), int(height * 0.5))
                x2 = min(x1 + random.randint(60, 150), width)
                y2 = min(y1 + random.randint(60, 150), height)
                detections.append({
                    "bbox": [float(x1), float(y1), float(x2), float(y2)],
                    "confidence": round(random.uniform(0.55, 0.95), 2),
                    "class_name": random.choice(classes),
                    "area": float((x2 - x1) * (y2 - y1)),
                })

        result_image_path = self._draw_detections(image_path, detections, result_dir)
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
        max_confidence = max((d["confidence"] for d in detections), default=None)

        return {
            "tumor_detected": len(detections) > 0,
            "tumor_count": len(detections),
            "max_confidence": max_confidence,
            "detections_data": detections,
            "result_image_path": result_image_path,
            "processing_time_ms": elapsed_ms,
        }


yolo_service = YOLOService()
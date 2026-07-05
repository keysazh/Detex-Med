# 🧠 DETEX-MED

**DETEX-MED: Implementasi Deep Learning YOLO untuk Deteksi Dini Tumor Berbasis Citra Medis Secara Real-Time**

> Sistem pendukung keputusan (DSS) berbasis web yang menggunakan YOLOv8/YOLOv11 untuk mendeteksi tumor pada citra medis (MRI, CT-Scan, X-Ray) secara otomatis dan real-time.

---

## 📌 Deskripsi Proyek

DETEX-MED adalah *Decision Support System* (DSS) yang dirancang untuk membantu tenaga medis (radiolog) dalam melakukan skrining awal deteksi tumor secara cepat dan objektif. Sistem ini **bukan pengganti dokter**, melainkan asisten cerdas yang memberikan *second opinion* berbasis AI.

**Tim Pengembang:**
| Nama | NIM | Peran |
|------|-----|-------|
| Rindiyani Na'imah | A11.2024.15877 | Ketua Tim & System Architect |
| Shafa Naila Kamal | A11.2024.15883 | Frontend & Integration |
| Keysa Zahira F.A | A11.2024.15886 | Dataset & Model Evaluation |

**Universitas Dian Nuswantoro — Teknik Informatika — 2026**

---

## 🏗️ Arsitektur Sistem

```
detex-med/
├── backend/            # FastAPI + Python
│   ├── app/
│   │   ├── api/v1/     # REST API endpoints
│   │   ├── core/       # Config, security, dependencies
│   │   ├── db/         # Database connection & session
│   │   ├── models/     # SQLAlchemy ORM models
│   │   ├── schemas/    # Pydantic request/response schemas
│   │   ├── services/   # Business logic (YOLO, auth, dll)
│   │   └── utils/      # Helper functions
│   ├── migrations/     # Alembic database migrations
│   └── tests/          # Unit & integration tests
├── frontend/           # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── pages/      # Route-level page components
│       ├── store/      # Zustand state management
│       └── hooks/      # Custom React hooks
└── docs/               # Dokumentasi tambahan
```

---

## 🚀 Tech Stack

**Backend:**
- **FastAPI** — REST API framework
- **SQLAlchemy** — ORM untuk database
- **PostgreSQL** — Database utama
- **Alembic** — Database migrations
- **Ultralytics YOLO** — Model deteksi tumor
- **Pillow / OpenCV** — Image processing
- **JWT** — Autentikasi token

**Frontend:**
- **React 18** + **Vite** — UI framework
- **Tailwind CSS** — Styling
- **Zustand** — State management
- **Axios** — HTTP client
- **React Router v6** — Routing

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### 1. Clone Repository
```bash
git clone https://github.com/username/detex-med.git
cd detex-med
```

### 2. Setup Backend
```bash
cd backend

# Buat virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy dan edit environment variables
cp .env.example .env
# Edit .env sesuai konfigurasi database Anda

# Jalankan migrasi database
alembic upgrade head

# Jalankan backend server
uvicorn app.main:app --reload --port 8000
```

### 3. Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Jalankan development server
npm run dev
```

### 4. Akses Aplikasi
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

---

## 🌐 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/v1/auth/register` | Registrasi user baru |
| POST | `/api/v1/auth/login` | Login & dapatkan token |
| POST | `/api/v1/detections/upload` | Upload & analisis citra medis |
| GET | `/api/v1/detections/` | Riwayat deteksi user |
| GET | `/api/v1/detections/{id}` | Detail hasil deteksi |
| DELETE | `/api/v1/detections/{id}` | Hapus hasil deteksi |
| GET | `/api/v1/dashboard/stats` | Statistik dashboard |

---

## 📊 Model AI

- **YOLOv8n (Nano)** — Untuk inferensi cepat di perangkat terbatas
- **YOLOv11s (Small)** — Akurasi lebih tinggi
- Dataset: 1.511 citra medis dari Kaggle, diproses via Roboflow
- Output: Bounding box + confidence score pada area tumor

> **Catatan:** File model (`.pt`) tidak disertakan di repo karena ukuran besar. Lihat `docs/model_setup.md` untuk panduan download/training model.

---

## 🧪 Menjalankan Tests
```bash
cd backend
pytest tests/ -v
```

---

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan penelitian akademis di Universitas Dian Nuswantoro.

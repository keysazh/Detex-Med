// src/pages/DetectionPage.jsx
// Halaman Deteksi Baru - FINAL (Simulasi Deteksi & Penyimpanan Dinamis ke LocalStorage)

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Play, Image as ImageIcon, X, AlertTriangle, Layers } from "lucide-react";

export default function DetectionPage() {
  const navigate = useNavigate();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDetected, setIsDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk menyimpan ID rekam medis yang baru saja digenerate
  const [generatedId, setGeneratedId] = useState(null);

  // State untuk parameter input form
  const [namaPasien, setNamaPasien] = useState("naim");
  const [idPasien, setIdPasien] = useState("p-16");
  const [jenisCitra, setJenisCitra] = useState("MRI");
  const [modelYolo, setModelYolo] = useState("YOLOv8n");
  const [catatan, setCatatan] = useState("");

  const fileInputRef = useRef(null);

  const handleDropzoneClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsDetected(false); 
      setGeneratedId(null);
    }
  };

  const handleClearImage = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
    setImagePreview(null);
    setIsDetected(false);
    setGeneratedId(null);
  };

  const handleStartDetection = () => {
    if (!selectedImage) {
      alert("Silakan upload citra medis terlebih dahulu!");
      return;
    }
    setIsLoading(true);
    
    // Simulasi loading proses AI YOLOv8 memakan waktu 1.2 detik
    setTimeout(() => {
      const newId = Date.now(); // Buat ID unik berbasis timestamp angka
      setGeneratedId(newId);
      setIsLoading(false);
      setIsDetected(true);

      // ── SIMPAN DATA SECARA DINAMIS KE LOCALSTORAGE ──
      const localData = localStorage.getItem("detex_med_history");
      
      // Jika localstorage belum pernah dibuat, pakai fallback array kosong
      let currentHistory = localData ? JSON.parse(localData) : [];

      // Properti disamakan dengan struktur tabel HistoryPage
      const newRecord = {
        id: newId, 
        file: selectedImage.name || "Te-gl_102.jpg",
        pasien: namaPasien || "Anonim",
        jenis: jenisCitra,
        model: modelYolo,
        hasil: "Tumor", 
        waktu: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
        idPasien: idPasien,
        catatan: catatan
      };

      // Push record baru di baris paling atas (Index 0)
      const updatedHistory = [newRecord, ...currentHistory];
      localStorage.setItem("detex_med_history", JSON.stringify(updatedHistory));

    }, 1200);
  };

  // Navigasi fungsional langsung ke ID item baru yang tersimpan
  const handleViewDetail = () => {
    if (generatedId) {
      navigate(`/history/${generatedId}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ── HEADER HALAMAN ── */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Deteksi Tumor Baru
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-0.5">
          Upload citra medis dan model YOLO akan menganalisis objek tumor secara otomatis.
        </p>
      </div>

      {/* ── GRID UTAMA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* === KOLOM KIRI (UPLOAD & FORM PARAMETER) === */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* KOTAK 1: UPLOAD CITRA */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              Upload Citra
            </h2>
            
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden" 
            />
            
            <div 
              onClick={handleDropzoneClick}
              className="border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50/50 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative min-h-[160px]"
            >
              {imagePreview ? (
                <div className="w-full flex flex-col items-center justify-center relative">
                  <div className="relative group max-w-[140px] border border-slate-200 rounded-lg overflow-hidden bg-black shadow-md">
                    <img src={imagePreview} alt="Preview" className="max-h-[100px] object-contain mx-auto" />
                    <button 
                      onClick={handleClearImage}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-700 mt-2 truncate max-w-[200px]">
                    {selectedImage?.name || "Te-gl_102.jpg"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                    <Upload size={18} />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    Drag & drop atau <span className="text-blue-600 underline">klik untuk upload</span>
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                    JPG, PNG, WEBP • Maks 10MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* KOTAK 2: PARAMETER FORM */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              Parameter Deteksi
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Nama Pasien</label>
                  <input type="text" value={namaPasien} onChange={(e) => setNamaPasien(e.target.value)} className="w-full px-3 py-2 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">ID Pasien</label>
                  <input type="text" value={idPasien} onChange={(e) => setIdPasien(e.target.value)} className="w-full px-3 py-2 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Jenis Citra</label>
                  <select value={jenisCitra} onChange={(e) => setJenisCitra(e.target.value)} className="w-full px-3 py-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option>MRI</option>
                    <option>CT-Scan</option>
                    <option>X-Ray</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Model YOLO</label>
                  <select value={modelYolo} onChange={(e) => setModelYolo(e.target.value)} className="w-full px-3 py-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option>YOLOv8n</option>
                    <option>YOLOv11n</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Catatan Klinis</label>
                <textarea rows="2" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Tambahkan catatan tambahan..." className="w-full px-3 py-2 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>

              <button 
                onClick={handleStartDetection}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed shadow-blue-500/10"
              >
                <Play size={14} fill="currentColor" />
                {isLoading ? "Sedang Menganalisis..." : "Jalankan Deteksi"}
              </button>
            </div>
          </div>

        </div>

        {/* === KOLOM KANAN === */}
        <div className="lg:col-span-7 space-y-4 min-h-[500px]">
          {isDetected ? (
            <div className="space-y-4 border border-sky-100/50 rounded-2xl p-1 animate-fadeIn">
              
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
                <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
                <div>
                  <h4 className="text-sm font-extrabold text-red-900">1 Area Tumor Terdeteksi</h4>
                  <p className="text-xs font-semibold text-red-700 mt-0.5">
                    Model mengidentifikasi indikasi tumor jenis <span className="underline font-bold">Glioma</span> dengan tingkat keyakinan tinggi.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Citra Hasil Anotasi (Preview)</h3>
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-2 flex items-center justify-center overflow-hidden min-h-[260px] shadow-inner relative">
                  <img src={imagePreview} alt="Anotasi Tumor" className="max-h-[300px] object-contain rounded border border-slate-800" />
                  
                  <div className="absolute top-1/3 left-1/3 border-2 border-red-500 bg-red-500/10 px-2 py-1 rounded text-white text-[11px] font-black font-mono shadow">
                    Glioma: 52%
                  </div>
                </div>
              </div>

              <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Statistik Hasil Analisis</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center shadow-inner">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jumlah Objek</p>
                    <p className="text-2xl font-black text-red-600 mt-1">1 <span className="text-xs font-bold text-slate-500">Tumor</span></p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center shadow-inner">
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Confidence</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">52%</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center shadow-inner">
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Jenis Tumor</p>
                    <p className="text-base font-black text-blue-600 mt-2 tracking-wide uppercase flex items-center justify-center gap-1">
                      <Layers size={14} />
                      Glioma
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={handleViewDetail}
                  className="w-full mt-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl transition-all border border-blue-200 shadow-sm"
                >
                  Lihat Detail Analisis Lengkap
                </button>
              </div>

            </div>
          ) : (
            <div className="w-full h-full min-h-[480px] bg-white border border-sky-100 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                <ImageIcon size={28} className="text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-800 tracking-wide">
                Hasil analisis tumor akan musik di sini
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-1.5 max-w-xs leading-normal">
                Silakan isi data pasien, upload gambar medis di panel kiri, kemudian klik tombol <span className="text-blue-600 font-bold">"Jalankan Deteksi"</span>.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
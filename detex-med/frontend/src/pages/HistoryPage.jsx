import { useState, useEffect } from "react";
import { Search, FileText, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState("Semua");

  // DATA CADANGAN (Otomatis tampil jika API backend belum aktif/error)
  const dummyDatabaseData = [
    { id: 1, original_filename: "Tr-gl_1205.jpg", patient_name: "yanti", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 1, created_at: "2026-07-03" },
    { id: 2, original_filename: "Te-gl_14.jpg", patient_name: "syaiful", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 0, created_at: "2026-06-25" },
    { id: 3, original_filename: "Te-gl_110.jpg", patient_name: "Ahmad", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 0, created_at: "2026-06-25" },
    { id: 4, original_filename: "Te-gl_140.jpg", patient_name: "syaiful", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 1, created_at: "2026-07-03" },
    { id: 5, original_filename: "Te-gl_110.jpg", patient_name: "ken", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 0, created_at: "2026-07-03" },
    { id: 6, original_filename: "Tr-gl_349.jpg", patient_name: "sisil", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 0, created_at: "2026-07-03" },
    { id: 7, original_filename: "Te-gl_140.jpg", patient_name: "beno", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 1, created_at: "2026-07-03" },
    { id: 8, original_filename: "Te-gl_15.jpg", patient_name: "ben", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 0, created_at: "2026-07-03" },
    { id: 9, original_filename: "Te-gl_102.jpg", patient_name: "naim", image_type: "MRI", model_used: "YOLOv8n", tumor_detected: 1, created_at: "2026-07-03" }
  ];

  useEffect(() => {
    fetch("http://localhost:8080/api/detections")
      .then((res) => {
        if (!res.ok) throw new Error("API bermasalah");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setHistoryData(data);
        } else if (data && Array.isArray(data.data)) {
          setHistoryData(data.data);
        } else {
          setHistoryData(dummyDatabaseData);
        }
      })
      .catch((err) => {
        console.warn("Menggunakan data fallback lokal:", err);
        setHistoryData(dummyDatabaseData);
      });
  }, []);

  const handleDeleteRow = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus riwayat deteksi ini?")) {
      fetch(`http://localhost:8080/api/detections/${id}`, { method: "DELETE" })
        .then(() => {
          setHistoryData(historyData.filter((item) => item.id !== id));
        })
        .catch((err) => console.error("Gagal menghapus:", err));
    }
  };

  const filteredData = historyData.filter((item) => {
    const namaPasien = item.patient_name || "Anonim";
    const namaFile = item.original_filename || "";
    
    const matchesSearch =
      namaPasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      namaFile.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusTumor = parseInt(item.tumor_detected) === 1 ? "Tumor" : "Normal";
    const matchesFilter = filterResult === "Semua" || statusTumor === filterResult;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen text-slate-800">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Riwayat Klinis</h1>
        <p className="text-sm font-semibold text-slate-500 mt-0.5">Total pemeriksaan medis yang tercatat dalam sistem</p>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari pasien atau file..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {["Semua", "Tumor", "Normal"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterResult(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                filterResult === tab 
                  ? "bg-blue-600 border-blue-600 text-white" 
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">File</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Pasien</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Jenis</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Model</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Hasil</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Waktu</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-xs font-medium text-slate-400">Tidak ada data riwayat deteksi.</td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FileText size={15} /></div>
                        <span className="text-xs font-bold text-slate-800">{row.original_filename}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-700 capitalize">{row.patient_name || "Anonim"}</td>
                    <td className="p-4 text-xs font-semibold text-slate-500">{row.image_type || "MRI"}</td>
                    <td className="p-4 text-xs font-mono font-medium text-slate-600">{row.model_used}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        parseInt(row.tumor_detected) === 1 
                          ? "bg-red-50 border border-red-100 text-red-600" 
                          : "bg-emerald-50 border border-emerald-100 text-emerald-600"
                      }`}>
                        {parseInt(row.tumor_detected) === 1 ? "Tumor" : "Normal"}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-500">
                      {row.created_at ? new Date(row.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => navigate(`/history/${row.id}`)} 
                          className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all"
                        >
                          Detail
                        </button>
                        <button onClick={() => handleDeleteRow(row.id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
// src/pages/DashboardPage.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowRight, Activity, AlertTriangle, CheckCircle, TrendingUp, Scan } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Data chart
const DATA_DISTRIBUSI = [
  { name: "Tumor", jumlah: 6, fill: "#ef4444" },  // Merah cerah
  { name: "Normal", jumlah: 7, fill: "#22c55e" }, // Hijau cerah
];

// Data tabel deteksi terbaru
const DETEKSI_TERBARU = [
  { id: 1, file: "Te-gl_102.jpg", info: "MRI • YOLOv8n • 3/7/2026", status: "Tumor", isUrgent: true },
  { id: 2, file: "Te-gl_15.jpg", info: "MRI • YOLOv8n • 3/7/2026", status: "Normal", isUrgent: false },
  { id: 3, file: "Te-gl_140.jpg", info: "MRI • YOLOv8n • 3/7/2026", status: "Tumor", isUrgent: true },
  { id: 4, file: "Te-gl_140.jpg", info: "MRI • YOLOv8n • 3/7/2026", status: "Tumor", isUrgent: true },
  { id: 5, file: "Tr-gl_349.jpg", info: "MRI • YOLOv8n • 3/7/2026", status: "Normal", isUrgent: false },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* ── HEADER DASHBOARD ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm font-semibold text-slate-500 mt-0.5">
            Selamat datang kembali, <span className="text-blue-600 font-bold">Rindiyani</span>
          </p>
        </div>
        <button 
          onClick={() => navigate("/deteksi-baru")} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/10 transition-all"
        >
          <Scan size={14} />
          Deteksi Baru
        </button>
      </div>

      {/* ── KARTU STATISTIK ATAS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Deteksi */}
        <div className="bg-white border border-sky-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Activity size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Deteksi</p>
            <p className="text-2xl font-black text-slate-900 leading-tight">13</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Semua waktu</p>
          </div>
        </div>

        {/* Tumor Terdeteksi */}
        <div className="bg-white border border-sky-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tumor Terdeteksi</p>
            <p className="text-2xl font-black text-slate-900 leading-tight">6</p>
            <p className="text-[11px] font-bold text-red-600 mt-0.5">46.2% dari total</p>
          </div>
        </div>

        {/* Hasil Normal */}
        <div className="bg-white border border-sky-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hasil Normal</p>
            <p className="text-2xl font-black text-slate-900 leading-tight">7</p>
            <p className="text-[11px] font-semibold text-green-600 font-bold mt-0.5">Bebas dari tumor</p>
          </div>
        </div>

        {/* Rata-rata Confidence */}
        <div className="bg-white border border-sky-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Confidence</p>
            <p className="text-2xl font-black text-slate-900 leading-tight">45.5%</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Akurasi rata-rata model</p>
          </div>
        </div>
      </div>

      {/* ── PANEL UTAMA GRAPH & TABEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* KOLOM KIRI: GRAFIK DISTRIBUSI HASIL (MENGGANTIKAN PLACEHOLDER GAMBAR 2) */}
        <div className="lg:col-span-5 bg-white border border-sky-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
            Distribusi Hasil
          </h2>
          
          {/* Container Chart Batang */}
          <div className="w-full h-64 pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_DISTRIBUSI} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  fontWeight={700}
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  fontWeight={600}
                  tickLine={false}
                  domain={[0, 8]}
                  tickCount={5}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                />
                <Bar 
                  dataKey="jumlah" 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={55}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KOLOM KANAN: TABEL DETEKSI TERBARU */}
        <div className="lg:col-span-7 bg-white border border-sky-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              Deteksi Terbaru
            </h2>
            <button 
              onClick={() => navigate("/riwayat")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline transition-all"
            >
              Lihat semua
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Daftar Row Deteksi */}
          <div className="divide-y divide-slate-100">
            {DETEKSI_TERBARU.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                    <Scan size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 tracking-wide">{item.file}</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">{item.info}</p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide border ${
                  item.isUrgent 
                    ? "bg-red-50 text-red-600 border-red-200" 
                    : "bg-green-50 text-green-600 border-green-200"
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
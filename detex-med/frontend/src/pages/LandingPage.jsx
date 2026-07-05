// src/pages/LandingPage.jsx
// Halaman landing publik yang menjelaskan DETEX-MED

import { Link } from "react-router-dom";
import { BrainCircuit, ScanLine, Shield, Zap, BarChart3, ArrowRight, Github } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Deteksi Real-Time",
    desc: "Analisis citra medis dalam hitungan milidetik menggunakan model YOLOv8/YOLOv11 yang dioptimasi.",
    color: "text-yellow-400 bg-yellow-400/10",
  },
  {
    icon: ScanLine,
    title: "Multi-Modalitas",
    desc: "Mendukung berbagai jenis citra medis: MRI, CT-Scan, dan X-Ray dalam satu platform.",
    color: "text-blue-400 bg-blue-400/10",
  },
  {
    icon: Shield,
    title: "Keamanan Data",
    desc: "Setiap akun terlindungi dengan JWT authentication. Data pasien tersimpan aman.",
    color: "text-green-400 bg-green-400/10",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analitik",
    desc: "Pantau riwayat deteksi, tingkat akurasi, dan statistik penggunaan di satu tempat.",
    color: "text-purple-400 bg-purple-400/10",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <BrainCircuit size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg">DETEX-MED</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Github size={18} />
            </a>
            <Link to="/login" className="btn-secondary text-sm px-4 py-2">
              Masuk
            </Link>
            <Link to="/register" className="btn-primary text-sm px-4 py-2">
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          DETEX-MED v1.0 — Sistem Deteksi Tumor AI
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Deteksi Tumor{" "}
          <span className="text-gradient">Lebih Cepat</span>
          <br />
          dengan Kecerdasan Buatan
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Sistem pendukung keputusan medis berbasis <strong className="text-slate-300">YOLOv8/YOLOv11</strong> yang
          membantu radiolog mendeteksi tumor pada citra MRI, CT-Scan, dan X-Ray secara otomatis dan akurat.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/register" className="btn-primary text-base px-8 py-3.5">
            Mulai Sekarang <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
            Sudah Punya Akun? Login
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16 pt-16 border-t border-slate-800">
          {[
            { value: "1.511", label: "Citra Training" },
            { value: "YOLOv8/11", label: "Arsitektur Model" },
            { value: "Real-Time", label: "Kecepatan Deteksi" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-blue-400">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-3">Fitur Unggulan</h2>
        <p className="text-slate-400 text-center mb-12">
          Dirancang khusus untuk mendukung alur kerja diagnostik medis modern
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="card hover:border-slate-700 transition-all duration-200">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="card bg-gradient-to-r from-blue-900/30 to-slate-900 border-blue-500/20 text-center py-12">
          <BrainCircuit size={40} className="text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Siap Memulai?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Daftar gratis dan mulai analisis citra medis Anda hari ini.
          </p>
          <Link to="/register" className="btn-primary text-base px-8 py-3.5">
            Buat Akun Gratis <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 DETEX-MED — Universitas Dian Nuswantoro</p>
        <p className="mt-1">
          Rindiyani Na'imah · Shafa Naila Kamal · Keysa Zahira F.A
        </p>
      </footer>
    </div>
  );
}

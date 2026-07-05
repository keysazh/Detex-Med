// src/pages/RegisterPage.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, User, Mail, Lock, Building2, UserCheck, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const ROLES = [
  { value: "radiologist", label: "Radiolog" },
  { value: "researcher", label: "Peneliti" },
  { value: "physician", label: "Dokter Umum" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    institution: "",
    role: "radiologist",
  });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }
    setIsLoading(true);
    try {
      await register(form);
      toast.success("Akun berhasil dibuat! Silakan login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registrasi gagal. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <BrainCircuit size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Buat Akun DETEX-MED</h1>
          <p className="text-slate-400 text-sm mt-1">Daftar untuk mulai menggunakan sistem</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="label">Nama Lengkap</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Dr. Budi Santoso"
                  value={form.full_name}
                  onChange={set("full_name")}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">Alamat Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="dokter@rsumsemarang.id"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  className="input pl-10 pr-11"
                  placeholder="Minimal 8 karakter"
                  value={form.password}
                  onChange={set("password")}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Institution */}
            <div>
              <label className="label">Institusi <span className="text-slate-500">(opsional)</span></label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="RSUP Dr. Kariadi Semarang"
                  value={form.institution}
                  onChange={set("institution")}
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="label">Profesi</label>
              <div className="relative">
                <UserCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <select
                  className="input pl-10 appearance-none"
                  value={form.role}
                  onChange={set("role")}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-2">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Membuat Akun...
                </span>
              ) : (
                "Buat Akun"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

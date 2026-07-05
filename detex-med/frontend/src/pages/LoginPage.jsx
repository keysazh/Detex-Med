// src/pages/Login.jsx
// Halaman Login dengan tema Clean Light Medical (Senada dengan Dashboard)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Selamat datang kembali!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Email atau password salah");
    }
  };

  return (
    /* PERBAIKAN UTAMA: Mengubah total background luar dari gelap menjadi biru medis cerah (bg-sky-50) */
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 p-4 transition-colors duration-300">
      
      {/* Bagian Logo dan Judul Atas */}
      <div className="flex flex-col items-center mb-6 text-center animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 mb-3">
          <BrainCircuit size={24} className="text-white" />
        </div>
        {/* Mengubah warna teks judul dari putih menjadi biru tua (text-blue-950) */}
        <h1 className="text-2xl font-bold text-blue-950 tracking-tight">
          Masuk ke DETEX-MED
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Sistem Deteksi Tumor Berbasis AI
        </p>
      </div>

      {/* Kotak Putih (Card Form) */}
      <div className="w-full max-w-md bg-white border border-sky-200/60 rounded-2xl p-8 shadow-xl shadow-sky-100/50 animate-slide-up">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Input Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block px-1">
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400
                           focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block px-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400
                           focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/10
                       hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* Link ke Registrasi */}
        <div className="mt-6 text-center text-sm text-slate-500 font-medium">
          Belum punya akun?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            Daftar di sini
          </button>
        </div>
      </div>

      {/* Catatan Kaki Bawah */}
      <p className="text-[11px] text-slate-400 font-medium mt-6 text-center tracking-wide">
        Khusus untuk tenaga medis dan peneliti terdaftar.
      </p>
    </div>
  );
}
// src/components/layout/AppLayout.jsx
// Layout utama dengan tema Premium Light Medical (Selaras & Bersih)

import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ScanLine,
  History,
  LogOut,
  Menu,
  BrainCircuit,
  User,
  ChevronRight,
  BarChart3,
  Database,
  BookOpen,
  Settings,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import clsx from "clsx";

// 1. Kategori Menu Utama
const MAIN_NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/detection", icon: ScanLine, label: "Deteksi Baru" },
  { to: "/history", icon: History, label: "Riwayat Klinis" },
];

// 2. Kategori Model & Data
const MODEL_NAV_ITEMS = [
  { to: "/model-performance", icon: BarChart3, label: "Performa Model" },
  { to: "/dataset", icon: Database, label: "Dataset MRI" },
];

// 3. Kategori Sistem & Bantuan
const SYSTEM_NAV_ITEMS = [
  { to: "/medical-guide", icon: BookOpen, label: "Panduan Medis" },
  { to: "/settings", icon: Settings, label: "Pengaturan" },
];

function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
          /* WARNA ITEM: Selaras dengan tema biru medis cerah */
          isActive
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold"
            : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
        )
      }
    >
      <Icon size={18} />
      <span>{label}</span>
      <ChevronRight size={14} className="ml-auto opacity-60" />
    </NavLink>
  );
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Berhasil logout. Sampai jumpa!");
    navigate("/login");
  };

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={clsx(
        /* WARNA SIDEBAR: Menggunakan bg-sky-100/70 cerah serasi dengan screenshot */
        "flex flex-col h-full bg-sky-100/70 border-r border-sky-200/50",
        mobile ? "w-72" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-sky-200/50">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
          <BrainCircuit size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-blue-950 text-base leading-tight tracking-tight">DETEX-MED</h1>
          <p className="text-slate-500 text-xs font-medium">Brain Tumor Detection AI</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        
        {/* KELOMPOK 1: MENU UTAMA */}
        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold px-4 mb-2">
            Menu Utama
          </p>
          {MAIN_NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} onClick={() => mobile && setSidebarOpen(false)} />
          ))}
        </div>

        {/* KELOMPOK 2: ANALISIS MODEL & DATA */}
        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold px-4 mb-2">
            Analisis & Model
          </p>
          {MODEL_NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} onClick={() => mobile && setSidebarOpen(false)} />
          ))}
        </div>

        {/* KELOMPOK 3: PUSAT BANTUAN */}
        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold px-4 mb-2">
            Sistem & Bantuan
          </p>
          {SYSTEM_NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} onClick={() => mobile && setSidebarOpen(false)} />
          ))}
        </div>

      </div>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-sky-200/50 space-y-3 bg-sky-100/40">
        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-sky-200/40 rounded-xl shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.full_name}</p>
            <p className="text-xs text-slate-500 truncate capitalize font-medium">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                     text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </aside>
  );

  return (
    /* WARNA LATAR BELAKANG UTAMA Halaman Dashboard & Riwayat */
    <div className="flex h-screen overflow-hidden bg-sky-50/60">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-sky-100/70 border-b border-sky-200/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-sky-200/40 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <BrainCircuit size={18} className="text-blue-600" />
            <span className="font-bold text-slate-800">DETEX-MED</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
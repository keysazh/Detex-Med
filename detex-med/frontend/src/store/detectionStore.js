// src/store/detectionStore.js
// State management untuk riwayat dan hasil deteksi

import { create } from "zustand";
import apiClient from "@/utils/apiClient";

export const useDetectionStore = create((set, get) => ({
  detections: [],
  currentDetection: null,
  stats: null,
  pagination: { total: 0, page: 1, per_page: 10, total_pages: 1 },
  isLoading: false,
  isUploading: false,

  // ── Upload & Detect ───────────────────────────────────────────────────────

  uploadAndDetect: async (formData) => {
    set({ isUploading: true });
    try {
      const response = await apiClient.post("/detections/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ currentDetection: response.data });
      // Refresh daftar setelah upload sukses
      get().fetchDetections();
      return response.data;
    } finally {
      set({ isUploading: false });
    }
  },

  // ── Fetch List ────────────────────────────────────────────────────────────

  fetchDetections: async (page = 1, per_page = 10) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get("/detections/", {
        params: { page, per_page },
      });
      const { items, total, total_pages } = response.data;
      set({
        detections: items,
        pagination: { total, page, per_page, total_pages },
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Fetch Single ──────────────────────────────────────────────────────────

  fetchDetectionById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get(`/detections/${id}`);
      set({ currentDetection: response.data });
      return response.data;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Dashboard Stats ───────────────────────────────────────────────────────

  fetchStats: async () => {
    const response = await apiClient.get("/detections/dashboard");
    set({ stats: response.data });
    return response.data;
  },

  // ── Delete ────────────────────────────────────────────────────────────────

  deleteDetection: async (id) => {
    await apiClient.delete(`/detections/${id}`);
    set((state) => ({
      detections: state.detections.filter((d) => d.id !== id),
    }));
  },

  // ── Utils ─────────────────────────────────────────────────────────────────

  clearCurrent: () => set({ currentDetection: null }),
}));

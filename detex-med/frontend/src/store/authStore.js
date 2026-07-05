// src/store/authStore.js
// State management untuk autentikasi menggunakan Zustand
// Data user & token di-persist ke localStorage

import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "@/utils/apiClient";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // ── Actions ──────────────────────────────────────────────────────────

      login: async (email, password) => {
        const response = await apiClient.post("/auth/login", { email, password });
        const { access_token, user } = response.data;
        set({ token: access_token, user, isAuthenticated: true });
        return user;
      },

      register: async (payload) => {
        const response = await apiClient.post("/auth/register", payload);
        return response.data;
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      refreshUser: async () => {
        try {
          const response = await apiClient.get("/auth/me");
          set({ user: response.data });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: "detexmed-auth",
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// src/store/authStore.js

import { create } from "zustand";
import { api, ApiError } from "@/lib/api";

const errorMessage = (err, fallback) =>
  err instanceof ApiError ? err.message : fallback;

// 1. Initialize BroadcastChannel (Guarded for SSR/Next.js)
const authChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("auth_channel")
    : null;

export const useAuthStore = create((set, get) => {
  // Listen for logout events coming from OTHER tabs
  if (authChannel) {
    authChannel.onmessage = (event) => {
      if (event.data?.type === "LOGOUT") {
        set({
          user: null,
          mustChangePassword: false,
          hydrated: true,
          error: null,
        });
      }
    };
  }

  return {
    user: null,
    mustChangePassword: false,
    hydrated: false,
    isLoading: false,
    error: null,

    login: async ({ email, password }) => {
      set({ isLoading: true, error: null });
      try {
        const res = await api.login({ email, password });
        const userData = res.data?.user || res.user || null;
        set({
          user: userData,
          mustChangePassword: !!res.data?.mustChangePassword,
          hydrated: true,
          isLoading: false,
          error: null,
        });

        // Broadcast LOGIN to sync other tabs if needed
        authChannel?.postMessage({ type: "LOGIN" });

        return { success: true, user: userData };
      } catch (err) {
        const message = errorMessage(err, "Login failed. Please try again.");
        set({ isLoading: false, error: message });
        return { success: false, error: message };
      }
    },

    registerSchool: async (payload) => {
      set({ isLoading: true, error: null });
      try {
        const res = await api.registerSchool(payload);
        const userData = res.data?.user || res.user || null;
        set({
          user: userData,
          mustChangePassword: false,
          hydrated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, user: userData };
      } catch (err) {
        const message = errorMessage(err, "Registration failed.");
        set({ isLoading: false, error: message });
        return { success: false, error: message };
      }
    },

    fetchMe: async () => {
      try {
        const res = await api.me();
        const userData = res.data?.user || res.user || null;
        if (userData) {
          set({
            user: userData,
            hydrated: true,
            mustChangePassword: !!res.data?.mustChangePassword,
          });
          return { success: true, user: userData };
        }
        set({ user: null, hydrated: true });
        return { success: false };
      } catch (err) {
        set({ user: null, hydrated: true });
        return { success: false, status: err?.status || 0 };
      }
    },

    /**
     * Logout — server revokes session, local state is cleared,
     * and a message is broadcasted to all other open tabs.
     */
    logout: async () => {
      try {
        await api.logout();
      } catch {
        /* ignore network failure */
      }

      // Clear local state
      set({
        user: null,
        mustChangePassword: false,
        hydrated: true,
        error: null,
      });

      // 2. Broadcast logout event to all other tabs
      authChannel?.postMessage({ type: "LOGOUT" });
    },

    hydrateAfterVerify: async () => {
      set({ isLoading: true });
      try {
        const res = await api.me();
        const userData = res.data?.user || res.user || null;
        set({
          user: userData,
          mustChangePassword: !!res.data?.mustChangePassword,
          hydrated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, user: userData };
      } catch (err) {
        const message = errorMessage(err, "Failed to load your account.");
        set({ isLoading: false, error: message, hydrated: true });
        return { success: false, error: message };
      }
    },

    forgotPassword: async ({ email }) => {
      set({ isLoading: true, error: null });
      try {
        const res = await api.forgotPassword({ email });
        set({ isLoading: false });
        return { success: true, message: res.message || "Check your email." };
      } catch (err) {
        const message = errorMessage(err, "Failed to process request.");
        set({ isLoading: false, error: message });
        return { success: false, error: message };
      }
    },

    resetPassword: async ({ resetToken, newPassword }) => {
      set({ isLoading: true, error: null });
      try {
        const res = await api.resetPassword({ resetToken, newPassword });
        set({ isLoading: false });
        return { success: true, message: res.message || "Password reset." };
      } catch (err) {
        const message = errorMessage(err, "Password reset failed.");
        set({ isLoading: false, error: message });
        return { success: false, error: message };
      }
    },

    changePassword: async (oldPassword, newPassword) => {
      set({ isLoading: true, error: null });
      try {
        const res = await api.changePassword({ oldPassword, newPassword });
        set({ isLoading: false, mustChangePassword: false });
        return { success: true, message: res.message || "Password updated." };
      } catch (err) {
        const message = errorMessage(err, "Failed to change password.");
        set({ isLoading: false, error: message });
        return { success: false, error: message };
      }
    },

    clearError: () => set({ error: null }),
  };
});
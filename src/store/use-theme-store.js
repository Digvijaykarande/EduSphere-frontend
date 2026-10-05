import { create } from "zustand";

const STORAGE_KEY = "edusphere-theme";

function applyTheme(theme) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
}

export const useThemeStore = create((set, get) => ({
  theme: "light",
  hydrated: false,

  // Call once on app mount (e.g. in DashboardLayout) to read the saved
  // preference and apply it before paint-sensitive content renders.
  hydrate: () => {
    if (get().hydrated || typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    const theme = saved === "dark" ? "dark" : "light";
    applyTheme(theme);
    set({ theme, hydrated: true });
  },

  setTheme: (theme) => {
    applyTheme(theme);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },
}));
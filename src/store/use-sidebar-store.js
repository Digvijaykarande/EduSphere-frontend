import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  isOpen: true,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  setSidebar: (value) => set({ isOpen: value }),
}));
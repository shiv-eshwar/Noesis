"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ThemeMode = "system" | "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
};

type ThemeActions = {
  setMode: (mode: ThemeMode) => void;
};

export const useTheme = create<ThemeState & ThemeActions>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "noesis-theme",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ mode: s.mode }),
    },
  ),
);
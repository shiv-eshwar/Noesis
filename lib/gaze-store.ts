"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
type State = { enabled: boolean; consented: boolean };
type Actions = { setEnabled: (v: boolean) => void; setConsented: (v: boolean) => void };
export function gazeIsActive(s: { enabled: boolean; consented: boolean }) { return s.enabled && s.consented; }
export const useGaze = create<State & Actions>()(persist((set) => ({
  enabled: false, consented: false,
  setEnabled: (enabled) => set({ enabled }),
  setConsented: (consented) => set({ consented }),
}), { name: "noesis-gaze", storage: createJSONStorage(() => localStorage) }));

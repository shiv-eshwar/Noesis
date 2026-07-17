"use client";

import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSessionUser, isAnonymousUser } from "@/lib/auth";

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
};

type AuthActions = {
  refresh: () => Promise<void>;
  init: () => () => void;
};

export const useAuth = create<AuthState & AuthActions>()((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  refresh: async () => {
    set({ loading: true });
    const user = await getSessionUser();
    set({ user, loading: false, initialized: true });
  },

  init: () => {
    if (get().initialized) {
      return () => {};
    }

    const supabase = getSupabaseBrowserClient();
    void get().refresh();

    if (!supabase) {
      set({ loading: false, initialized: true });
      return () => {};
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        user: session?.user ?? null,
        loading: false,
        initialized: true,
      });
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  },
}));

export function selectIsAnonymous(s: AuthState): boolean {
  return isAnonymousUser(s.user);
}

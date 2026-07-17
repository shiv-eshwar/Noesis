"use client";

import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function isAnonymousUser(user: User | null | undefined): boolean {
  if (!user) return false;
  // Supabase marks anonymous users via is_anonymous (newer) or app_metadata.
  const meta = user.app_metadata as { provider?: string; providers?: string[] };
  if (user.is_anonymous === true) return true;
  if (meta?.provider === "anonymous") return true;
  if (Array.isArray(meta?.providers) && meta.providers.length === 1 && meta.providers[0] === "anonymous") {
    return true;
  }
  return !user.email;
}

export async function getSessionUser(): Promise<User | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn("[noesis] getSession failed", error.message);
    return null;
  }
  return data.session?.user ?? null;
}

/** Ensure a session exists — reuse current, else anonymous. */
export async function ensureSession(): Promise<User | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const existing = await getSessionUser();
  if (existing) return existing;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.warn("[noesis] anonymous sign-in failed", error.message);
    return null;
  }
  return data.user ?? null;
}

/**
 * Upgrade the current anonymous user in place by attaching an email.
 * Keeps the same user id so journeys RLS rows stay owned.
 */
export async function requestEmailUpgrade(email: string): Promise<{ ok: boolean; message: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) {
    return { ok: false, message: "Enter a valid email." };
  }

  const user = await ensureSession();
  if (!user) {
    return { ok: false, message: "Could not start a session." };
  }

  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/`
      : undefined;

  if (isAnonymousUser(user)) {
    // Convert anonymous → email in place so journeys stay on the same user id.
    const { error } = await supabase.auth.updateUser(
      { email: trimmed },
      redirectTo ? { emailRedirectTo: redirectTo } : undefined,
    );
    if (!error) {
      return {
        ok: true,
        message: "Check your email to confirm. Your journey stays with this account.",
      };
    }
    // Email already belongs to another account — magic-link into that identity.
    const alreadyTaken =
      /already|registered|exists|taken/i.test(error.message) ||
      error.status === 422;
    if (!alreadyTaken) {
      return { ok: false, message: error.message };
    }
  }

  // Permanent user, or recovering an existing email on another device.
  const { error } = await supabase.auth.signInWithOtp({
    email: trimmed,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: redirectTo,
    },
  });
  if (error) {
    return { ok: false, message: error.message };
  }
  return {
    ok: true,
    message: "Check your email for a sign-in link.",
  };
}

export async function signOut(): Promise<{ ok: boolean; message?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { ok: false, message: "Supabase is not configured." };

  const { error } = await supabase.auth.signOut();
  if (error) {
    return { ok: false, message: error.message };
  }
  return { ok: true };
}

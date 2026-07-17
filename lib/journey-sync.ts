"use client";

import { ensureSession } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { JourneyRow } from "@/lib/supabase/types";
import { useJourney } from "@/lib/store";
import type { Journey, LayerProgress } from "@/lib/types";

const DEBOUNCE_MS = 800;

let syncStarted = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let remoteId: string | null = null;
let pushing = false;

function rowToJourney(row: JourneyRow): Journey {
  return {
    topic: row.topic,
    createdAt: new Date(row.created_at).getTime(),
    currentIndex: row.current_index,
    usedPlacement: row.used_placement,
    layers: Array.isArray(row.layers) ? (row.layers as LayerProgress[]) : [],
  };
}

function journeyRicher(a: Journey, b: Journey | null): boolean {
  if (!b) return true;
  if (a.layers.length !== b.layers.length) return a.layers.length > b.layers.length;
  if (a.currentIndex !== b.currentIndex) return a.currentIndex > b.currentIndex;
  return a.createdAt >= b.createdAt;
}

/** @deprecated use ensureSession — kept name for call sites */
export async function ensureAnonSession(): Promise<string | null> {
  const user = await ensureSession();
  return user?.id ?? null;
}

async function fetchLatestRow(): Promise<JourneyRow | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("journeys")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn("[noesis] fetch journey failed", error.message);
    return null;
  }
  return (data as JourneyRow | null) ?? null;
}

async function upsertJourney(journey: Journey): Promise<void> {
  if (pushing) return;
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const userId = await ensureAnonSession();
  if (!userId) return;

  pushing = true;
  try {
    const payload = {
      user_id: userId,
      topic: journey.topic,
      created_at: new Date(journey.createdAt).toISOString(),
      updated_at: new Date().toISOString(),
      current_index: journey.currentIndex,
      used_placement: journey.usedPlacement ?? false,
      layers: journey.layers,
    };

    if (remoteId) {
      const { error } = await supabase
        .from("journeys")
        .update(payload)
        .eq("id", remoteId)
        .eq("user_id", userId);
      if (error) console.warn("[noesis] update journey failed", error.message);
      return;
    }

    const { data, error } = await supabase
      .from("journeys")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.warn("[noesis] insert journey failed", error.message);
      return;
    }
    remoteId = data.id as string;
    useJourney.setState({ remoteJourneyId: remoteId });
  } finally {
    pushing = false;
  }
}

async function deleteRemoteJourney(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase || !remoteId) {
    remoteId = null;
    return;
  }
  const userId = await ensureAnonSession();
  if (!userId) return;

  const { error } = await supabase
    .from("journeys")
    .delete()
    .eq("id", remoteId)
    .eq("user_id", userId);
  if (error) console.warn("[noesis] delete journey failed", error.message);
  remoteId = null;
  useJourney.setState({ remoteJourneyId: null });
}

function schedulePush(journey: Journey | null): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (!journey) {
    void deleteRemoteJourney();
    return;
  }
  debounceTimer = setTimeout(() => {
    void upsertJourney(journey);
  }, DEBOUNCE_MS);
}

/** Re-fetch remote journey for the current session user (after auth changes). */
export async function refreshJourneyFromRemote(): Promise<void> {
  const user = await ensureSession();
  if (!user) return;

  const row = await fetchLatestRow();
  if (!row) {
    remoteId = null;
    return;
  }

  remoteId = row.id;
  const remote = rowToJourney(row);
  const local = useJourney.getState().journey;
  if (journeyRicher(remote, local)) {
    useJourney.getState().hydrateFromRemote(remote, row.id);
  } else {
    useJourney.setState({ remoteJourneyId: row.id });
    if (local) schedulePush(local);
  }
}

/** Start session (anon if needed), hydrate from Supabase, subscribe to store + auth. */
export function startJourneySync(): () => void {
  if (typeof window === "undefined") return () => {};
  if (syncStarted) return () => {};
  syncStarted = true;

  let unsubJourney: (() => void) | undefined;
  let unsubAuth: { subscription: { unsubscribe: () => void } } | undefined;
  let cancelled = false;

  void (async () => {
    await ensureSession();
    if (cancelled) return;

    if (!useJourney.persist.hasHydrated()) {
      await new Promise<void>((resolve) => {
        const done = useJourney.persist.onFinishHydration(() => resolve());
        if (useJourney.persist.hasHydrated()) {
          done();
          resolve();
        }
      });
    }
    if (cancelled) return;

    await refreshJourneyFromRemote();
    if (cancelled) return;

    unsubJourney = useJourney.subscribe((state, prev) => {
      remoteId = state.remoteJourneyId;
      if (state.journey === prev.journey) return;
      schedulePush(state.journey);
    });

    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((event) => {
        if (
          event === "SIGNED_IN" ||
          event === "SIGNED_OUT" ||
          event === "USER_UPDATED" ||
          event === "TOKEN_REFRESHED"
        ) {
          if (event === "SIGNED_OUT") {
            remoteId = null;
            useJourney.setState({ remoteJourneyId: null });
          }
          void (async () => {
            if (event === "SIGNED_OUT") {
              await ensureSession();
            }
            await refreshJourneyFromRemote();
          })();
        }
      });
      unsubAuth = data;
    }
  })();

  return () => {
    cancelled = true;
    syncStarted = false;
    unsubJourney?.();
    unsubAuth?.subscription.unsubscribe();
    if (debounceTimer) clearTimeout(debounceTimer);
  };
}

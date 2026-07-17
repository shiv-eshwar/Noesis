"use client";

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

export async function ensureAnonSession(): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const { data: existing } = await supabase.auth.getSession();
  if (existing.session?.user?.id) return existing.session.user.id;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.warn("[noesis] anonymous sign-in failed", error.message);
    return null;
  }
  return data.user?.id ?? null;
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

/** Start anonymous session, hydrate from Supabase, subscribe to store changes. */
export function startJourneySync(): () => void {
  if (typeof window === "undefined") return () => {};
  if (syncStarted) return () => {};
  syncStarted = true;

  let unsub: (() => void) | undefined;
  let cancelled = false;

  void (async () => {
    await ensureAnonSession();
    if (cancelled) return;

    // Wait for localStorage rehydrate so we can compare.
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

    const row = await fetchLatestRow();
    if (cancelled) return;

    if (row) {
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

    unsub = useJourney.subscribe((state, prev) => {
      remoteId = state.remoteJourneyId;
      if (state.journey === prev.journey) return;
      schedulePush(state.journey);
    });
  })();

  return () => {
    cancelled = true;
    syncStarted = false;
    unsub?.();
    if (debounceTimer) clearTimeout(debounceTimer);
  };
}

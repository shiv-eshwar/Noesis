"use client";

import { useEffect, useState } from "react";
import { useTheme, type ThemeMode } from "@/lib/theme-store";

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  if (mode === "dark") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    );
  }
  if (mode === "light") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

export function ThemeToggle() {
  const mode = useTheme((s) => s.mode);
  const setMode = useTheme((s) => s.setMode);
  const [hydrated, setHydrated] = useState(false);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const done = () => setHydrated(true);
    if (useTheme.persist.hasHydrated()) done();
    return useTheme.persist.onFinishHydration(done);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (mode === "system") {
      delete root.dataset.theme;
      return;
    }
    root.dataset.theme = mode;
  }, [mode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemDark(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [hydrated]);

  if (!hydrated) return null;

  const effectiveMode: Exclude<ThemeMode, "system"> =
    mode === "system" ? (systemDark ? "dark" : "light") : mode;
  const nextMode: Exclude<ThemeMode, "system"> =
    effectiveMode === "dark" ? "light" : "dark";
  const label = `Theme: ${effectiveMode} (click for ${nextMode})`;

  return (
    <button
      type="button"
      className="theme-toggle ui"
      onClick={() => setMode(nextMode)}
      aria-label={label}
      title={label}
    >
      <ThemeIcon mode={effectiveMode} />
    </button>
  );
}
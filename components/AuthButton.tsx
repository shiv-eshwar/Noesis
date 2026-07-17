"use client";

import { useState } from "react";
import { signOut, isAnonymousUser } from "@/lib/auth";
import { useAuth } from "@/lib/auth-store";
import { AuthModal } from "./AuthModal";

export function AuthButton() {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const anonymous = isAnonymousUser(user);
  const label = loading
    ? "…"
    : !user || anonymous
      ? "Sign in"
      : user.email?.split("@")[0] ?? "Account";

  const onSignOut = async () => {
    setBusy(true);
    await signOut();
    setBusy(false);
  };

  return (
    <>
      {!user || anonymous ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ui text-sm text-ink-mute hover:text-ink-soft transition-colors"
        >
          {label}
        </button>
      ) : (
        <button
          type="button"
          onClick={onSignOut}
          disabled={busy}
          title={user.email ?? "Sign out"}
          className="ui text-sm text-ink-mute hover:text-ink-soft transition-colors disabled:opacity-40"
        >
          {busy ? "…" : "Sign out"}
        </button>
      )}
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

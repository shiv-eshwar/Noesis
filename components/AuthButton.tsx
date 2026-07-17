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
  const signedIn = Boolean(user && !anonymous);

  const onSignOut = async () => {
    setBusy(true);
    await signOut();
    setBusy(false);
  };

  return (
    <>
      {!signedIn ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={loading}
          className="ui text-sm text-ink-mute hover:text-ink-soft transition-colors disabled:opacity-40"
        >
          {loading ? "…" : "Sign in"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onSignOut}
          disabled={busy}
          title="Sign out"
          className="ui text-sm text-ink-mute hover:text-ink-soft transition-colors disabled:opacity-40"
        >
          {busy ? "…" : user?.email ?? "Sign out"}
        </button>
      )}
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

"use client";

import { useState } from "react";
import { requestEmailUpgrade } from "@/lib/auth";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setError(null);
    const result = await requestEmailUpgrade(email);
    setBusy(false);
    if (result.ok) {
      setMessage(result.message);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="measure w-full page-panel p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="display text-2xl">Save your journey</h2>
          <button
            type="button"
            onClick={onClose}
            className="ui text-sm text-ink-mute hover:text-ink-soft"
          >
            Close
          </button>
        </div>
        <p className="ui text-sm text-ink-mute mb-6">
          Save this journey to your email. You can keep learning without an
          account.
        </p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ui w-full px-4 py-3 border border-rule rounded bg-paper text-ink outline-none focus:border-ink-soft"
          />
          <button
            type="submit"
            disabled={busy || !email.trim()}
            className="ui text-sm border border-rule rounded px-5 py-2 hover:border-ink-faint disabled:opacity-40"
          >
            {busy ? "Sending…" : "Email me a link"}
          </button>
        </form>
        {message && (
          <p className="ui text-sm text-ink-soft mt-4">{message}</p>
        )}
        {error && (
          <p className="ui text-sm text-ink-mute mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}

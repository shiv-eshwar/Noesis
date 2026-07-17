"use client";
export function GazeContinueButton({ onContinue }: { onContinue: () => void; gazeActive?: boolean; progress?: number; cameraStatus?: string; cameraError?: string | null }) {
  return (
    <button type="button" onClick={onContinue} className="ui text-sm border border-rule rounded px-5 py-2 hover:border-ink-faint">
      I&apos;ve read this
    </button>
  );
}

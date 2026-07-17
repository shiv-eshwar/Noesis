"use client";
import type { PlacementQuestion } from "@/lib/types";
export function PlacementModal({ open, topic, questions, onComplete }: {
  open: boolean; topic: string; questions: PlacementQuestion[];
  onComplete: (selections: (number | null)[]) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="measure page-panel p-6 text-center">
        <h2 className="display text-2xl mb-2">Placement</h2>
        <p className="ui text-sm text-ink-mute mb-4">{topic} · {questions.length} questions</p>
        <button type="button" className="ui border border-rule rounded px-4 py-2" onClick={() => onComplete(questions.map(() => null))}>
          Skip placement (placeholder)
        </button>
      </div>
    </div>
  );
}

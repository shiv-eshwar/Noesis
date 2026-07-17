"use client";
import type { Layer } from "@/lib/types";
export type ReaderPhase = "enter" | "dissolve" | "hold";
export function Reader({ layer, phase }: { layer: Layer; phase: ReaderPhase; animationKey: number; onExit: () => void }) {
  return (
    <div>
      <h2 className="display text-2xl mb-4">{layer.title}</h2>
      <p className="ui text-xs text-ink-faint mb-4">{layer.layerLabel} · {phase}</p>
      {layer.paragraphs.map((p, i) => (
        <p key={i} className="mb-4 text-ink">{p}</p>
      ))}
      <button type="button" onClick={() => {}} className="ui text-sm text-ink-mute">Exit</button>
    </div>
  );
}

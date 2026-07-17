"use client";
export function DepthRail({ depthIndex }: { depthIndex: number }) {
  return <div className="ui text-xs text-ink-faint">Depth {depthIndex + 1}</div>;
}

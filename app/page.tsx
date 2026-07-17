"use client";

import { Landing } from "@/components/Landing";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useJourney } from "@/lib/store";

export default function Page() {
  const journey = useJourney((s) => s.journey);
  const status = useJourney((s) => s.status);

  return (
    <div className="app-shell">
      <div className="top-controls">
        <ThemeToggle />
      </div>
      <div className="app-shell__main">
        {!journey ? (
          <Landing />
        ) : (
          <div className="measure w-full page-panel viewport-panel">
            <div className="viewport-body flex items-center justify-center">
              <div className="text-center">
                <h2 className="display display--viewport title-shimmer mb-4">
                  {journey.topic}
                </h2>
                <p className="ui text-sm text-ink-mute mb-2">{status}</p>
                <p className="ui text-sm text-ink-faint">
                  Journey started. Orchestrator lands next.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

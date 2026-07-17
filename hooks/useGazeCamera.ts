"use client";
import { useCallback, useRef } from "react";
export type GazeCameraStatus = "idle" | "requesting" | "ready" | "denied" | "error";
export function useGazeCamera(_opts: {
  active: boolean; gestureEnabled?: boolean; fingerSelectEnabled?: boolean;
  maxFingerChoices?: number; onHoldComplete?: () => void; onFingerSelect?: (count: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const resetProgress = useCallback(() => {}, []);
  const resetCalibration = useCallback(() => {}, []);
  return {
    videoRef, status: "idle" as GazeCameraStatus, progress: 0, looking: false,
    analysis: { handVisible: false, velocityX: 0, deltaX: 0, deltaY: 0, swipeDetected: false, rawCount: 0, fingerCount: 0, selectionConfirmed: false, selectedValue: null },
    error: null as string | null, resetProgress, resetCalibration,
  };
}

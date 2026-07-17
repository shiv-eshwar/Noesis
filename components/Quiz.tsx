"use client";
import { forwardRef, useImperativeHandle } from "react";
import type { QuizAnswer, QuizQuestion } from "@/lib/types";
export type QuizHandle = { applyFingerChoice: (count: number) => void };
export const Quiz = forwardRef<QuizHandle, {
  questions: QuizQuestion[];
  layerContext: string;
  onSubmit: (answers: QuizAnswer[], passed: boolean) => void;
  handsFree?: boolean;
  fingerPreview?: number;
}>(function Quiz({ onSubmit, questions }, ref) {
  useImperativeHandle(ref, () => ({ applyFingerChoice() {} }));
  return (
    <div className="ui">
      <p className="mb-4">Quiz placeholder ({questions.length} questions)</p>
      <button type="button" className="border border-rule rounded px-4 py-2" onClick={() => onSubmit([], true)}>
        Pass (placeholder)
      </button>
    </div>
  );
});

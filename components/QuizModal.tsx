"use client";
import type { RefObject } from "react";
import { Quiz, type QuizHandle } from "./Quiz";
import type { QuizAnswer, QuizQuestion } from "@/lib/types";
export function QuizModal({ open, formKey, questions, layerContext, onSubmit, onDismiss, handsFree, fingerPreview, quizRef }: {
  open: boolean; formKey: number; questions: QuizQuestion[]; layerContext: string;
  onSubmit: (a: QuizAnswer[], passed: boolean) => void; onDismiss: () => void;
  handsFree?: boolean; fingerPreview?: number; quizRef: RefObject<QuizHandle | null>;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="measure w-full page-panel p-6">
        <button type="button" className="ui text-sm mb-4" onClick={onDismiss}>Close</button>
        <Quiz key={formKey} ref={quizRef} questions={questions} layerContext={layerContext} onSubmit={onSubmit} handsFree={handsFree} fingerPreview={fingerPreview} />
      </div>
    </div>
  );
}

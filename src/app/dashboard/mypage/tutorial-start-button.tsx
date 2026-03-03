"use client";

import { GraduationCap } from "lucide-react";

export function TutorialStartButton() {
  const startTutorial = () => {
    window.dispatchEvent(new Event("invoice-tutorial:start"));
  };

  return (
    <button
      type="button"
      onClick={startTutorial}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 border border-indigo-200 transition-all"
    >
      <GraduationCap className="w-4 h-4" />
      チュートリアル
    </button>
  );
}

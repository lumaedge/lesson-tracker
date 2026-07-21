"use client";

import type { LessonStatus } from "@/lib/types";

const CYCLE: LessonStatus[] = ["", "Started", "Done"];

const STYLES: Record<LessonStatus, string> = {
  "": "bg-slate-100 text-slate-400 border-slate-200",
  Started: "bg-amber-50 text-amber-700 border-amber-300",
  Done: "bg-emerald-50 text-emerald-700 border-emerald-300",
};

export default function LessonCell({
  status,
  onToggle,
}: {
  status: LessonStatus;
  onToggle: () => void;
}) {
  const label = status || "—";

  return (
    <button
      onClick={onToggle}
      className={`w-full text-xs font-medium py-2 px-1 rounded-md border transition-all hover:shadow-sm cursor-pointer ${STYLES[status]}`}
      title="Click to cycle: Empty → Started → Done"
    >
      {label}
    </button>
  );
}

export function cycleStatus(current: LessonStatus): LessonStatus {
  const idx = CYCLE.indexOf(current);
  return CYCLE[(idx + 1) % CYCLE.length];
}

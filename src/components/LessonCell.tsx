"use client";

export type LessonStatus = "" | "Started" | "Done";

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
      className={`w-full text-[11px] md:text-xs font-medium min-h-[36px] md:min-h-[28px] py-1.5 md:py-2 px-1 rounded-md border transition-all hover:shadow-sm active:scale-95 cursor-pointer ${STYLES[status]}`}
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

export function prismaStatusToDisplay(status: string): LessonStatus {
  if (status === "DONE") return "Done";
  if (status === "STARTED") return "Started";
  return "";
}

export function displayToPrismaStatus(status: LessonStatus): string {
  if (status === "Done") return "DONE";
  if (status === "Started") return "STARTED";
  return "NOT_STARTED";
}

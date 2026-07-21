"use client";

import type { ClassData, LessonStatus } from "@/lib/types";
import { LESSON_NAMES } from "@/lib/types";
import LessonCell, { cycleStatus } from "./LessonCell";
import ProgressBar from "./ProgressBar";

export default function ClassCard({
  cls,
  onToggle,
  onNotesChange,
}: {
  cls: ClassData;
  onToggle: (classId: string, lessonIndex: number) => void;
  onNotesChange: (classId: string, notes: string) => void;
}) {
  const done = cls.lessons.filter((s) => s === "Done").length;
  const progress = done / 5;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-lg font-bold text-[#1F3864]">
            {cls.classCode}
          </span>
          <span className="text-xs text-slate-400 ml-2">
            Grade {cls.grade}
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">{cls.day}</div>
          <div className="text-xs text-slate-400">{cls.period}</div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-3">
        {cls.lessons.map((status, i) => (
          <div key={i} className="text-center">
            <div className="text-[10px] text-slate-400 mb-1 hidden">
              L{i + 1}
            </div>
            <LessonCell
              status={status}
              onToggle={() => onToggle(cls.id, i)}
            />
          </div>
        ))}
      </div>

      <div className="mb-3">
        <ProgressBar value={progress} />
      </div>

      <input
        type="text"
        value={cls.notes}
        onChange={(e) => onNotesChange(cls.id, e.target.value)}
        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-[#1F3864] outline-none transition-colors"
        placeholder="Notes..."
      />
    </div>
  );
}

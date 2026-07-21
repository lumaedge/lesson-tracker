"use client";

import { useState, useMemo } from "react";
import type { ClassData, LessonStatus } from "@/lib/types";
import { LESSON_NAMES, LESSON_WEEKS, sortClasses } from "@/lib/types";
import LessonCell, { cycleStatus } from "./LessonCell";
import ClassCard from "./ClassCard";
import ProgressBar from "./ProgressBar";

export default function ClassGrid({ initialClasses }: { initialClasses: ClassData[] }) {
  const [classes, setClasses] = useState(initialClasses);
  const sorted = useMemo(() => sortClasses(classes), [classes]);

  async function toggleLesson(classId: string, lessonIndex: number) {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        const newLessons = [...c.lessons] as [
          LessonStatus, LessonStatus, LessonStatus, LessonStatus, LessonStatus
        ];
        newLessons[lessonIndex] = cycleStatus(newLessons[lessonIndex]);
        return { ...c, lessons: newLessons };
      })
    );

    const cls = classes.find((c) => c.id === classId);
    if (!cls) return;
    const newStatus = cycleStatus(cls.lessons[lessonIndex]);

    await fetch(`/api/classes/${classId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonIndex, status: newStatus }),
    });
  }

  async function updateNotes(classId: string, notes: string) {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, notes } : c))
    );

    await fetch(`/api/classes/${classId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
  }

  async function updateTotalStudents(classId: string, total: number) {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, totalStudents: total } : c))
    );

    await fetch(`/api/classes/${classId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalStudents: total }),
    });
  }

  return (
    <>
      {/* Mobile: card layout */}
      <div className="block md:hidden">
        <div className="grid gap-3">
          {sorted.map((cls) => (
            <ClassCard
              key={cls.id}
              cls={cls}
              onToggle={toggleLesson}
              onNotesChange={updateNotes}
              onTotalStudentsChange={updateTotalStudents}
            />
          ))}
        </div>
      </div>

      {/* Desktop: table layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 px-3 py-2 border-b border-slate-200">
                Day
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 px-3 py-2 border-b border-slate-200">
                Period
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 px-3 py-2 border-b border-slate-200">
                Grade
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 px-3 py-2 border-b border-slate-200">
                Class
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 px-3 py-2 border-b border-slate-200">
                Size
              </th>
              {LESSON_NAMES.map((name, i) => (
                <th
                  key={i}
                  className="text-center text-xs font-semibold text-slate-500 px-2 py-2 border-b border-slate-200 min-w-[100px]"
                >
                  <div className="text-[#1F3864]">Lesson {i + 1}</div>
                  <div className="font-normal text-slate-400 mt-0.5">
                    {LESSON_WEEKS[i]}
                  </div>
                  <div className="font-normal text-slate-500">{name}</div>
                </th>
              ))}
              <th className="text-center text-xs font-semibold text-slate-500 px-3 py-2 border-b border-slate-200 min-w-[120px]">
                Progress
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 px-3 py-2 border-b border-slate-200 min-w-[120px]">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((cls) => {
              const done = cls.lessons.filter((s) => s === "Done").length;
              const progress = done / 5;

              return (
                <tr key={cls.id} className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-sm text-slate-700 border-b border-slate-100">
                    {cls.day}
                  </td>
                  <td className="px-3 py-2 text-sm text-slate-700 border-b border-slate-100">
                    {cls.period}
                  </td>
                  <td className="px-3 py-2 text-sm font-medium text-slate-700 border-b border-slate-100">
                    {cls.grade}
                  </td>
                  <td className="px-3 py-2 text-sm font-semibold text-[#1F3864] border-b border-slate-100">
                    {cls.classCode}
                  </td>
                  <td className="px-2 py-2 border-b border-slate-100">
                    <input
                      type="number"
                      min={0}
                      value={cls.totalStudents || ""}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        updateTotalStudents(cls.id, isNaN(val) ? 0 : val);
                      }}
                      className="w-14 text-xs px-1 py-1 rounded border border-slate-200 focus:border-[#1F3864] outline-none text-center"
                      placeholder="0"
                    />
                  </td>
                  {cls.lessons.map((status, i) => (
                    <td key={i} className="px-2 py-2 border-b border-slate-100">
                      <LessonCell
                        status={status}
                        onToggle={() => toggleLesson(cls.id, i)}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 border-b border-slate-100">
                    <ProgressBar value={progress} />
                  </td>
                  <td className="px-2 py-2 border-b border-slate-100">
                    <input
                      type="text"
                      value={cls.notes}
                      onChange={(e) => updateNotes(cls.id, e.target.value)}
                      className="w-full text-xs px-2 py-1.5 rounded border border-slate-200 focus:border-[#1F3864] outline-none transition-colors"
                      placeholder="Notes..."
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

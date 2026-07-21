"use client";

import { useState, useMemo, useCallback } from "react";
import type { ClassData, AttendanceData } from "@/lib/types";
import { sortClasses } from "@/lib/types";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export default function RegisterPanel({
  classes,
  attendance,
  onSaveAttendance,
}: {
  classes: ClassData[];
  attendance: AttendanceData;
  onSaveAttendance: (classId: string, date: string, present: number) => void;
}) {
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [historyClassId, setHistoryClassId] = useState<string | null>(null);

  const sorted = useMemo(() => sortClasses(classes), [classes]);

  const selectedDayName = useMemo(() => {
    const d = new Date(selectedDate + "T12:00:00");
    return DAY_NAMES[d.getDay()];
  }, [selectedDate]);

  const todayClasses = useMemo(
    () => sorted.filter((c) => c.day === selectedDayName),
    [sorted, selectedDayName]
  );

  const getPresent = useCallback(
    (classId: string) => attendance[classId]?.[selectedDate]?.present ?? null,
    [attendance, selectedDate]
  );

  const historyClass = sorted.find((c) => c.id === historyClassId);
  const historyRecords = historyClassId
    ? Object.entries(attendance[historyClassId] || {})
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([date, rec]) => ({ date, ...rec }))
    : [];

  return (
    <div className="space-y-6">
      {/* Date picker */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-600">Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 focus:border-[#1F3864] outline-none"
        />
        <span className="text-sm text-slate-400">{selectedDayName}</span>
      </div>

      {/* Today's register */}
      {todayClasses.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          No classes on {selectedDayName}
        </div>
      ) : (
        <div className="space-y-3">
          {todayClasses.map((cls) => {
            const present = getPresent(cls.id);
            const total = cls.totalStudents || 0;
            const pct = total > 0 && present !== null ? Math.round((present / total) * 100) : null;

            return (
              <div
                key={cls.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#1F3864]">
                      {cls.classCode}
                    </span>
                    <span className="text-xs text-slate-400">
                      Grade {cls.grade}
                    </span>
                    <span className="text-xs text-slate-400">|</span>
                    <span className="text-xs text-slate-500">{cls.period}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {total === 0 ? (
                    <span className="text-xs text-slate-400 italic">
                      Set class size first
                    </span>
                  ) : (
                    <>
                      <input
                        type="number"
                        min={0}
                        max={total}
                        placeholder="Present"
                        value={present !== null ? present : ""}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 0 && val <= total) {
                            onSaveAttendance(cls.id, selectedDate, val);
                          }
                        }}
                        className="w-20 text-sm px-2 py-1.5 rounded border border-slate-200 focus:border-[#1F3864] outline-none text-center"
                      />
                      <span className="text-sm text-slate-400">/ {total}</span>
                      {pct !== null && (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            pct >= 90
                              ? "bg-emerald-50 text-emerald-700"
                              : pct >= 70
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {pct}%
                        </span>
                      )}
                    </>
                  )}
                </div>

                <button
                  onClick={() => setHistoryClassId(historyClassId === cls.id ? null : cls.id)}
                  className="text-xs text-[#1F3864] underline cursor-pointer hover:text-blue-800"
                >
                  {historyClassId === cls.id ? "Hide history" : "History"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* History panel */}
      {historyClass && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-[#1F3864] mb-3">
            Attendance History — {historyClass.classCode} (Grade {historyClass.grade})
          </h3>
          {historyRecords.length === 0 ? (
            <p className="text-xs text-slate-400">No records yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Day</th>
                  <th className="pb-2 text-right">Present</th>
                  <th className="pb-2 text-right">Absent</th>
                  <th className="pb-2 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {historyRecords.map((rec) => {
                  const total = historyClass.totalStudents || 0;
                  const absent = total - rec.present;
                  const pct = total > 0 ? Math.round((rec.present / total) * 100) : 0;
                  const d = new Date(rec.date + "T12:00:00");
                  return (
                    <tr key={rec.date} className="border-t border-slate-100">
                      <td className="py-1.5">{formatDate(rec.date)}</td>
                      <td className="py-1.5 text-slate-500">{DAY_NAMES[d.getDay()]}</td>
                      <td className="py-1.5 text-right">{rec.present}</td>
                      <td className="py-1.5 text-right text-slate-500">{absent}</td>
                      <td className="py-1.5 text-right font-medium">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

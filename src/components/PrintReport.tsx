"use client";

import { useRef, useCallback } from "react";
import type { ClassData } from "@/lib/types";
import { LESSON_NAMES, LESSON_WEEKS, sortClasses } from "@/lib/types";

export default function PrintReport({ classes }: { classes: ClassData[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    if (!ref.current) return;
    window.print();
  }, []);

  const sorted = sortClasses(classes);
  const total = sorted.length;

  const donePerLesson = [0, 0, 0, 0, 0];
  for (const cls of sorted) {
    for (let i = 0; i < 5; i++) {
      if (cls.lessons[i] === "Done") donePerLesson[i]++;
    }
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const grouped = days
    .map((day) => ({ day, classes: sorted.filter((c) => c.day === day) }))
    .filter((g) => g.classes.length > 0);

  return (
    <>
      <button
        onClick={handlePrint}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer print:hidden"
      >
        Print Report
      </button>

      <div ref={ref} className="print-report hidden print:block">
        <h1 style={{ fontSize: 18, margin: "0 0 2px", color: "#1F3864" }}>
          Term 3 2026 &mdash; Coding &amp; Robotics
        </h1>
        <h2 style={{ fontSize: 13, margin: "0 0 12px", color: "#64748b", fontWeight: "normal" }}>
          Eshowe Junior School | Mr Dlamini
        </h2>
        <p style={{ fontSize: 11, color: "#888", marginBottom: 16 }}>
          Report generated:{" "}
          {new Date().toLocaleDateString("en-ZA", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[...["Day", "Period", "Grade", "Class"], ...LESSON_NAMES.map((n, i) => `Lesson ${i + 1}\n${LESSON_WEEKS[i]}\n${n}`), "Progress", "Notes"].map((h, i) => (
                <th key={i} style={{ textAlign: i < 4 ? "left" : "center", padding: "6px 8px", border: "1px solid #ccc", background: "#1F3864", color: "white", fontSize: 11, whiteSpace: "pre-line" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grouped.map((group) =>
              group.classes.map((cls, idx) => {
                const done = cls.lessons.filter((s) => s === "Done").length;
                const pct = Math.round((done / 5) * 100);
                return (
                  <tr key={cls.id}>
                    {idx === 0 && (
                      <td
                        rowSpan={group.classes.length}
                        style={{ padding: "4px 8px", border: "1px solid #ddd", fontWeight: "bold", fontSize: 12, verticalAlign: "middle" }}
                      >
                        {group.day}
                      </td>
                    )}
                    <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontSize: 11 }}>{cls.period}</td>
                    <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontSize: 11, textAlign: "center" }}>{cls.grade}</td>
                    <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontWeight: "bold", fontSize: 12 }}>{cls.classCode}</td>
                    {cls.lessons.map((s, i) => (
                      <td
                        key={i}
                        style={{
                          textAlign: "center",
                          padding: "4px 6px",
                          border: "1px solid #ddd",
                          fontSize: 11,
                          background: s === "Done" ? "#d1fae5" : s === "Started" ? "#fef3c7" : "#f1f5f9",
                        }}
                      >
                        {s || "\u2014"}
                      </td>
                    ))}
                    <td style={{ textAlign: "center", padding: "4px 8px", border: "1px solid #ddd", fontSize: 11, fontWeight: "bold" }}>{pct}%</td>
                    <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontSize: 10, color: "#666" }}>{cls.notes || ""}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <table style={{ marginTop: 16, fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "4px 12px", border: "1px solid #ddd", background: "#f1f5f9" }}>Total Classes</th>
              {LESSON_NAMES.map((_n, i) => (
                <th key={i} style={{ padding: "4px 12px", border: "1px solid #ddd", background: "#f1f5f9" }}>Lesson {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: "center", padding: "6px 12px", border: "1px solid #ddd", fontWeight: "bold", fontSize: 14 }}>{total}</td>
              {donePerLesson.map((d, i) => (
                <td key={i} style={{ textAlign: "center", padding: "6px 8px", border: "1px solid #ddd" }}>
                  <strong>{d}</strong> <span style={{ color: "#888" }}>/ {total}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

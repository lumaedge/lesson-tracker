"use client";

import { useRef } from "react";
import type { ClassData } from "@/lib/types";
import { LESSON_NAMES, LESSON_WEEKS, sortClasses } from "@/lib/types";

export default function PrintReport({ classes }: { classes: ClassData[] }) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePrint() {
    if (!ref.current) return;
    const content = ref.current.innerHTML;
    const win = window.open("", "_blank");
    if (!win) {
      alert("Pop-up blocked. Please allow pop-ups for this site.");
      return;
    }
    win.document.write(`<!DOCTYPE html>
<html><head><title>Lesson Progress Report</title>
<style>
@page{size:landscape;margin:10mm}
body{font-family:Arial,sans-serif;color:#1e293b;padding:20px;margin:0}
h1{font-size:18px;margin:0 0 2px;color:#1F3864}
h2{font-size:13px;margin:0 0 12px;color:#64748b;font-weight:normal}
.meta{font-size:11px;color:#888;margin-bottom:16px}
table{width:100%;border-collapse:collapse}
th{padding:6px 8px;border:1px solid #ccc;background:#1F3864;color:white;font-size:11px}
td{padding:4px 8px;border:1px solid #ddd;font-size:11px}
.summary{margin-top:16px;width:auto}
.summary th{background:#f1f5f9;color:#1e293b}
</style></head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); }, 300);
  }

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
        className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
      >
        Print Report
      </button>

      <div ref={ref} className="hidden" aria-hidden="true">
        <h1>Term 3 2026 &mdash; Coding &amp; Robotics</h1>
        <h2>Eshowe Junior School | Mr Dlamini</h2>
        <div className="meta">
          Report generated:{" "}
          {new Date().toLocaleDateString("en-ZA", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>

        <table>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Day</th>
              <th style={{ textAlign: "left" }}>Period</th>
              <th style={{ textAlign: "center" }}>Grade</th>
              <th style={{ textAlign: "left" }}>Class</th>
              {LESSON_NAMES.map((name, i) => (
                <th key={i} style={{ textAlign: "center" }}>
                  Lesson {i + 1}
                  <br />
                  <span style={{ fontWeight: "normal", fontSize: 10 }}>
                    {LESSON_WEEKS[i]}
                  </span>
                  <br />
                  <span style={{ fontWeight: "normal", fontSize: 10 }}>
                    {name}
                  </span>
                </th>
              ))}
              <th style={{ textAlign: "center" }}>Progress</th>
              <th style={{ textAlign: "left" }}>Notes</th>
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
                        style={{
                          fontWeight: "bold",
                          fontSize: 12,
                          verticalAlign: "middle",
                        }}
                      >
                        {group.day}
                      </td>
                    )}
                    <td>P{cls.period}</td>
                    <td style={{ textAlign: "center" }}>{cls.grade}</td>
                    <td style={{ fontWeight: "bold", fontSize: 12 }}>
                      {cls.classCode}
                    </td>
                    {cls.lessons.map((s, i) => (
                      <td
                        key={i}
                        style={{
                          textAlign: "center",
                          background:
                            s === "Done"
                              ? "#d1fae5"
                              : s === "Started"
                              ? "#fef3c7"
                              : "#f1f5f9",
                        }}
                      >
                        {s || "\u2014"}
                      </td>
                    ))}
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>
                      {pct}%
                    </td>
                    <td style={{ fontSize: 10, color: "#666" }}>
                      {cls.notes || ""}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <table className="summary">
          <thead>
            <tr>
              <th>Total Classes</th>
              {LESSON_NAMES.map((_n, i) => (
                <th key={i}>Lesson {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: "center", fontWeight: "bold", fontSize: 14 }}>
                {total}
              </td>
              {donePerLesson.map((d, i) => (
                <td key={i} style={{ textAlign: "center" }}>
                  <strong>{d}</strong>{" "}
                  <span style={{ color: "#888" }}>/ {total}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

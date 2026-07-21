"use client";

import type { ClassData } from "@/lib/types";
import { LESSON_NAMES, LESSON_WEEKS, sortClasses } from "@/lib/types";

export default function PrintReport({ classes }: { classes: ClassData[] }) {
  const sorted = sortClasses(classes);
  const total = sorted.length;

  const donePerLesson = [0, 0, 0, 0, 0];
  for (const cls of sorted) {
    for (let i = 0; i < 5; i++) {
      if (cls.lessons[i] === "Done") donePerLesson[i]++;
    }
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const grouped = days
      .map((day) => ({
        day,
        classes: sorted.filter((c) => c.day === day),
      }))
      .filter((g) => g.classes.length > 0);

    const lessonHeaders = LESSON_NAMES.map(
      (name, i) => `<th style="text-align:center;padding:6px 8px;border:1px solid #ccc;background:#1F3864;color:white;font-size:11px;">
        <div>Lesson ${i + 1}</div>
        <div style="font-weight:normal;font-size:10px;">${LESSON_WEEKS[i]}</div>
        <div style="font-weight:normal;font-size:10px;">${name}</div>
      </th>`
    ).join("");

    let tableRows = "";
    for (const group of grouped) {
      for (let idx = 0; idx < group.classes.length; idx++) {
        const cls = group.classes[idx];
        const done = cls.lessons.filter((s) => s === "Done").length;
        const pct = Math.round((done / 5) * 100);
        const statusCells = cls.lessons
          .map((s) => {
            const color =
              s === "Done"
                ? "#d1fae5"
                : s === "Started"
                ? "#fef3c7"
                : "#f1f5f9";
            const label = s || "—";
            return `<td style="text-align:center;padding:4px 6px;border:1px solid #ddd;background:${color};font-size:11px;">${label}</td>`;
          })
          .join("");
        tableRows += `<tr>
          ${idx === 0 ? `<td rowspan="${group.classes.length}" style="padding:4px 8px;border:1px solid #ddd;font-weight:bold;font-size:12px;vertical-align:middle;">${group.day}</td>` : ""}
          <td style="padding:4px 8px;border:1px solid #ddd;font-size:11px;">P${cls.period}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;font-size:11px;text-align:center;">${cls.grade}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;font-weight:bold;font-size:12px;">${cls.classCode}</td>
          ${statusCells}
          <td style="text-align:center;padding:4px 8px;border:1px solid #ddd;font-size:11px;font-weight:bold;">${pct}%</td>
          <td style="padding:4px 8px;border:1px solid #ddd;font-size:10px;color:#666;">${cls.notes || ""}</td>
        </tr>`;
      }
    }

    const statsRow = donePerLesson
      .map(
        (done) =>
          `<td style="text-align:center;padding:6px 8px;border:1px solid #ddd;font-size:12px;">
            <strong>${done}</strong> <span style="color:#888;">/ ${total}</span>
          </td>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Lesson Progress Report - Term 3 2026</title>
  <style>
    @media print {
      body { margin: 0; }
      @page { size: landscape; margin: 10mm; }
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #1e293b;
      padding: 20px;
    }
    h1 { font-size: 18px; margin: 0 0 2px 0; color: #1F3864; }
    h2 { font-size: 13px; margin: 0 0 12px 0; color: #64748b; font-weight: normal; }
    .meta { font-size: 11px; color: #888; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    .summary { margin-top: 16px; font-size: 12px; }
    .summary td { padding: 4px 8px; border: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>Term 3 2026 &mdash; Coding &amp; Robotics</h1>
  <h2>Eshowe Junior School | Mr Dlamini</h2>
  <div class="meta">Report generated: ${new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</div>

  <table>
    <thead>
      <tr>
        <th style="text-align:left;padding:6px 8px;border:1px solid #ccc;background:#1F3864;color:white;font-size:11px;">Day</th>
        <th style="text-align:left;padding:6px 8px;border:1px solid #ccc;background:#1F3864;color:white;font-size:11px;">Period</th>
        <th style="text-align:center;padding:6px 8px;border:1px solid #ccc;background:#1F3864;color:white;font-size:11px;">Grade</th>
        <th style="text-align:left;padding:6px 8px;border:1px solid #ccc;background:#1F3864;color:white;font-size:11px;">Class</th>
        ${lessonHeaders}
        <th style="text-align:center;padding:6px 8px;border:1px solid #ccc;background:#1F3864;color:white;font-size:11px;">Progress</th>
        <th style="text-align:left;padding:6px 8px;border:1px solid #ccc;background:#1F3864;color:white;font-size:11px;">Notes</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <table class="summary" style="width:auto;margin-top:16px;">
    <thead>
      <tr>
        <th style="padding:4px 12px;border:1px solid #ddd;background:#f1f5f9;font-size:11px;">Total Classes</th>
        ${LESSON_NAMES.map(
          (_n, idx) =>
            `<th style="padding:4px 12px;border:1px solid #ddd;background:#f1f5f9;font-size:11px;">Lesson ${idx + 1}</th>`
        ).join("")}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align:center;padding:6px 12px;border:1px solid #ddd;font-weight:bold;font-size:14px;">${total}</td>
        ${statsRow}
      </tr>
    </tbody>
  </table>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  }

  return (
    <button
      onClick={handlePrint}
      className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
    >
      Print Report
    </button>
  );
}

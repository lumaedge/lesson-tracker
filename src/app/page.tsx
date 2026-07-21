"use client";

import { useEffect, useState, useCallback } from "react";
import type { ClassData, AttendanceData } from "@/lib/types";
import PasswordGate from "@/components/PasswordGate";
import ClassGrid from "@/components/ClassGrid";
import StatsBar from "@/components/StatsBar";
import PrintReport from "@/components/PrintReport";
import RegisterPanel from "@/components/RegisterPanel";

type Tab = "lessons" | "register";

export default function Home() {
  const [classes, setClasses] = useState<ClassData[] | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    donePerLesson: number[];
  } | null>(null);
  const [attendance, setAttendance] = useState<AttendanceData>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("lessons");

  useEffect(() => {
    Promise.all([
      fetch("/api/classes").then((r) => r.json()),
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/attendance").then((r) => r.json()),
    ]).then(([termData, statsData, attData]) => {
      setClasses(termData.classes || []);
      setStats(statsData);
      setAttendance(attData);
      setLoading(false);
    });
  }, []);

  const handleSaveAttendance = useCallback(
    async (classId: string, date: string, absent: number) => {
      setAttendance((prev) => ({
        ...prev,
        [classId]: {
          ...prev[classId],
          [date]: { absent },
        },
      }));

      await fetch("/api/attendance/save", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, date, absent }),
      });
    },
    []
  );

  return (
    <PasswordGate>
      <div className="flex flex-col flex-1">
        <header className="bg-[#1F3864] text-white px-4 md:px-6 py-3 md:py-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-base md:text-xl font-bold">
                Term 3 2026 &mdash; Coding & Robotics
              </h1>
              <p className="text-xs md:text-sm text-blue-200 mt-0.5 md:mt-1">
                GigoToys S4A Robotics | Eshowe Junior School | Mr Dlamini
              </p>
              <p className="text-[10px] md:text-xs text-blue-300 mt-0.5 hidden md:block">
                Click each cell: Empty &rarr; Started &rarr; Done
              </p>
            </div>
            {classes && classes.length > 0 && tab === "lessons" && (
              <PrintReport classes={classes} />
            )}
          </div>

          {/* Tab toggle */}
          <div className="flex gap-1 mt-3">
            {([["lessons", "Lessons"], ["register", "Register"]] as const).map(
              ([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    tab === key
                      ? "bg-white text-[#1F3864]"
                      : "text-blue-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </header>

        <main className="flex-1 p-3 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-pulse text-slate-400">
                Loading lesson data...
              </div>
            </div>
          ) : !classes || classes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-slate-500 text-lg mb-2">No lesson data found</p>
              <p className="text-slate-400 text-sm">
                Run the import script to populate data from your Excel file.
              </p>
            </div>
          ) : (
            <>
              {tab === "lessons" ? (
                <>
                  {stats && (
                    <StatsBar
                      total={stats.total}
                      donePerLesson={stats.donePerLesson}
                    />
                  )}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-3 md:p-0 md:block">
                    <ClassGrid initialClasses={classes} />
                  </div>
                </>
              ) : (
                <RegisterPanel
                  classes={classes}
                  attendance={attendance}
                  onSaveAttendance={handleSaveAttendance}
                />
              )}
            </>
          )}
        </main>
      </div>
    </PasswordGate>
  );
}

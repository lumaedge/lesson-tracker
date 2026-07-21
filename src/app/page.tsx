"use client";

import { useEffect, useState } from "react";
import type { ClassData } from "@/lib/types";
import PasswordGate from "@/components/PasswordGate";
import ClassGrid from "@/components/ClassGrid";
import StatsBar from "@/components/StatsBar";

export default function Home() {
  const [classes, setClasses] = useState<ClassData[] | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    donePerLesson: number[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/classes").then((r) => r.json()),
      fetch("/api/stats").then((r) => r.json()),
    ]).then(([termData, statsData]) => {
      setClasses(termData.classes || []);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  return (
    <PasswordGate>
      <div className="flex flex-col flex-1">
        <header className="bg-[#1F3864] text-white px-6 py-5 shadow-lg">
          <h1 className="text-xl font-bold">
            Term 3 2026 &mdash; Coding & Robotics Lesson Tracker
          </h1>
          <p className="text-sm text-blue-200 mt-1">
            GigoToys S4A Robotics &nbsp;|&nbsp; Eshowe Junior School
            &nbsp;|&nbsp; Mr Dlamini &nbsp;|&nbsp; Click each cell: Empty
            &rarr; Started &rarr; Done
          </p>
        </header>

        <main className="flex-1 p-6">
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
              {stats && (
                <StatsBar
                  total={stats.total}
                  donePerLesson={stats.donePerLesson}
                />
              )}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <ClassGrid initialClasses={classes} />
              </div>
            </>
          )}
        </main>
      </div>
    </PasswordGate>
  );
}

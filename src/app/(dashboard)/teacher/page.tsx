"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LessonCell, { cycleStatus, prismaStatusToDisplay } from "@/components/LessonCell";
import ProgressBar from "@/components/ProgressBar";

interface ProgressEntry {
  lessonId: string;
  status: string;
  lesson: { name: string; weekRange: string; sortOrder: number };
}

interface TeacherClass {
  id: string;
  day: string;
  period: string;
  grade: number;
  classCode: string;
  subject: { name: string };
  teacher?: { name: string };
  progress: ProgressEntry[];
}

export default function TeacherPage() {
  const { data: session } = useSession();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/classes")
      .then((r) => r.json())
      .then((data) => {
        setClasses(data.classes || []);
        setLoading(false);
      });
  }, []);

  async function toggleLesson(classId: string, lessonId: string, currentStatus: string) {
    const displayStatus = prismaStatusToDisplay(currentStatus);
    const newDisplay = cycleStatus(displayStatus);

    let newPrismaStatus: string;
    if (newDisplay === "Done") newPrismaStatus = "DONE";
    else if (newDisplay === "Started") newPrismaStatus = "STARTED";
    else newPrismaStatus = "NOT_STARTED";

    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        return {
          ...c,
          progress: c.progress.map((p) =>
            p.lessonId === lessonId ? { ...p, status: newPrismaStatus } : p
          ),
        };
      })
    );

    await fetch(`/api/classes/${classId}/progress`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, status: newPrismaStatus }),
    });
  }

  if (loading) {
    return (
      <div className="animate-pulse text-slate-400 py-20 text-center">
        Loading your classes...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg md:text-xl font-bold text-[#1F3864]">
          My Classes
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {session?.user?.name} &mdash; Click cells to cycle: Empty &rarr; Started &rarr; Done
        </p>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          No classes assigned to you yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {classes.map((cls) => {
            const done = cls.progress.filter((p) => p.status === "DONE").length;
            const total = cls.progress.length;
            const progress = total > 0 ? done / total : 0;

            return (
              <div
                key={cls.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-[#1F3864]">
                      {cls.classCode}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      Grade {cls.grade}
                    </span>
                    <span className="text-xs text-slate-300 ml-2">
                      {cls.subject.name}
                    </span>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <div>{cls.day}</div>
                    <div className="text-slate-400">{cls.period}</div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-3">
                  {cls.progress
                    .sort((a, b) => a.lesson.sortOrder - b.lesson.sortOrder)
                    .map((p) => (
                      <div key={p.lessonId} className="text-center">
                        <div className="text-[10px] text-slate-400 mb-1 hidden md:block">
                          {p.lesson.name}
                        </div>
                        <LessonCell
                          status={prismaStatusToDisplay(p.status)}
                          onToggle={() =>
                            toggleLesson(cls.id, p.lessonId, p.status)
                          }
                        />
                      </div>
                    ))}
                </div>

                <ProgressBar value={progress} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

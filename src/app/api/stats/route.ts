import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role;
  const userId = session.user.id;

  if (role === "PRINCIPAL") {
    const classes = await prisma.class.findMany({
      include: {
        subject: { select: { name: true, department: { select: { name: true } } } },
        progress: { select: { status: true } },
      },
    });

    const total = classes.length;
    const donePerLesson: number[] = [0, 0, 0, 0, 0];

    for (const cls of classes) {
      const sorted = cls.progress;
      sorted.forEach((p, i) => {
        if (p.status === "DONE" && i < 5) donePerLesson[i]++;
      });
    }

    const departments = await prisma.department.findMany({
      include: {
        subjects: {
          include: {
            classes: {
              include: { progress: { select: { status: true } } },
            },
          },
        },
      },
    });

    const deptStats = departments.map((dept) => {
      let deptTotal = 0;
      let deptDone = 0;
      for (const subj of dept.subjects) {
        for (const cls of subj.classes) {
          deptTotal++;
          for (const p of cls.progress) {
            if (p.status === "DONE") deptDone++;
          }
        }
      }
      return {
        name: dept.name,
        total: deptTotal,
        completion: deptTotal > 0 ? deptDone / (deptTotal * 5) : 0,
      };
    });

    return Response.json({ total, donePerLesson, deptStats });
  }

  if (role === "HOD") {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { department: { include: { subjects: { select: { id: true } } } } },
    });

    const subjectIds = user?.department?.subjects.map((s) => s.id) || [];
    const classes = await prisma.class.findMany({
      where: { subjectId: { in: subjectIds } },
      include: {
        progress: { select: { status: true } },
        teacher: { select: { name: true } },
      },
    });

    const total = classes.length;
    const donePerLesson: number[] = [0, 0, 0, 0, 0];

    for (const cls of classes) {
      cls.progress.forEach((p, i) => {
        if (p.status === "DONE" && i < 5) donePerLesson[i]++;
      });
    }

    const teacherStats = new Map<string, { name: string; total: number; done: number }>();
    for (const cls of classes) {
      const tName = cls.teacher.name;
      const existing = teacherStats.get(tName) || { name: tName, total: 0, done: 0 };
      existing.total++;
      for (const p of cls.progress) {
        if (p.status === "DONE") existing.done++;
      }
      teacherStats.set(tName, existing);
    }

    return Response.json({
      total,
      donePerLesson,
      teacherStats: Array.from(teacherStats.values()),
    });
  }

  const classes = await prisma.class.findMany({
    where: { teacherId: userId },
    include: { progress: { select: { status: true } } },
  });

  const total = classes.length;
  const donePerLesson: number[] = [0, 0, 0, 0, 0];

  for (const cls of classes) {
    cls.progress.forEach((p, i) => {
      if (p.status === "DONE" && i < 5) donePerLesson[i]++;
    });
  }

  return Response.json({ total, donePerLesson });
}

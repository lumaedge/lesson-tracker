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

  let classes;

  if (role === "PRINCIPAL") {
    classes = await prisma.class.findMany({
      include: {
        teacher: { select: { name: true, email: true } },
        subject: { select: { name: true } },
        progress: {
          include: { lesson: { select: { name: true, weekRange: true, sortOrder: true } } },
          orderBy: { lesson: { sortOrder: "asc" } },
        },
      },
      orderBy: [{ grade: "asc" }, { classCode: "asc" }],
    });
  } else if (role === "HOD") {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { department: { include: { subjects: { select: { id: true } } } } },
    });

    const subjectIds = user?.department?.subjects.map((s) => s.id) || [];

    classes = await prisma.class.findMany({
      where: {
        subjectId: { in: subjectIds },
      },
      include: {
        teacher: { select: { name: true, email: true } },
        subject: { select: { name: true } },
        progress: {
          include: { lesson: { select: { name: true, weekRange: true, sortOrder: true } } },
          orderBy: { lesson: { sortOrder: "asc" } },
        },
      },
      orderBy: [{ grade: "asc" }, { classCode: "asc" }],
    });
  } else {
    classes = await prisma.class.findMany({
      where: { teacherId: userId },
      include: {
        subject: { select: { name: true } },
        progress: {
          include: { lesson: { select: { name: true, weekRange: true, sortOrder: true } } },
          orderBy: { lesson: { sortOrder: "asc" } },
        },
      },
      orderBy: [{ grade: "asc" }, { classCode: "asc" }],
    });
  }

  return Response.json({ classes });
}

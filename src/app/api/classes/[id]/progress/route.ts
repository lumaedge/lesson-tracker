import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/classes/[id]/progress">
) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const { lessonId, status } = await request.json() as {
    lessonId: string;
    status: string;
  };

  const validStatuses = ["NOT_STARTED", "STARTED", "DONE"];
  if (!validStatuses.includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const progress = await prisma.progress.upsert({
    where: {
      classId_lessonId: { classId: id, lessonId },
    },
    update: {
      status: status as "NOT_STARTED" | "STARTED" | "DONE",
      markedAt: status !== "NOT_STARTED" ? new Date() : null,
    },
    create: {
      classId: id,
      lessonId,
      status: status as "NOT_STARTED" | "STARTED" | "DONE",
      markedAt: status !== "NOT_STARTED" ? new Date() : null,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: `MARK_${status}`,
      entity: "Progress",
      entityId: progress.id,
      details: { classId: id, lessonId, status },
    },
  });

  return Response.json(progress);
}

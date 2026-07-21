import { getTermData, setTermData } from "@/lib/kv";
import type { LessonStatus } from "@/lib/types";

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/classes/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json() as {
    lessonIndex?: number;
    status?: LessonStatus;
    notes?: string;
  };

  const data = await getTermData();
  if (!data) {
    return Response.json({ error: "No term data" }, { status: 404 });
  }

  const classIndex = data.classes.findIndex((c) => c.id === id);
  if (classIndex === -1) {
    return Response.json({ error: "Class not found" }, { status: 404 });
  }

  if (body.lessonIndex !== undefined && body.status !== undefined) {
    data.classes[classIndex].lessons[body.lessonIndex] = body.status;
  }

  if (body.notes !== undefined) {
    data.classes[classIndex].notes = body.notes;
  }

  await setTermData(data);
  return Response.json(data.classes[classIndex]);
}

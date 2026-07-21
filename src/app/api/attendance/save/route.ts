import { getAttendance, setAttendance } from "@/lib/kv";

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    classId: string;
    date: string;
    present: number;
  };

  const { classId, date, present } = body;

  if (!classId || !date || present < 0) {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }

  const data = await getAttendance();

  if (!data[classId]) {
    data[classId] = {};
  }

  data[classId][date] = { present };

  await setAttendance(data);
  return Response.json({ ok: true });
}

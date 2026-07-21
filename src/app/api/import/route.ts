import { setTermData } from "@/lib/kv";
import type { TermData } from "@/lib/types";

export async function PUT(request: Request) {
  const data = (await request.json()) as TermData;

  if (!data.term || !Array.isArray(data.classes)) {
    return Response.json({ error: "Invalid data format" }, { status: 400 });
  }

  await setTermData(data);
  return Response.json({ ok: true, classes: data.classes.length });
}

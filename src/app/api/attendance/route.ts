import { getAttendance } from "@/lib/kv";

export async function GET() {
  const data = await getAttendance();
  return Response.json(data);
}

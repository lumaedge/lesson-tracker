import { getTermData } from "@/lib/kv";

export async function GET() {
  const data = await getTermData();
  if (!data) {
    return Response.json({ term: "", classes: [] });
  }
  return Response.json(data);
}

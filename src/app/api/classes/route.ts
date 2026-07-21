import { getTermData } from "@/lib/kv";
import { sortClasses } from "@/lib/types";

export async function GET() {
  const data = await getTermData();
  if (!data) {
    return Response.json({ term: "", classes: [] });
  }
  return Response.json({ ...data, classes: sortClasses(data.classes) });
}

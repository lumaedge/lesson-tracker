import { getTermData } from "@/lib/kv";

export async function GET() {
  const data = await getTermData();
  if (!data) {
    return Response.json({ total: 0, donePerLesson: [0,0,0,0,0], avgComplete: 0 });
  }

  const classes = data.classes;
  const total = classes.length;

  const donePerLesson = [0, 0, 0, 0, 0];
  let totalProgress = 0;

  for (const cls of classes) {
    let classDone = 0;
    for (let i = 0; i < 5; i++) {
      if (cls.lessons[i] === "Done") {
        donePerLesson[i]++;
        classDone++;
      }
    }
    totalProgress += classDone / 5;
  }

  return Response.json({
    total,
    donePerLesson,
    avgComplete: total > 0 ? totalProgress / total : 0,
  });
}

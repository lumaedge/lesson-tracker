export default function StatsBar({
  total,
  donePerLesson,
}: {
  total: number;
  donePerLesson: number[];
}) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-5 py-3">
        <span className="text-xs text-slate-500 block">Total Classes</span>
        <span className="text-2xl font-bold text-[#1F3864]">{total}</span>
      </div>
      {donePerLesson.map((done, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-slate-200 px-5 py-3"
        >
          <span className="text-xs text-slate-500 block">Lesson {i + 1}</span>
          <span className="text-2xl font-bold text-[#1F3864]">
            {done}{" "}
            <span className="text-sm font-normal text-slate-400">/ {total}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

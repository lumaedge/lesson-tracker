export default function StatsBar({
  total,
  donePerLesson,
}: {
  total: number;
  donePerLesson: number[];
}) {
  return (
    <div className="grid grid-cols-3 md:flex md:flex-wrap gap-3 md:gap-4 mb-4 md:mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-3 md:px-5 py-2 md:py-3 col-span-3 md:col-span-1">
        <span className="text-[10px] md:text-xs text-slate-500 block">Total Classes</span>
        <span className="text-xl md:text-2xl font-bold text-[#1F3864]">{total}</span>
      </div>
      {donePerLesson.map((done, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-slate-200 px-3 md:px-5 py-2 md:py-3"
        >
          <span className="text-[10px] md:text-xs text-slate-500 block">Lesson {i + 1}</span>
          <span className="text-xl md:text-2xl font-bold text-[#1F3864]">
            {done}{" "}
            <span className="text-xs md:text-sm font-normal text-slate-400">/ {total}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ProgressBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);

  let color = "bg-slate-300";
  if (pct >= 80) color = "bg-emerald-500";
  else if (pct >= 40) color = "bg-amber-400";

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600 w-9 text-right">
        {pct}%
      </span>
    </div>
  );
}

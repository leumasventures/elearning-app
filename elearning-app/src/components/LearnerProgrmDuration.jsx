import { monitorProgram, statusStyles } from "../utils/programDuration";

function Bar({ value, colorClass }) {
  const pct = Math.min(Math.max(Number(value) || 0, 0), 100);
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

function timeBarColor(pct) {
  if (pct >= 100) return "bg-rose-500";
  if (pct >= 75) return "bg-amber-500";
  return "bg-indigo-500";
}

function progressBarColor(pct) {
  if (pct >= 100) return "bg-emerald-500";
  if (pct >= 50) return "bg-emerald-400";
  return "bg-sky-500";
}

export default function LearnerProgramDurationPanel({ programs = [] }) {
  const monitored = programs.map((p) => ({
    ...p,
    ...monitorProgram(p),
  }));

  const atRisk = monitored.filter(
    (p) => p.status === "At risk" || p.status === "Overdue"
  ).length;
  const completed = monitored.filter((p) => p.status === "Completed").length;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Learner program duration
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Planned length vs time used and completion progress
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {monitored.length} active
          </span>
          {completed > 0 && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              {completed} completed
            </span>
          )}
          {atRisk > 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              {atRisk} need attention
            </span>
          )}
        </div>
      </div>

      {/* Empty state */}
      {monitored.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 py-10 text-center">
          <svg
            className="mb-2 h-8 w-8 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm font-medium text-slate-500">
            No learner programs yet
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Durations appear when students are enrolled.
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2.5 pr-3 font-medium">Learner</th>
                <th className="pb-2.5 pr-3 font-medium">Program</th>
                <th className="pb-2.5 pr-3 font-medium">Duration</th>
                <th className="pb-2.5 pr-3 font-medium">Time used</th>
                <th className="pb-2.5 pr-3 font-medium">Progress</th>
                <th className="pb-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {monitored.map((p) => {
                const timePct = p.timeUsedPct ?? 0;
                const progPct = p.progress ?? 0;
                const lag = timePct - progPct;

                return (
                  <tr
                    key={p.id ?? `${p.matric}-${p.courseCode}`}
                    className="align-top transition-colors hover:bg-slate-50/80"
                  >
                    {/* Learner */}
                    <td className="py-3.5 pr-3">
                      <p className="font-medium text-slate-900">
                        {p.student ?? "—"}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-slate-400">
                        {p.matric ?? ""}
                      </p>
                    </td>

                    {/* Program */}
                    <td className="py-3.5 pr-3">
                      <p className="text-slate-800">{p.program ?? "—"}</p>
                      {p.courseCode && (
                        <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          {p.courseCode}
                        </span>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 pr-3 text-slate-700">
                      <p className="font-medium">
                        {p.durationWeeks ?? 0} weeks
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {p.remaining != null
                          ? p.remaining === 0
                            ? "Ends today / ended"
                            : `${p.remaining}d left`
                          : "—"}
                      </p>
                    </td>

                    {/* Time used */}
                    <td className="py-3.5 pr-3 min-w-[130px]">
                      <div className="mb-1 flex items-baseline justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          {timePct}%
                        </span>
                        <span className="text-slate-400">
                          {p.elapsed ?? 0}d
                        </span>
                      </div>
                      <Bar value={timePct} colorClass={timeBarColor(timePct)} />
                    </td>

                    {/* Progress */}
                    <td className="py-3.5 pr-3 min-w-[130px]">
                      <div className="mb-1 flex items-baseline justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          {progPct}%
                        </span>
                        {lag > 10 && (
                          <span className="text-amber-600" title="Behind schedule">
                            −{lag}% lag
                          </span>
                        )}
                      </div>
                      <Bar
                        value={progPct}
                        colorClass={progressBarColor(progPct)}
                      />
                    </td>

                    {/* Status */}
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles(
                          p.status
                        )}`}
                      >
                        {(p.status === "At risk" || p.status === "Overdue") && (
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                        )}
                        {p.status ?? "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
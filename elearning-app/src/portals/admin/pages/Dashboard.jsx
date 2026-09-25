/** Academic year starts in September (month index 8). */
function getCurrentAcademicYear(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Jan … 8 = Sep
  if (month >= 8) return `${year}/${year + 1}`;
  return `${year - 1}/${year}`;
}

function getCurrentTermName(date = new Date()) {
  const m = date.getMonth();
  if (m >= 8 && m <= 11) return "Batch C"; // Sep–Dec
  if (m >= 0 && m <= 3) return "Batch B"; // Jan–Apr
  return "Batch A"; // May–Aug
}

// ─── inlined panel (no external import) ────────────────────────────────────

function monitorProgram(p, now = new Date()) {
  const start = p.startDate ? new Date(p.startDate) : null;
  const end = p.endDate
    ? new Date(p.endDate)
    : start && p.durationWeeks
      ? new Date(start.getTime() + p.durationWeeks * 7 * 24 * 60 * 60 * 1000)
      : null;

  const durationDays =
    start && end
      ? Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))
      : (p.durationWeeks || 0) * 7;

  const elapsed = start
    ? Math.max(0, Math.round((now - start) / (1000 * 60 * 60 * 24)))
    : 0;

  const remaining = end
    ? Math.max(0, Math.round((end - now) / (1000 * 60 * 60 * 24)))
    : Math.max(0, durationDays - elapsed);

  const timeUsedPct =
    durationDays > 0 ? Math.round((elapsed / durationDays) * 100) : 0;
  const progress = Number(p.progress ?? 0);

  let status = "On track";
  if (progress >= 100) status = "Completed";
  else if (remaining === 0 && progress < 100) status = "Overdue";
  else if (timeUsedPct > progress + 15) status = "At risk";

  return {
    durationWeeks: p.durationWeeks ?? Math.round(durationDays / 7),
    elapsed,
    remaining,
    timeUsedPct,
    progress,
    status,
  };
}

function statusStyles(status) {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-800";
    case "On track":
      return "bg-sky-100 text-sky-800";
    case "At risk":
      return "bg-amber-100 text-amber-800";
    case "Overdue":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function LearnerProgramDurationPanel({ programs = [] }) {
  const monitored = programs.map((p) => ({ ...p, ...monitorProgram(p) }));
  const atRisk = monitored.filter(
    (p) => p.status === "At risk" || p.status === "Overdue"
  ).length;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Learner program duration
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Planned length vs time used and completion progress
          </p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {monitored.length} active
          </span>
          {atRisk > 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              {atRisk} need attention
            </span>
          )}
        </div>
      </div>

      {monitored.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">
          No learner programs yet. Durations appear when students are enrolled.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="pb-2 pr-3 font-medium">Learner</th>
                <th className="pb-2 pr-3 font-medium">Program</th>
                <th className="pb-2 pr-3 font-medium">Duration</th>
                <th className="pb-2 pr-3 font-medium">Time used</th>
                <th className="pb-2 pr-3 font-medium">Progress</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {monitored.map((p) => (
                <tr
                  key={p.id ?? `${p.matric}-${p.courseCode}`}
                  className="align-top"
                >
                  <td className="py-3 pr-3">
                    <p className="font-medium text-slate-900">
                      {p.student ?? "—"}
                    </p>
                    <p className="text-xs text-slate-500">{p.matric ?? ""}</p>
                  </td>
                  <td className="py-3 pr-3">
                    <p className="text-slate-800">{p.program ?? "—"}</p>
                    <p className="text-xs text-slate-500">
                      {p.courseCode ?? ""}
                    </p>
                  </td>
                  <td className="py-3 pr-3 text-slate-700">
                    <p>{p.durationWeeks ?? 0} weeks</p>
                    <p className="text-xs text-slate-500">
                      {p.remaining ?? 0}d left
                    </p>
                  </td>
                  <td className="min-w-[120px] py-3 pr-3">
                    <div className="mb-1 flex justify-between text-xs text-slate-600">
                      <span>{p.timeUsedPct ?? 0}%</span>
                      <span>{p.elapsed ?? 0}d</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{
                          width: `${Math.min(p.timeUsedPct ?? 0, 100)}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td className="min-w-[120px] py-3 pr-3">
                    <div className="mb-1 flex justify-between text-xs text-slate-600">
                      <span>{p.progress ?? 0}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${Math.min(p.progress ?? 0, 100)}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles(
                        p.status
                      )}`}
                    >
                      {p.status ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── rest of your admin Dashboard below (no import of LearnerProgramDurationPanel) ───
const stats = [];
const secondaryStats = [];
const recentActivity = [];
const topCourses = [];

// Demo data so the panel is visible while you wire the real API
const learnerPrograms = [
  {
    id: "1",
    student: "Ada Lovelace",
    matric: "CS/2024/001",
    program: "Full-Stack Web Development",
    courseCode: "FSW-101",
    durationWeeks: 12,
    startDate: "2026-01-15",
    progress: 42,
  },
  {
    id: "2",
    student: "Alan Turing",
    matric: "CS/2024/014",
    program: "Data Science Foundations",
    courseCode: "DSF-201",
    durationWeeks: 10,
    startDate: "2025-11-01",
    progress: 78,
  },
  {
    id: "3",
    student: "Grace Hopper",
    matric: "CS/2023/088",
    program: "Cloud Engineering",
    courseCode: "CLE-301",
    durationWeeks: 16,
    startDate: "2025-09-01",
    progress: 55,
  },
];

export default function Dashboard() {
  const academicYear = getCurrentAcademicYear();
  const termName = getCurrentTermName();

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-12 left-20 h-36 w-36 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="relative flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Admin portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Platform Overview
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Real-time snapshot of students, courses, exams and performance.
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-0">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
              System healthy
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">
              Term: {academicYear} · {termName}
            </span>
          </div>
        </div>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.length === 0 && (
          <p className="col-span-full text-sm text-slate-400">
            No stats yet. Data will appear once the platform is in use.
          </p>
        )}
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-xl border p-4 shadow-sm ${stat.soft}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium opacity-80">{stat.label}</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p
                  className={`mt-1 text-xs font-medium ${
                    stat.changeType === "up"
                      ? "text-emerald-600"
                      : "text-slate-500"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div
                className={`rounded-lg bg-gradient-to-br ${stat.gradient} p-2 text-white shadow-md`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary pills */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {secondaryStats.map((s) => (
          <div
            key={s.label}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${s.soft}`}
          >
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${s.color}`} />
            <div>
              <p className="text-xs font-medium opacity-80">{s.label}</p>
              <p className="text-lg font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Recent activity */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Activity
            </h2>
            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
              View all
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {recentActivity.length === 0 && (
              <p className="text-sm text-slate-400">No recent activity.</p>
            )}
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3.5 py-3 transition hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.meta}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top courses by enrolment */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Top Courses</h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
              By enrolment
            </span>
          </div>
          <div className="mt-4 space-y-4">
            {topCourses.length === 0 && (
              <p className="text-sm text-slate-400">No courses yet.</p>
            )}
            {topCourses.map((c, i) => (
              <div key={c.code}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{c.code}</p>
                      <p className="text-xs text-slate-500">{c.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">{c.students}</p>
                    <p className="text-xs text-emerald-600">{c.passRate}% pass</p>
                  </div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (c.students /
                          Math.max(...topCourses.map((t) => t.students), 1)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learner program duration panel */}
      <LearnerProgramDurationPanel programs={learnerPrograms} />

      {/* Quick actions */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Add Student",
              href: "/admin/students",
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Create Exam",
              href: "/admin/exams",
              color: "from-rose-500 to-pink-500",
            },
            {
              label: "Add Course",
              href: "/admin/courses",
              color: "from-indigo-500 to-violet-500",
            },
            {
              label: "View Reports",
              href: "/admin/reports",
              color: "from-emerald-500 to-teal-500",
            },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`flex items-center justify-center rounded-xl bg-gradient-to-br ${action.color} px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
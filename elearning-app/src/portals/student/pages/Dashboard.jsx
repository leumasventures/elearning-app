const student = {
  name: "Chinedu Okafor",
  matric: "CSC/2023/041",
};

const enrolledCourses = [
  { id: 1, code: "CSC101", title: "Introduction to Programming", progress: 65, color: "indigo" },
  { id: 2, code: "MTH201", title: "Calculus II", progress: 40, color: "violet" },
  { id: 3, code: "ENG150", title: "Technical Writing", progress: 100, color: "emerald" },
];

const upcomingAssignments = [
  { id: 1, title: "Loops and Conditionals Exercise", course: "CSC101", dueDate: "2026-09-20T23:59" },
  { id: 2, title: "Limits and Continuity Problem Set", course: "MTH201", dueDate: "2026-09-16T23:59" },
];

const upcomingExams = [
  { id: 1, title: "Mid-Semester Test", course: "CSC101", date: "2026-09-22T09:00" },
];

const recentResults = [
  { id: 1, exam: "First Semester Final", course: "ENG150", score: 18, total: 20 },
];

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function daysUntil(value) {
  const diff = Math.ceil(
    (new Date(value) - new Date()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0)
    return {
      label: "Overdue",
      color: "bg-red-100 text-red-800 ring-1 ring-red-200/80",
    };
  if (diff === 0)
    return {
      label: "Due today",
      color: "bg-red-100 text-red-800 ring-1 ring-red-200/80",
    };
  if (diff <= 2)
    return {
      label: `Due in ${diff} day${diff !== 1 ? "s" : ""}`,
      color: "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80",
    };
  return {
    label: `Due in ${diff} days`,
    color: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80",
  };
}

function progressBarColor(value) {
  if (value === 100) return "bg-emerald-500";
  if (value >= 50) return "bg-indigo-500";
  return "bg-amber-500";
}

function ProgressBar({ value }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all duration-500 ${progressBarColor(value)}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

const courseAccent = {
  indigo: {
    badge: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200/80",
    soft: "bg-indigo-50/50 ring-indigo-100",
  },
  violet: {
    badge: "bg-violet-100 text-violet-800 ring-1 ring-violet-200/80",
    soft: "bg-violet-50/50 ring-violet-100",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
    soft: "bg-emerald-50/50 ring-emerald-100",
  },
};

const stats = [
  {
    label: "Enrolled Courses",
    valueKey: "courses",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    gradient: "from-blue-500 to-indigo-600",
    soft: "bg-blue-50 border-blue-100 text-blue-900",
  },
  {
    label: "Avg. Progress",
    valueKey: "progress",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    gradient: "from-violet-500 to-purple-600",
    soft: "bg-violet-50 border-violet-100 text-violet-900",
  },
  {
    label: "Pending Assignments",
    valueKey: "assignments",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-500",
    soft: "bg-amber-50 border-amber-100 text-amber-900",
  },
  {
    label: "Upcoming Exams",
    valueKey: "exams",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-rose-500 to-pink-600",
    soft: "bg-rose-50 border-rose-100 text-rose-900",
  },
];

export default function Dashboard() {
  const avgProgress = Math.round(
    enrolledCourses.reduce((sum, c) => sum + c.progress, 0) /
      enrolledCourses.length
  );

  const values = {
    courses: enrolledCourses.length,
    progress: `${avgProgress}%`,
    assignments: upcomingAssignments.length,
    exams: upcomingExams.length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-100">Student portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Welcome back, {student.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 text-sm text-indigo-100/90">
              <span className="font-mono text-xs font-semibold text-indigo-200">
                {student.matric}
              </span>
              {" · "}
              Here’s what’s happening across your courses.
            </p>
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur">
            <p className="text-xs font-medium text-indigo-100">Avg progress</p>
            <p className="text-lg font-bold text-white">{avgProgress}%</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-xl border p-4 shadow-sm ${stat.soft}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium opacity-80">{stat.label}</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight">
                  {values[stat.valueKey]}
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Course Progress */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Course Progress</h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 ring-1 ring-indigo-100">
              {enrolledCourses.length} courses
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {enrolledCourses.map((c) => {
              const accent = courseAccent[c.color] || courseAccent.indigo;
              return (
                <div
                  key={c.id}
                  className={`rounded-xl p-3.5 ring-1 ${accent.soft}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold ${accent.badge}`}
                    >
                      {c.code}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        c.progress === 100
                          ? "text-emerald-600"
                          : c.progress >= 50
                          ? "text-indigo-600"
                          : "text-amber-600"
                      }`}
                    >
                      {c.progress}%
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-slate-800">
                    {c.title}
                  </p>
                  <div className="mt-2.5">
                    <ProgressBar value={c.progress} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assignments + Exams */}
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Upcoming Assignments
              </h2>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
                {upcomingAssignments.length} pending
              </span>
            </div>
            <div className="mt-4 space-y-2.5">
              {upcomingAssignments.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-400">
                  No pending assignments.
                </p>
              )}
              {upcomingAssignments.map((a) => {
                const due = daysUntil(a.dueDate);
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-amber-100/80 bg-gradient-to-r from-amber-50/80 to-orange-50/40 px-3.5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {a.title}
                      </p>
                      <p className="mt-0.5 text-xs">
                        <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-semibold text-indigo-700">
                          {a.course}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${due.color}`}
                    >
                      {due.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Upcoming Exams
              </h2>
              <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-rose-100">
                {upcomingExams.length} scheduled
              </span>
            </div>
            <div className="mt-4 space-y-2.5">
              {upcomingExams.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-400">
                  No upcoming exams.
                </p>
              )}
              {upcomingExams.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-rose-100/80 bg-gradient-to-r from-rose-50/80 to-pink-50/40 px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {e.title}
                    </p>
                    <p className="mt-0.5 text-xs">
                      <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-semibold text-indigo-700">
                        {e.course}
                      </span>
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 ring-1 ring-rose-200/80">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(e.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Recent Results</h2>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
            Latest scores
          </span>
        </div>
        <div className="mt-4 space-y-2.5">
          {recentResults.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-400">
              No results yet.
            </p>
          )}
          {recentResults.map((r) => {
            const percent = Math.round((r.score / r.total) * 100);
            return (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100/80 bg-gradient-to-r from-emerald-50/80 to-teal-50/40 px-3.5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {r.exam}
                  </p>
                  <p className="mt-0.5 text-xs">
                    <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-semibold text-indigo-700">
                      {r.course}
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-bold text-emerald-700">
                    {r.score}/{r.total}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/80">
                    {percent}%
                  </span>
                  <div className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-emerald-100 sm:block">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
const student = {
  name: "Chinedu Okafor",
  matric: "CSC/2023/041",
};

const enrolledCourses = [
  { id: 1, code: "CSC101", title: "Introduction to Programming", progress: 65 },
  { id: 2, code: "MTH201", title: "Calculus II", progress: 40 },
  { id: 3, code: "ENG150", title: "Technical Writing", progress: 100 },
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
  const diff = Math.ceil((new Date(value) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "Overdue", color: "text-red-600" };
  if (diff === 0) return { label: "Due today", color: "text-red-600" };
  if (diff <= 2) return { label: `Due in ${diff} day${diff !== 1 ? "s" : ""}`, color: "text-amber-600" };
  return { label: `Due in ${diff} days`, color: "text-slate-500" };
}

function progressColor(value) {
  if (value === 100) return "bg-green-500";
  if (value >= 50) return "bg-blue-500";
  return "bg-amber-500";
}

function ProgressBar({ value }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${progressColor(value)}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

const statCards = [
  { label: "Enrolled Courses", accent: "bg-blue-50 text-blue-700 border-blue-100" },
  { label: "Avg. Progress", accent: "bg-purple-50 text-purple-700 border-purple-100" },
  { label: "Pending Assignments", accent: "bg-amber-50 text-amber-700 border-amber-100" },
  { label: "Upcoming Exams", accent: "bg-rose-50 text-rose-700 border-rose-100" },
];

export default function Dashboard() {
  const avgProgress = Math.round(
    enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length
  );

  const statValues = [
    enrolledCourses.length,
    `${avgProgress}%`,
    upcomingAssignments.length,
    upcomingExams.length,
  ];

  return (
    <div>
      <h1 className="text-lg font-medium text-slate-900">
        Welcome back, {student.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {student.matric} · Here's what's happening across your courses.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className={`rounded-lg border p-4 ${stat.accent}`}
          >
            <p className="text-xs font-medium opacity-80">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold">{statValues[i]}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-4">
          <h2 className="text-sm font-medium text-slate-900">Course Progress</h2>
          <div className="mt-4 space-y-4">
            {enrolledCourses.map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900">{c.code}</span>
                  <span
                    className={`font-medium ${
                      c.progress === 100
                        ? "text-green-600"
                        : c.progress >= 50
                        ? "text-blue-600"
                        : "text-amber-600"
                    }`}
                  >
                    {c.progress}%
                  </span>
                </div>
                <p className="text-xs text-slate-500">{c.title}</p>
                <div className="mt-1">
                  <ProgressBar value={c.progress} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <h2 className="text-sm font-medium text-slate-900">
            Upcoming Assignments
          </h2>
          <div className="mt-4 space-y-3">
            {upcomingAssignments.length === 0 && (
              <p className="text-sm text-slate-400">No pending assignments.</p>
            )}
            {upcomingAssignments.map((a) => {
              const due = daysUntil(a.dueDate);
              return (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-md border border-amber-100 bg-amber-50/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.course}</p>
                  </div>
                  <span className={`text-xs font-medium ${due.color}`}>
                    {due.label}
                  </span>
                </div>
              );
            })}
          </div>

          <h2 className="mt-6 text-sm font-medium text-slate-900">
            Upcoming Exams
          </h2>
          <div className="mt-4 space-y-3">
            {upcomingExams.length === 0 && (
              <p className="text-sm text-slate-400">No upcoming exams.</p>
            )}
            {upcomingExams.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between rounded-md border border-rose-100 bg-rose-50/60 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{e.title}</p>
                  <p className="text-xs text-slate-500">{e.course}</p>
                </div>
                <span className="text-xs font-medium text-rose-600">
                  {formatDate(e.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 p-4">
        <h2 className="text-sm font-medium text-slate-900">Recent Results</h2>
        <div className="mt-4 space-y-2">
          {recentResults.length === 0 && (
            <p className="text-sm text-slate-400">No results yet.</p>
          )}
          {recentResults.map((r) => {
            const percent = Math.round((r.score / r.total) * 100);
            return (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-md border border-green-100 bg-green-50/60 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{r.exam}</p>
                  <p className="text-xs text-slate-500">{r.course}</p>
                </div>
                <span className="text-sm font-semibold text-green-700">
                  {r.score}/{r.total} ({percent}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
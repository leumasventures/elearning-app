const stats = [
  {
    label: "Students",
    value: "1,245",
    change: "+32 this month",
    changeType: "up",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    gradient: "from-blue-500 to-cyan-500",
    soft: "bg-blue-50 border-blue-100 text-blue-800",
  },
  {
    label: "Courses",
    value: "48",
    change: "6 active this term",
    changeType: "neutral",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    gradient: "from-indigo-500 to-violet-600",
    soft: "bg-indigo-50 border-indigo-100 text-indigo-800",
  },
  {
    label: "Exams",
    value: "126",
    change: "8 currently live",
    changeType: "up",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    gradient: "from-rose-500 to-pink-600",
    soft: "bg-rose-50 border-rose-100 text-rose-800",
  },
  {
    label: "Pass Rate",
    value: "82.4%",
    change: "+2.1% vs last term",
    changeType: "up",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-600",
    soft: "bg-emerald-50 border-emerald-100 text-emerald-800",
  },
];

const secondaryStats = [
  { label: "Active Exams", value: "8", color: "bg-amber-500", soft: "bg-amber-50 text-amber-800 border-amber-100" },
  { label: "Completed Exams", value: "118", color: "bg-emerald-500", soft: "bg-emerald-50 text-emerald-800 border-emerald-100" },
  { label: "Lecturers", value: "36", color: "bg-violet-500", soft: "bg-violet-50 text-violet-800 border-violet-100" },
  { label: "Questions Bank", value: "2,840", color: "bg-cyan-500", soft: "bg-cyan-50 text-cyan-800 border-cyan-100" },
];

const recentActivity = [
  { id: 1, type: "exam", title: "Mid-Semester Test — CSC101", meta: "Started 2 hours ago · 42 students", badge: "Live", badgeColor: "bg-rose-100 text-rose-700" },
  { id: 2, type: "result", title: "ENG150 Final Results published", meta: "28 students graded · Avg 78%", badge: "Results", badgeColor: "bg-emerald-100 text-emerald-700" },
  { id: 3, type: "student", title: "12 new students registered", meta: "Computer Science · Level 100", badge: "Students", badgeColor: "bg-blue-100 text-blue-700" },
  { id: 4, type: "course", title: "MTH201 materials updated", meta: "3 new lessons · Dr. Adeyemi", badge: "Course", badgeColor: "bg-indigo-100 text-indigo-700" },
];

const topCourses = [
  { code: "CSC101", title: "Introduction to Programming", students: 42, passRate: 88 },
  { code: "MTH201", title: "Calculus II", students: 35, passRate: 74 },
  { code: "ENG150", title: "Technical Writing", students: 28, passRate: 91 },
  { code: "PHY110", title: "General Physics", students: 31, passRate: 69 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-12 left-20 h-36 w-36 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="relative flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Admin portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Platform Overview</h1>
            <p className="mt-1 text-sm text-slate-400">
              Real-time snapshot of students, courses, exams and performance.
            </p>
          </div>
          <div className="mt-3 flex gap-2 sm:mt-0">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
              System healthy
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">
              Term: 2025/2026
            </span>
          </div>
        </div>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-xl border p-4 shadow-sm ${stat.soft}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium opacity-80">{stat.label}</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight">{stat.value}</p>
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
              <div className={`rounded-lg bg-gradient-to-br ${stat.gradient} p-2 text-white shadow-md`}>
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
            <h2 className="text-sm font-semibold text-slate-900">Recent Activity</h2>
            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
              View all
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3.5 py-3 transition hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.meta}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${item.badgeColor}`}>
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
                    style={{ width: `${(c.students / 42) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Add Student", href: "/admin/students", color: "from-blue-500 to-cyan-500" },
            { label: "Create Exam", href: "/admin/exams", color: "from-rose-500 to-pink-500" },
            { label: "Add Course", href: "/admin/courses", color: "from-indigo-500 to-violet-500" },
            { label: "View Reports", href: "/admin/reports", color: "from-emerald-500 to-teal-500" },
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
import { useState } from "react";

const courseOptions = [];

const summaryStats = [
  {
    label: "Total Students",
    value: "",
    gradient: "from-blue-500 to-cyan-500",
    soft: "bg-blue-50 border-blue-100 text-blue-900",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Exams Conducted",
    value: "",
    gradient: "from-indigo-500 to-violet-600",
    soft: "bg-indigo-50 border-indigo-100 text-indigo-900",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    label: "Average Score",
    value: "0%",
    gradient: "from-amber-500 to-orange-500",
    soft: "bg-amber-50 border-amber-100 text-amber-900",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    label: "Overall Pass Rate",
    value: "0%",
    gradient: "from-emerald-500 to-teal-600",
    soft: "bg-emerald-50 border-emerald-100 text-emerald-900",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const coursePerformance = [
  { course: "CSC101", title: "Introduction to Programming", avgScore: 78, passRate: 91, students: 42 },
  { course: "MTH201", title: "Calculus II", avgScore: 65, passRate: 79, students: 35 },
  { course: "ENG150", title: "Technical Writing", avgScore: 81, passRate: 96, students: 28 },
];

const recentExams = [
  { id: 1, exam: "Mid-Semester Test", course: "CSC101", avgScore: 76, submissions: 40, date: "2026-09-08" },
  { id: 2, exam: "CA2 Assessment", course: "MTH201", avgScore: 63, submissions: 33, date: "2026-09-05" },
  { id: 3, exam: "First Semester Final", course: "ENG150", avgScore: 82, submissions: 28, date: "2026-08-01" },
];

function ScoreBar({ value }) {
  const color =
    value >= 75 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

function scoreBadge(value) {
  if (value >= 75) return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80";
  if (value >= 50) return "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80";
  return "bg-red-100 text-red-800 ring-1 ring-red-200/80";
}

export default function Reports() {
  const [courseFilter, setCourseFilter] = useState("All Courses");

  const filteredCourses =
    courseFilter === "All Courses"
      ? coursePerformance
      : coursePerformance.filter((c) => c.course === courseFilter);

  const filteredExams =
    courseFilter === "All Courses"
      ? recentExams
      : recentExams.filter((e) => e.course === courseFilter);

  function handleExport() {
    alert("Export will generate a CSV/PDF report once connected to real data.");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-100">Admin portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Reports</h1>
            <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
              Performance overview across courses and exams.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-xl border-0 bg-white/15 px-3 py-2 text-sm font-medium text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              {courseOptions.map((c) => (
                <option key={c} value={c} className="text-slate-900">
                  {c}
                </option>
              ))}
            </select>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-xl border p-4 shadow-sm ${stat.soft}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium opacity-80">{stat.label}</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className={`rounded-lg bg-gradient-to-br ${stat.gradient} p-2 text-white shadow-md`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Performance */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Course Performance</h2>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mt-5 space-y-5">
          {filteredCourses.length === 0 && (
            <p className="text-sm text-slate-400">No data for this course.</p>
          )}
          {filteredCourses.map((c) => (
            <div
              key={c.course}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white shadow-sm">
                    {c.course.slice(0, 3)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{c.course}</p>
                    <p className="text-xs text-slate-500">{c.title}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                    {c.students} students
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreBadge(c.avgScore)}`}>
                    Avg {c.avgScore}%
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreBadge(c.passRate)}`}>
                    Pass {c.passRate}%
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Average score</span>
                  <span className="font-medium text-slate-700">{c.avgScore}%</span>
                </div>
                <ScoreBar value={c.avgScore} />
              </div>
              <div className="mt-2">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Pass rate</span>
                  <span className="font-medium text-slate-700">{c.passRate}%</span>
                </div>
                <ScoreBar value={c.passRate} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Exams table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Recent Exams</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {filteredExams.length} exam{filteredExams.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80">
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Exam
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Course
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Avg Score
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Submissions
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No exams found</p>
                      <p className="text-xs text-slate-400">Try a different course filter.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="transition-colors hover:bg-indigo-50/40">
                  <td className="px-4 py-3.5 font-medium text-slate-900">{exam.exam}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                      {exam.course}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreBadge(exam.avgScore)}`}>
                        {exam.avgScore}%
                      </span>
                      <div className="hidden w-16 sm:block">
                        <ScoreBar value={exam.avgScore} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {exam.submissions}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{exam.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
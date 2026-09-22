import { useState } from "react";

const courseOptions = ["All Courses", "CSC101", "MTH201", "ENG150"];

const initialResults = [
  { id: 1, exam: "Mid-Semester Test", course: "CSC101", score: 82, total: 100, date: "2026-09-08" },
  { id: 2, exam: "First Semester Final", course: "ENG150", score: 90, total: 100, date: "2026-08-01" },
  { id: 3, exam: "CA1 Assessment", course: "MTH201", score: 55, total: 100, date: "2026-07-20" },
];

function getGrade(percent) {
  if (percent >= 70) return "A";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 45) return "D";
  return "F";
}

function gradeColor(grade) {
  if (grade === "A" || grade === "B")
    return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80";
  if (grade === "C" || grade === "D")
    return "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80";
  return "bg-red-100 text-red-800 ring-1 ring-red-200/80";
}

export default function Results() {
  const [results] = useState(initialResults);
  const [courseFilter, setCourseFilter] = useState("All Courses");

  const filtered = results.filter(
    (r) => courseFilter === "All Courses" || r.course === courseFilter
  );

  const avgPercent =
    filtered.length > 0
      ? Math.round(
          filtered.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) /
            filtered.length
        )
      : 0;

  const bestResult = filtered.reduce(
    (best, r) =>
      !best || r.score / r.total > best.score / best.total ? r : best,
    null
  );

  const passCount = filtered.filter(
    (r) => Math.round((r.score / r.total) * 100) >= 45
  ).length;

  const stats = [
    {
      label: "Exams Taken",
      value: filtered.length,
      gradient: "from-indigo-500 to-violet-600",
      soft: "bg-indigo-50 border-indigo-100 text-indigo-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: "Average Score",
      value: filtered.length > 0 ? `${avgPercent}%` : "—",
      gradient: "from-amber-500 to-orange-500",
      soft: "bg-amber-50 border-amber-100 text-amber-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: "Best Result",
      value: bestResult
        ? `${Math.round((bestResult.score / bestResult.total) * 100)}%`
        : "—",
      gradient: "from-emerald-500 to-teal-600",
      soft: "bg-emerald-50 border-emerald-100 text-emerald-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      label: "Passed",
      value: passCount,
      gradient: "from-sky-500 to-cyan-600",
      soft: "bg-sky-50 border-sky-100 text-sky-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-100">Student portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Results</h1>
            <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
              Review your exam scores and grades.
            </p>
          </div>
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
        </div>
      </div>

      {/* Stats */}
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
                  {stat.value}
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

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
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
                  Score
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Grade
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No results found</p>
                      <p className="text-xs text-slate-400">Try a different course filter.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((r) => {
                const percent = Math.round((r.score / r.total) * 100);
                const grade = getGrade(percent);
                return (
                  <tr
                    key={r.id}
                    className="transition-colors hover:bg-indigo-50/40"
                  >
                    <td className="px-4 py-3.5 font-medium text-slate-900">
                      {r.exam}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                        {r.course}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">
                          {r.score}/{r.total}
                        </span>
                        <span className="text-xs text-slate-500">({percent}%)</span>
                        <div className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-slate-100 sm:block">
                          <div
                            className={`h-full rounded-full ${
                              percent >= 70
                                ? "bg-emerald-500"
                                : percent >= 45
                                ? "bg-amber-500"
                                : "bg-red-400"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${gradeColor(grade)}`}
                      >
                        {grade}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{r.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";

const courseOptions = ["All Courses", "CSC101", "MTH201", "ENG150"];

const examsByCourse = {
  CSC101: ["Mid-Semester Test"],
  MTH201: ["CA2 Assessment"],
  ENG150: ["First Semester Final"],
};

const initialResults = [
  { id: 1, student: "Chinedu Okafor", matric: "CSC/2023/041", course: "CSC101", exam: "Mid-Semester Test", score: 82, total: 100 },
  { id: 2, student: "Amaka Eze", matric: "CSC/2023/017", course: "CSC101", exam: "Mid-Semester Test", score: 58, total: 100 },
  { id: 3, student: "Tunde Bakare", matric: "MTH/2023/009", course: "MTH201", exam: "CA2 Assessment", score: 71, total: 100 },
  { id: 4, student: "Ngozi Umeh", matric: "MTH/2023/022", course: "MTH201", exam: "CA2 Assessment", score: 45, total: 100 },
  { id: 5, student: "Fatima Bello", matric: "ENG/2023/003", course: "ENG150", exam: "First Semester Final", score: 90, total: 100 },
];

function getGrade(percent) {
  if (percent >= 70) return "A";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 45) return "D";
  return "F";
}

function gradeColor(grade) {
  if (grade === "A" || grade === "B") return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80";
  if (grade === "C" || grade === "D") return "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80";
  return "bg-red-100 text-red-800 ring-1 ring-red-200/80";
}

function Initials({ name }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white shadow-sm">
      {initials}
    </div>
  );
}

export default function Results() {
  const [results] = useState(initialResults);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [examFilter, setExamFilter] = useState("All Exams");

  const availableExams =
    courseFilter === "All Courses"
      ? ["All Exams", ...Object.values(examsByCourse).flat()]
      : ["All Exams", ...(examsByCourse[courseFilter] || [])];

  const filtered = results.filter((r) => {
    const matchesSearch =
      r.student.toLowerCase().includes(search.toLowerCase()) ||
      r.matric.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === "All Courses" || r.course === courseFilter;
    const matchesExam = examFilter === "All Exams" || r.exam === examFilter;
    return matchesSearch && matchesCourse && matchesExam;
  });

  const passCount = filtered.filter((r) => Math.round((r.score / r.total) * 100) >= 45).length;
  const failCount = filtered.length - passCount;
  const avgPercent =
    filtered.length > 0
      ? Math.round(
          filtered.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) / filtered.length
        )
      : 0;

  function handleCourseChange(value) {
    setCourseFilter(value);
    setExamFilter("All Exams");
  }

  function handleExport() {
    alert("Export will generate a CSV of these results once connected to real data.");
  }

  const stats = [
    {
      label: "Results Shown",
      value: filtered.length,
      gradient: "from-indigo-500 to-violet-600",
      soft: "bg-indigo-50 border-indigo-100 text-indigo-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Passed",
      value: passCount,
      gradient: "from-emerald-500 to-teal-600",
      soft: "bg-emerald-50 border-emerald-100 text-emerald-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Failed",
      value: failCount,
      gradient: "from-red-500 to-rose-600",
      soft: "bg-red-50 border-red-100 text-red-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Average Score",
      value: `${avgPercent}%`,
      gradient: "from-amber-500 to-orange-500",
      soft: "bg-amber-50 border-amber-100 text-amber-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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
            <p className="text-sm font-medium text-indigo-100">Admin portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Results</h1>
            <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
              View and manage student exam results across courses.
            </p>
          </div>
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
                <p className="mt-1.5 text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className={`rounded-lg bg-gradient-to-br ${stat.gradient} p-2 text-white shadow-md`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative min-w-[200px] flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or matric no..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => handleCourseChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {courseOptions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {availableExams.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
        <p className="ml-auto text-xs font-medium text-slate-500">
          Showing <span className="text-slate-800">{filtered.length}</span> of {results.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80">
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Student
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Course
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Exam
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Score
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Grade
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No results found</p>
                      <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((r) => {
                const percent = Math.round((r.score / r.total) * 100);
                const grade = getGrade(percent);
                const passed = percent >= 45;
                return (
                  <tr key={r.id} className="transition-colors hover:bg-indigo-50/40">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Initials name={r.student} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">{r.student}</p>
                          <p className="truncate text-xs text-slate-500">{r.matric}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                        {r.course}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{r.exam}</td>
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
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          passed
                            ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80"
                            : "bg-red-100 text-red-800 ring-1 ring-red-200/80"
                        }`}
                      >
                        {passed ? (
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        {passed ? "Pass" : "Fail"}
                      </span>
                    </td>
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
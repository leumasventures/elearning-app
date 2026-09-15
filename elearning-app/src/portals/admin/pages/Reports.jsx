import { useState } from "react";

const courseOptions = ["All Courses", "CSC101", "MTH201", "ENG150"];

const summaryStats = [
  { label: "Total Students", value: 105 },
  { label: "Exams Conducted", value: 12 },
  { label: "Average Score", value: "74%" },
  { label: "Overall Pass Rate", value: "88%" },
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

function ScoreBar({ value, colorClass = "bg-slate-900" }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${colorClass}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

function scoreColor(value) {
  if (value >= 75) return "bg-green-600";
  if (value >= 50) return "bg-amber-500";
  return "bg-red-500";
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
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">
            Performance overview across courses and exams.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            {courseOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Export
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 p-4"
          >
            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 p-4">
        <h2 className="text-sm font-medium text-slate-900">
          Course Performance
        </h2>
        <div className="mt-4 space-y-4">
          {filteredCourses.length === 0 && (
            <p className="text-sm text-slate-400">No data for this course.</p>
          )}
          {filteredCourses.map((c) => (
            <div key={c.course}>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-slate-900">{c.course}</span>
                  <span className="ml-2 text-slate-500">{c.title}</span>
                </div>
                <span className="text-slate-600">
                  Avg {c.avgScore}% · Pass {c.passRate}% · {c.students} students
                </span>
              </div>
              <div className="mt-1">
                <ScoreBar value={c.avgScore} colorClass={scoreColor(c.avgScore)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Exam</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Course</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Avg Score</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Submissions</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredExams.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No exams found.
                </td>
              </tr>
            )}
            {filteredExams.map((exam) => (
              <tr key={exam.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{exam.exam}</td>
                <td className="px-4 py-3 text-slate-700">{exam.course}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      exam.avgScore >= 75
                        ? "bg-green-100 text-green-700"
                        : exam.avgScore >= 50
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {exam.avgScore}%
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">{exam.submissions}</td>
                <td className="px-4 py-3 text-slate-700">{exam.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
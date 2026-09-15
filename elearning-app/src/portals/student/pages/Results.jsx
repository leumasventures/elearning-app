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
  if (grade === "A" || grade === "B") return "bg-green-100 text-green-700";
  if (grade === "C" || grade === "D") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
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

  return (
    <div>
      <h1 className="text-lg font-medium text-slate-900">Results</h1>
      <p className="mt-1 text-sm text-slate-500">
        Review your exam scores and grades.
      </p>

      <div className="mt-4">
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          {courseOptions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500">Exams Taken</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {filtered.length}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500">Average Score</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {filtered.length > 0 ? `${avgPercent}%` : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500">Best Result</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {bestResult
              ? `${Math.round((bestResult.score / bestResult.total) * 100)}%`
              : "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Exam</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Course</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Score</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Grade</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No results found.
                </td>
              </tr>
            )}
            {filtered.map((r) => {
              const percent = Math.round((r.score / r.total) * 100);
              const grade = getGrade(percent);
              return (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.exam}</td>
                  <td className="px-4 py-3 text-slate-700">{r.course}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {r.score}/{r.total} ({percent}%)
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${gradeColor(
                        grade
                      )}`}
                    >
                      {grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{r.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
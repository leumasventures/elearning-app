import { useEffect, useState } from "react";
import { getCourses, getResults } from "../../../lib/api";

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
  const [results, setResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [rList, cList] = await Promise.all([getResults(), getCourses()]);
        setResults(rList);
        setCourses(cList);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load results");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = results.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (r.student || "").toLowerCase().includes(q) ||
      String(r.matric || "")
        .toLowerCase()
        .includes(q);
    const matchesCourse =
      courseFilter === "All" || r.courseId === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const passCount = filtered.filter(
    (r) => (r.percent ?? Math.round((r.score / (r.total || 1)) * 100)) >= 45
  ).length;
  const failCount = filtered.length - passCount;
  const avgPercent =
    filtered.length > 0
      ? Math.round(
          filtered.reduce(
            (sum, r) =>
              sum + (r.percent ?? Math.round((r.score / (r.total || 1)) * 100)),
            0
          ) / filtered.length
        )
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-500">Loading results from database…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Results</h1>
        <p className="text-sm text-slate-500">
          Exam submissions stored in MySQL.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Records", value: filtered.length },
          { label: "Pass (≥45%)", value: passCount },
          { label: "Fail", value: failCount },
          { label: "Avg %", value: avgPercent },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student or matric…"
          className="w-full max-w-sm rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
        />
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
        >
          <option value="All">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Exam</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                  No results in the database yet.
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const percent =
                  r.percent ??
                  Math.round((r.score / (r.total || 1)) * 100);
                const grade = getGrade(percent);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Initials name={r.student} />
                        <div>
                          <p className="font-medium text-slate-800">
                            {r.student || "—"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {r.matric || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {r.examTitle || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {r.courseCode || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {r.score}/{r.total} ({percent}%)
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${gradeColor(
                          grade
                        )}`}
                      >
                        {grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {r.submittedAt
                        ? new Date(r.submittedAt).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

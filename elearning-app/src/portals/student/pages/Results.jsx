import { useEffect, useState } from "react";
import { getResults } from "../../../lib/api";

function getGrade(percent) {
  if (percent >= 70) return "A";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 45) return "D";
  return "F";
}

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const list = await getResults();
        setResults(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load results");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
        <h1 className="text-2xl font-semibold text-slate-900">My Results</h1>
        <p className="text-sm text-slate-500">
          Your exam scores from the database.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Exam</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                  No results yet. Complete a CBT exam to see scores here.
                </td>
              </tr>
            ) : (
              results.map((r) => {
                const percent =
                  r.percent ?? Math.round((r.score / (r.total || 1)) * 100);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {r.examTitle || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {r.courseCode || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {r.score}/{r.total} ({percent}%)
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {getGrade(percent)}
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

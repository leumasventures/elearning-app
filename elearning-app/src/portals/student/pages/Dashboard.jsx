import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getEnrollments, getExams, getResults } from "../../../lib/api";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [enr, ex, res] = await Promise.all([
          getEnrollments(),
          getExams(),
          getResults(),
        ]);
        setEnrollments(enr);
        setExams(
          ex.filter((e) => e.status === "Active" || e.status === "Scheduled")
        );
        setResults(res);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-500">
          Loading dashboard from database…
        </p>
      </div>
    );
  }

  const avgProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((s, e) => s + (e.progress || 0), 0) /
            enrollments.length
        )
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-slate-500">
          Live data from MySQL — enrollments, exams, and results.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Enrolled courses", value: enrollments.length },
          { label: "Avg progress", value: `${avgProgress}%` },
          { label: "Open exams", value: exams.length },
          { label: "Results", value: results.length },
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

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">My courses</h2>
            <Link
              to="/student/courses"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {enrollments.length === 0 ? (
              <li className="text-sm text-slate-500">
                No enrollments yet.{" "}
                <Link to="/student/courses" className="text-indigo-600">
                  Browse courses
                </Link>
              </li>
            ) : (
              enrollments.slice(0, 5).map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="font-medium text-slate-800">
                    {e.course?.code || e.courseId} — {e.course?.title || ""}
                  </span>
                  <span className="text-slate-500">{e.progress || 0}%</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Upcoming exams</h2>
            <Link
              to="/student/cbt-exams"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              CBT
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {exams.length === 0 ? (
              <li className="text-sm text-slate-500">No open exams.</li>
            ) : (
              exams.slice(0, 5).map((ex) => (
                <li key={ex.id} className="text-sm">
                  <span className="font-medium text-slate-800">{ex.title}</span>
                  <span className="text-slate-500">
                    {" "}
                    · {ex.courseCode || ""} · {ex.status}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

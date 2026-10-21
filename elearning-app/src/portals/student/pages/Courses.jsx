import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { enrollInCourse, getCourses, getEnrollments } from "../../../lib/api";

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [enrolling, setEnrolling] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [courseList, enrollments] = await Promise.all([
        getCourses(),
        getEnrollments(),
      ]);
      setCourses(courseList.filter((c) => c.status !== "Draft"));
      setEnrolledIds(new Set(enrollments.map((e) => e.courseId)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleEnroll(courseId) {
    setEnrolling(courseId);
    setError("");
    try {
      await enrollInCourse(courseId);
      setSuccess("Enrolled successfully");
      setTimeout(() => setSuccess(""), 2500);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setEnrolling(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-500">Loading courses from database…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Courses</h1>
        <p className="text-sm text-slate-500">
          Browse and enroll — data from MySQL.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.length === 0 ? (
          <p className="col-span-full py-12 text-center text-slate-500">
            No active courses in the database.
          </p>
        ) : (
          courses.map((c) => {
            const enrolled = enrolledIds.has(c.id);
            return (
              <div
                key={c.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                    {c.code}
                  </span>
                  {enrolled && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      Enrolled
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">
                  {c.title}
                </h2>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-500">
                  {c.description || c.lecturerName || "No description"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                  {c.units != null && <span>{c.units} units</span>}
                  {c.duration && <span>· {c.duration}</span>}
                </div>
                <div className="mt-4 flex gap-2">
                  {enrolled ? (
                    <Link
                      to="/student/lessons"
                      className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Go to lessons
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleEnroll(c.id)}
                      disabled={enrolling === c.id}
                      className="flex-1 rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
                    >
                      {enrolling === c.id ? "Enrolling…" : "Enroll"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

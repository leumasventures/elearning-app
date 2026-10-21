import { useEffect, useState } from "react";
import {
  getEnrollments,
  getLessons,
  updateEnrollmentProgress,
} from "../../../lib/api";

export default function StudentLessons() {
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadEnrollments() {
      setLoading(true);
      setError("");
      try {
        const list = await getEnrollments();
        setEnrollments(list);
        if (list.length > 0) setSelectedCourseId(list[0].courseId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load enrollments");
      } finally {
        setLoading(false);
      }
    }
    loadEnrollments();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setLessons([]);
      setActiveLesson(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await getLessons(selectedCourseId);
        if (!cancelled) {
          setLessons(list);
          setActiveLesson(list[0] || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load lessons");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedCourseId]);

  const enrollment = enrollments.find((e) => e.courseId === selectedCourseId);

  async function markComplete() {
    if (!enrollment || !activeLesson) return;
    const total = lessons.length || 1;
    const completed = Math.min((enrollment.lessonsCompleted || 0) + 1, total);
    const progress = Math.round((completed / total) * 100);
    try {
      await updateEnrollmentProgress(enrollment.id, {
        lessonsCompleted: completed,
        progress,
      });
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === enrollment.id
            ? { ...e, lessonsCompleted: completed, progress }
            : e
        )
      );
      setSuccess("Progress saved to database");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update progress");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-500">Loading lessons from database…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Lessons</h1>
        <p className="text-sm text-slate-500">
          Content and progress are stored in MySQL.
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

      {enrollments.length === 0 ? (
        <p className="py-12 text-center text-slate-500">
          You are not enrolled in any course. Enroll from the Courses page.
        </p>
      ) : (
        <>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          >
            {enrollments.map((e) => (
              <option key={e.id} value={e.courseId}>
                {e.course?.code || e.courseId} — {e.course?.title || "Course"}{" "}
                ({e.progress || 0}%)
              </option>
            ))}
          </select>

          <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Lessons
              </p>
              <ul className="space-y-1">
                {lessons.length === 0 ? (
                  <li className="px-2 py-4 text-sm text-slate-500">
                    No lessons for this course yet.
                  </li>
                ) : (
                  lessons.map((l) => (
                    <li key={l.id}>
                      <button
                        onClick={() => setActiveLesson(l)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                          activeLesson?.id === l.id
                            ? "bg-indigo-50 font-medium text-indigo-800"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xs text-slate-400">{l.order}.</span>{" "}
                        {l.title}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {activeLesson ? (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        {activeLesson.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {activeLesson.duration}
                      </p>
                    </div>
                    <button
                      onClick={markComplete}
                      className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      Mark complete
                    </button>
                  </div>
                  <div className="prose prose-slate mt-6 max-w-none whitespace-pre-wrap text-sm text-slate-700">
                    {activeLesson.content || "No content for this lesson."}
                  </div>
                </>
              ) : (
                <p className="text-slate-500">Select a lesson to view.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

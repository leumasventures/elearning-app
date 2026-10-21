import { useEffect, useState } from "react";
import {
  createExam,
  deleteExam,
  getCourses,
  getExams,
  getQuestions,
  updateExam,
} from "../../../lib/api";

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
  Scheduled: "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80",
  Closed: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80",
};

const emptyForm = {
  title: "",
  courseId: "",
  durationMinutes: "60",
  startDate: "",
  status: "Scheduled",
  questionIds: [],
};

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [examList, courseList, questionList] = await Promise.all([
        getExams(),
        getCourses(),
        getQuestions(),
      ]);
      setExams(examList);
      setCourses(courseList);
      setQuestions(questionList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load exams");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c]));

  const filtered = exams.filter((e) => {
    const q = search.toLowerCase();
    const code = e.courseCode || courseMap[e.courseId]?.code || "";
    const matchesSearch =
      (e.title || "").toLowerCase().includes(q) || code.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const scheduledCount = exams.filter((e) => e.status === "Scheduled").length;
  const activeCount = exams.filter((e) => e.status === "Active").length;
  const closedCount = exams.filter((e) => e.status === "Closed").length;
  const totalQuestions = exams.reduce(
    (sum, e) => sum + (e.questionCount ?? e.questionIds?.length ?? 0),
    0
  );

  function openAddModal() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      courseId: courses[0]?.id || "",
      startDate: new Date().toISOString().slice(0, 16),
    });
    setError("");
    setModalOpen(true);
  }

  function openEditModal(exam) {
    setEditingId(exam.id);
    setForm({
      title: exam.title,
      courseId: exam.courseId,
      durationMinutes: String(exam.durationMinutes ?? 60),
      startDate: exam.startDate
        ? new Date(exam.startDate).toISOString().slice(0, 16)
        : "",
      status: exam.status || "Scheduled",
      questionIds: exam.questionIds || [],
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  function toggleQuestion(id) {
    setForm((prev) => {
      const set = new Set(prev.questionIds);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, questionIds: [...set] };
    });
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete exam "${title}" from the database?`)) return;
    try {
      await deleteExam(id);
      setSuccess("Exam deleted");
      setTimeout(() => setSuccess(""), 2500);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.courseId) {
      setError("Title and course are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        courseId: form.courseId,
        durationMinutes: Number(form.durationMinutes) || 60,
        startDate: form.startDate
          ? new Date(form.startDate).toISOString()
          : new Date().toISOString(),
        status: form.status,
        questionIds: form.questionIds,
      };
      if (editingId) {
        await updateExam(editingId, payload);
        setSuccess("Exam updated in database");
      } else {
        await createExam(payload);
        setSuccess("Exam created in database");
      }
      setTimeout(() => setSuccess(""), 2500);
      closeModal();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const questionsForCourse = questions.filter(
    (q) => q.courseId === form.courseId
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-500">Loading exams from database…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-100">Admin portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Exams</h1>
            <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
              Schedule and manage CBT exams — all records persist in MySQL.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
          >
            + Add Exam
          </button>
        </div>
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Total Exams", value: exams.length },
          { label: "Scheduled", value: scheduledCount },
          { label: "Active Now", value: activeCount },
          { label: "Closed", value: closedCount },
          { label: "Linked Questions", value: totalQuestions },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or course code…"
          className="w-full max-w-sm rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
        >
          <option value="All">All statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Questions</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  No exams in the database yet.
                </td>
              </tr>
            ) : (
              filtered.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {exam.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {exam.courseCode || courseMap[exam.courseId]?.code || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {exam.durationMinutes} min
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {exam.questionCount ?? exam.questionIds?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(exam.startDate)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusStyles[exam.status] || statusStyles.Scheduled
                      }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(exam)}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id, exam.title)}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Edit exam" : "Create exam"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Saved directly to the database.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Course
                </label>
                <select
                  value={form.courseId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      courseId: e.target.value,
                      questionIds: [],
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  required
                  disabled={!!editingId}
                >
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.durationMinutes}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        durationMinutes: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Start date/time
                </label>
                <input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Questions ({form.questionIds.length} selected)
                </label>
                <div className="mt-1 max-h-40 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
                  {questionsForCourse.length === 0 ? (
                    <p className="px-2 py-3 text-xs text-slate-500">
                      No questions for this course in the database.
                    </p>
                  ) : (
                    questionsForCourse.map((q) => (
                      <label
                        key={q.id}
                        className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={form.questionIds.includes(q.id)}
                          onChange={() => toggleQuestion(q.id)}
                          className="mt-1"
                        />
                        <span className="text-xs text-slate-700">
                          [{q.type}] {q.text.slice(0, 80)}
                          {q.text.length > 80 ? "…" : ""}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? "Saving…" : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

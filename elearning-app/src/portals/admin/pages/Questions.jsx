import { useEffect, useState } from "react";
import {
  createQuestion,
  deleteQuestion,
  getCourses,
  getQuestions,
  updateQuestion,
} from "../../../lib/api";

const typeStyles = {
  MCQ: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200/80",
  "True/False": "bg-violet-100 text-violet-800 ring-1 ring-violet-200/80",
};

const emptyForm = {
  courseId: "",
  type: "MCQ",
  text: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  points: 1,
};

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
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
      const [qList, cList] = await Promise.all([getQuestions(), getCourses()]);
      setQuestions(qList);
      setCourses(cList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c]));

  const filtered = questions.filter((q) => {
    const matchesSearch = (q.text || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCourse =
      courseFilter === "All" || q.courseId === courseFilter;
    const matchesType = typeFilter === "All" || q.type === typeFilter;
    return matchesSearch && matchesCourse && matchesType;
  });

  const mcqCount = questions.filter((q) => q.type === "MCQ").length;
  const tfCount = questions.filter((q) => q.type === "True/False").length;
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  function openAddModal() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      courseId: courses[0]?.id || "",
    });
    setError("");
    setModalOpen(true);
  }

  function openEditModal(question) {
    setEditingId(question.id);
    setForm({
      courseId: question.courseId,
      type: question.type,
      text: question.text,
      options:
        question.type === "True/False"
          ? ["True", "False"]
          : [...(question.options || ["", "", "", ""])],
      correctIndex: question.correctIndex ?? 0,
      points: question.points ?? 1,
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

  function handleTypeChange(type) {
    setForm((prev) => ({
      ...prev,
      type,
      options: type === "True/False" ? ["True", "False"] : ["", "", "", ""],
      correctIndex: 0,
    }));
  }

  function updateOption(index, value) {
    setForm((prev) => {
      const options = [...prev.options];
      options[index] = value;
      return { ...prev, options };
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this question from the database?")) return;
    try {
      await deleteQuestion(id);
      setSuccess("Question deleted");
      setTimeout(() => setSuccess(""), 2500);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.text.trim() || !form.courseId) {
      setError("Course and question text are required.");
      return;
    }
    const options = form.options.map((o) => o.trim()).filter(Boolean);
    if (options.length < 2) {
      setError("Provide at least two options.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        courseId: form.courseId,
        type: form.type,
        text: form.text.trim(),
        options,
        correctIndex: Number(form.correctIndex) || 0,
        points: Number(form.points) || 1,
      };
      if (editingId) {
        await updateQuestion(editingId, payload);
        setSuccess("Question updated in database");
      } else {
        await createQuestion(payload);
        setSuccess("Question created in database");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-500">
          Loading questions from database…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Questions</h1>
          <p className="text-sm text-slate-500">
            Question bank stored in MySQL. Used when building exams.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Add question
        </button>
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: questions.length },
          { label: "MCQ", value: mcqCount },
          { label: "True/False", value: tfCount },
          { label: "Total points", value: totalPoints },
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
          placeholder="Search question text…"
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
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
        >
          <option value="All">All types</option>
          <option value="MCQ">MCQ</option>
          <option value="True/False">True/False</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Points</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                  No questions in the database.
                </td>
              </tr>
            ) : (
              filtered.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/80">
                  <td className="max-w-md px-4 py-3 text-slate-800">
                    <p className="line-clamp-2">{q.text}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {courseMap[q.courseId]?.code || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        typeStyles[q.type] || typeStyles.MCQ
                      }`}
                    >
                      {q.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{q.points}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(q)}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
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
              {editingId ? "Edit question" : "Add question"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Course
                </label>
                <select
                  value={form.courseId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, courseId: e.target.value }))
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
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="MCQ">MCQ</option>
                  <option value="True/False">True/False</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Question text
                </label>
                <textarea
                  value={form.text}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, text: e.target.value }))
                  }
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600">
                  Options (select correct)
                </label>
                {form.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={form.correctIndex === i}
                      onChange={() =>
                        setForm((f) => ({ ...f, correctIndex: i }))
                      }
                    />
                    <input
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      disabled={form.type === "True/False"}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Points
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.points}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, points: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
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

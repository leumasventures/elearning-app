import { useState } from "react";

const courseOptions = ["CSC101", "MTH201", "ENG150"];

const initialExams = [
  {
    id: 1,
    title: "Mid-Semester Test",
    course: "CSC101",
    duration: 60,
    questionCount: 20,
    startDate: "2026-09-20T09:00",
    status: "Scheduled",
  },
  {
    id: 2,
    title: "CA2 Assessment",
    course: "MTH201",
    duration: 45,
    questionCount: 15,
    startDate: "2026-09-15T10:00",
    status: "Active",
  },
  {
    id: 3,
    title: "First Semester Final",
    course: "ENG150",
    duration: 90,
    questionCount: 30,
    startDate: "2026-08-01T09:00",
    status: "Closed",
  },
];

const emptyForm = {
  title: "",
  course: courseOptions[0],
  duration: "",
  questionCount: "",
  startDate: "",
  status: "Scheduled",
};

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Exams() {
  const [exams, setExams] = useState(initialExams);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = exams.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.course.toLowerCase().includes(q)
    );
  });

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(exam) {
    setEditingId(exam.id);
    setForm({
      title: exam.title,
      course: exam.course,
      duration: exam.duration,
      questionCount: exam.questionCount,
      startDate: exam.startDate,
      status: exam.status,
    });
    setShowForm(true);
  }

  function handleDelete(id) {
    if (confirm("Delete this exam? This cannot be undone.")) {
      setExams((prev) => prev.filter((e) => e.id !== id));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.course) return;

    const payload = {
      ...form,
      duration: Number(form.duration) || 0,
      questionCount: Number(form.questionCount) || 0,
    };

    if (editingId) {
      setExams((prev) =>
        prev.map((ex) => (ex.id === editingId ? { ...ex, ...payload } : ex))
      );
    } else {
      setExams((prev) => [...prev, { id: Date.now(), ...payload }]);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-slate-900">Exams</h1>
          <p className="mt-1 text-sm text-slate-500">
            Schedule and manage CBT exams across courses.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Add Exam
        </button>
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or course..."
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      {showForm && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-medium text-slate-900">
            {editingId ? "Edit Exam" : "Schedule New Exam"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-600">Exam Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Mid-Semester Test"
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Course</label>
              <select
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              >
                {courseOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Duration (minutes)</label>
              <input
                type="number"
                min="0"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Number of Questions</label>
              <input
                type="number"
                min="0"
                value={form.questionCount}
                onChange={(e) => setForm({ ...form, questionCount: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Start Date & Time</label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              >
                <option>Scheduled</option>
                <option>Active</option>
                <option>Closed</option>
              </select>
            </div>
            <div className="flex items-end gap-2 sm:col-span-2">
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                {editingId ? "Save Changes" : "Schedule Exam"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Title</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Course</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Duration</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Questions</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Start</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  No exams found.
                </td>
              </tr>
            )}
            {filtered.map((exam) => (
              <tr key={exam.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{exam.title}</td>
                <td className="px-4 py-3 text-slate-700">{exam.course}</td>
                <td className="px-4 py-3 text-slate-700">{exam.duration} min</td>
                <td className="px-4 py-3 text-slate-700">{exam.questionCount}</td>
                <td className="px-4 py-3 text-slate-700">{formatDate(exam.startDate)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      exam.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : exam.status === "Scheduled"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {exam.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEditForm(exam)}
                    className="mr-3 text-sm font-medium text-slate-700 hover:text-slate-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
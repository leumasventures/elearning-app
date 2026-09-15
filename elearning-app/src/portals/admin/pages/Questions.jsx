import { useState } from "react";

const courseOptions = ["CSC101", "MTH201", "ENG150"];

const initialQuestions = [
  {
    id: 1,
    course: "CSC101",
    type: "MCQ",
    text: "Which of the following is not a programming language?",
    options: ["Python", "Java", "HTML", "Photoshop"],
    correctIndex: 3,
    points: 2,
  },
  {
    id: 2,
    course: "MTH201",
    type: "True/False",
    text: "The derivative of a constant is always zero.",
    options: ["True", "False"],
    correctIndex: 0,
    points: 1,
  },
  {
    id: 3,
    course: "ENG150",
    type: "MCQ",
    text: "Which of these best describes technical writing?",
    options: [
      "Creative storytelling",
      "Clear, factual communication for a specific purpose",
      "Poetry with technical themes",
      "Informal conversation",
    ],
    correctIndex: 1,
    points: 2,
  },
];

const emptyForm = {
  course: courseOptions[0],
  type: "MCQ",
  text: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  points: 1,
};

export default function Questions() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = questions.filter((q) => {
    const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === "All" || q.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(question) {
    setEditingId(question.id);
    setForm({
      course: question.course,
      type: question.type,
      text: question.text,
      options:
        question.type === "True/False"
          ? ["True", "False"]
          : [...question.options],
      correctIndex: question.correctIndex,
      points: question.points,
    });
    setShowForm(true);
  }

  function handleDelete(id) {
    if (confirm("Delete this question? This cannot be undone.")) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
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

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.text.trim()) return;
    if (form.type === "MCQ" && form.options.some((o) => !o.trim())) return;

    const payload = { ...form, points: Number(form.points) || 1 };

    if (editingId) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingId ? { ...q, ...payload } : q))
      );
    } else {
      setQuestions((prev) => [...prev, { id: Date.now(), ...payload }]);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-slate-900">Questions</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the question bank used across CBT exams.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Add Question
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search question text..."
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option>All</option>
          {courseOptions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-medium text-slate-900">
            {editingId ? "Edit Question" : "Add New Question"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-3 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                <label className="text-xs font-medium text-slate-600">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                >
                  <option>MCQ</option>
                  <option>True/False</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Points</label>
                <input
                  type="number"
                  min="1"
                  value={form.points}
                  onChange={(e) => setForm({ ...form, points: e.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Question Text</label>
              <textarea
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                rows={2}
                placeholder="Enter the question..."
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Options — select the correct answer
              </label>
              <div className="mt-1 space-y-2">
                {form.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={form.correctIndex === i}
                      onChange={() => setForm({ ...form, correctIndex: i })}
                      className="h-4 w-4"
                    />
                    <input
                      type="text"
                      value={opt}
                      disabled={form.type === "True/False"}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                {editingId ? "Save Changes" : "Add Question"}
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

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <p className="rounded-lg border border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
            No questions found.
          </p>
        )}
        {filtered.map((q) => (
          <div
            key={q.id}
            className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                    {q.course}
                  </span>
                  <span>{q.type}</span>
                  <span>· {q.points} pt{q.points !== 1 ? "s" : ""}</span>
                </div>
                <p className="mt-1 font-medium text-slate-900">{q.text}</p>
                <ul className="mt-2 space-y-1">
                  {q.options.map((opt, i) => (
                    <li
                      key={i}
                      className={`text-sm ${
                        i === q.correctIndex
                          ? "font-medium text-green-700"
                          : "text-slate-600"
                      }`}
                    >
                      {i === q.correctIndex ? "✓ " : "• "}
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={() => openEditForm(q)}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
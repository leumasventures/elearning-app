import { useState } from "react";

const initialCourses = [
  {
    id: 1,
    code: "CSC101",
    title: "Introduction to Programming",
    lecturer: "Dr. A. Obi",
    students: 42,
    status: "Active",
  },
  {
    id: 2,
    code: "MTH201",
    title: "Calculus II",
    lecturer: "Prof. F. Adeyemi",
    students: 35,
    status: "Active",
  },
  {
    id: 3,
    code: "ENG150",
    title: "Technical Writing",
    lecturer: "Mrs. C. Nwosu",
    students: 28,
    status: "Draft",
  },
];

const emptyForm = { code: "", title: "", lecturer: "", students: "", status: "Draft" };

export default function Courses() {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.lecturer.toLowerCase().includes(q)
    );
  });

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(course) {
    setEditingId(course.id);
    setForm({
      code: course.code,
      title: course.title,
      lecturer: course.lecturer,
      students: course.students,
      status: course.status,
    });
    setShowForm(true);
  }

  function handleDelete(id) {
    if (confirm("Delete this course? This cannot be undone.")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.code.trim() || !form.title.trim()) return;

    if (editingId) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, ...form, students: Number(form.students) || 0 }
            : c
        )
      );
    } else {
      setCourses((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          students: Number(form.students) || 0,
        },
      ]);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-slate-900">Courses</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage courses offered across the platform.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Add Course
        </button>
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, code, or lecturer..."
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      {showForm && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-medium text-slate-900">
            {editingId ? "Edit Course" : "Add New Course"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <div>
              <label className="text-xs font-medium text-slate-600">Course Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. CSC101"
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Course Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Introduction to Programming"
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Lecturer</label>
              <input
                type="text"
                value={form.lecturer}
                onChange={(e) => setForm({ ...form, lecturer: e.target.value })}
                placeholder="e.g. Dr. A. Obi"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Enrolled Students</label>
              <input
                type="number"
                min="0"
                value={form.students}
                onChange={(e) => setForm({ ...form, students: e.target.value })}
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
                <option>Active</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                {editingId ? "Save Changes" : "Add Course"}
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
              <th className="px-4 py-3 text-left font-medium text-slate-600">Code</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Title</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Lecturer</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Students</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No courses found.
                </td>
              </tr>
            )}
            {filtered.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{course.code}</td>
                <td className="px-4 py-3 text-slate-700">{course.title}</td>
                <td className="px-4 py-3 text-slate-700">{course.lecturer || "—"}</td>
                <td className="px-4 py-3 text-slate-700">{course.students}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      course.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : course.status === "Draft"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEditForm(course)}
                    className="mr-3 text-sm font-medium text-slate-700 hover:text-slate-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
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
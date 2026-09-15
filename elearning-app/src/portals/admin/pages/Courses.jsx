import { useState } from "react";

const initialCourses = [
  { id: 1, code: "CSC101", title: "Introduction to Computer Science", lecturer: "Dr. A. Okoye", units: 3, students: 42, status: "Active" },
  { id: 2, code: "MTH204", title: "Linear Algebra", lecturer: "Prof. B. Adeyemi", units: 4, students: 31, status: "Active" },
  { id: 3, code: "ENG150", title: "Technical Writing", lecturer: "Mrs. C. Eze", units: 2, students: 58, status: "Draft" },
  { id: 4, code: "PHY102", title: "General Physics II", lecturer: "Dr. D. Bello", units: 3, students: 27, status: "Archived" },
];

const emptyForm = { code: "", title: "", lecturer: "", units: "", status: "Draft" };

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Draft: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Archived: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export default function Courses() {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filtered = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.lecturer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(course) {
    setEditingId(course.id);
    setForm({
      code: course.code,
      title: course.title,
      lecturer: course.lecturer,
      units: String(course.units),
      status: course.status,
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(emptyForm);
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.code.trim() || !form.title.trim() || !form.lecturer.trim() || !form.units) {
      setError("Please fill in all fields before saving.");
      return;
    }
    if (Number(form.units) <= 0) {
      setError("Credit units must be a positive number.");
      return;
    }

    if (editingId) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, ...form, units: Number(form.units) }
            : c
        )
      );
    } else {
      const newCourse = {
        id: Math.max(0, ...courses.map((c) => c.id)) + 1,
        ...form,
        units: Number(form.units),
        students: 0,
      };
      setCourses((prev) => [newCourse, ...prev]);
    }
    closeModal();
  }

  function handleDelete(id) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-slate-900">Courses</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage course listings, lecturers, and credit units.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add Course
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, code, or lecturer..."
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        >
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-slate-600">Code</th>
              <th className="px-4 py-2 text-left font-medium text-slate-600">Title</th>
              <th className="px-4 py-2 text-left font-medium text-slate-600">Lecturer</th>
              <th className="px-4 py-2 text-left font-medium text-slate-600">Units</th>
              <th className="px-4 py-2 text-left font-medium text-slate-600">Students</th>
              <th className="px-4 py-2 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-2 text-right font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  No courses match your search.
                </td>
              </tr>
            ) : (
              filtered.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium text-slate-900">{course.code}</td>
                  <td className="px-4 py-2 text-slate-700">{course.title}</td>
                  <td className="px-4 py-2 text-slate-700">{course.lecturer}</td>
                  <td className="px-4 py-2 text-slate-700">{course.units}</td>
                  <td className="px-4 py-2 text-slate-700">{course.students}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[course.status]}`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => openEditModal(course)}
                      className="mr-3 text-slate-600 hover:text-slate-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-800"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
            <h2 className="text-base font-medium text-slate-900">
              {editingId ? "Edit Course" : "Add Course"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600">Course Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                  placeholder="e.g. CSC101"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                  placeholder="e.g. Introduction to Computer Science"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Lecturer</label>
                <input
                  type="text"
                  value={form.lecturer}
                  onChange={(e) => setForm({ ...form, lecturer: e.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                  placeholder="e.g. Dr. A. Okoye"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Credit Units</label>
                  <input
                    type="number"
                    min="1"
                    value={form.units}
                    onChange={(e) => setForm({ ...form, units: e.target.value })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  {editingId ? "Save Changes" : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
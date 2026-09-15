import { useState } from "react";

const courseOptions = ["CSC101", "MTH201", "ENG150"];

const initialLecturers = [
  {
    id: 1,
    name: "Dr. A. Obi",
    email: "a.obi@school.edu",
    department: "Computer Science",
    courses: ["CSC101"],
    status: "Active",
  },
  {
    id: 2,
    name: "Prof. F. Adeyemi",
    email: "f.adeyemi@school.edu",
    department: "Mathematics",
    courses: ["MTH201"],
    status: "Active",
  },
  {
    id: 3,
    name: "Mrs. C. Nwosu",
    email: "c.nwosu@school.edu",
    department: "Languages",
    courses: ["ENG150"],
    status: "On Leave",
  },
];

const emptyForm = {
  name: "",
  email: "",
  department: "",
  courses: [],
  status: "Active",
};

export default function Lecturers() {
  const [lecturers, setLecturers] = useState(initialLecturers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = lecturers.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.department.toLowerCase().includes(q)
    );
  });

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(lecturer) {
    setEditingId(lecturer.id);
    setForm({
      name: lecturer.name,
      email: lecturer.email,
      department: lecturer.department,
      courses: lecturer.courses,
      status: lecturer.status,
    });
    setShowForm(true);
  }

  function handleDelete(id) {
    if (confirm("Remove this lecturer? This cannot be undone.")) {
      setLecturers((prev) => prev.filter((l) => l.id !== id));
    }
  }

  function toggleCourse(course) {
    setForm((prev) => {
      const has = prev.courses.includes(course);
      return {
        ...prev,
        courses: has
          ? prev.courses.filter((c) => c !== course)
          : [...prev.courses, course],
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    if (editingId) {
      setLecturers((prev) =>
        prev.map((l) => (l.id === editingId ? { ...l, ...form } : l))
      );
    } else {
      setLecturers((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-slate-900">Lecturers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage lecturers and their course assignments.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Add Lecturer
        </button>
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or department..."
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      {showForm && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-medium text-slate-900">
            {editingId ? "Edit Lecturer" : "Add New Lecturer"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <div>
              <label className="text-xs font-medium text-slate-600">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Dr. A. Obi"
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. a.obi@school.edu"
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Department</label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="e.g. Computer Science"
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
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-600">Assigned Courses</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {courseOptions.map((course) => {
                  const active = form.courses.includes(course);
                  return (
                    <button
                      type="button"
                      key={course}
                      onClick={() => toggleCourse(course)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {course}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-end gap-2 sm:col-span-2">
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                {editingId ? "Save Changes" : "Add Lecturer"}
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
              <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Department</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Courses</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No lecturers found.
                </td>
              </tr>
            )}
            {filtered.map((lecturer) => (
              <tr key={lecturer.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{lecturer.name}</td>
                <td className="px-4 py-3 text-slate-700">{lecturer.email}</td>
                <td className="px-4 py-3 text-slate-700">{lecturer.department || "—"}</td>
                <td className="px-4 py-3 text-slate-700">
                  {lecturer.courses.length > 0 ? lecturer.courses.join(", ") : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      lecturer.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : lecturer.status === "On Leave"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {lecturer.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEditForm(lecturer)}
                    className="mr-3 text-sm font-medium text-slate-700 hover:text-slate-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lecturer.id)}
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
import { useState } from "react";

const courseOptions = ["CSC101", "MTH201", "ENG150"];

const initialStudents = [
  {
    id: 1,
    name: "Chinedu Okafor",
    matric: "CSC/2023/041",
    email: "chinedu.okafor@student.edu",
    courses: ["CSC101"],
    status: "Active",
  },
  {
    id: 2,
    name: "Amaka Eze",
    matric: "CSC/2023/017",
    email: "amaka.eze@student.edu",
    courses: ["CSC101"],
    status: "Active",
  },
  {
    id: 3,
    name: "Tunde Bakare",
    matric: "MTH/2023/009",
    email: "tunde.bakare@student.edu",
    courses: ["MTH201"],
    status: "Suspended",
  },
  {
    id: 4,
    name: "Fatima Bello",
    matric: "ENG/2023/003",
    email: "fatima.bello@student.edu",
    courses: ["ENG150"],
    status: "Active",
  },
];

const emptyForm = {
  name: "",
  matric: "",
  email: "",
  courses: [],
  status: "Active",
};

export default function Students() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      s.matric.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q);
    const matchesCourse = courseFilter === "All" || s.courses.includes(courseFilter);
    return matchesSearch && matchesCourse;
  });

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(student) {
    setEditingId(student.id);
    setForm({
      name: student.name,
      matric: student.matric,
      email: student.email,
      courses: student.courses,
      status: student.status,
    });
    setShowForm(true);
  }

  function handleDelete(id) {
    if (confirm("Remove this student? This cannot be undone.")) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
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
    if (!form.name.trim() || !form.matric.trim() || !form.email.trim()) return;

    if (editingId) {
      setStudents((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...form } : s))
      );
    } else {
      setStudents((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-slate-900">Students</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage student records and course enrollment.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Add Student
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, matric no., or email..."
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
            {editingId ? "Edit Student" : "Add New Student"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-3 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs font-medium text-slate-600">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Chinedu Okafor"
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Matric No.</label>
                <input
                  type="text"
                  value={form.matric}
                  onChange={(e) => setForm({ ...form, matric: e.target.value })}
                  placeholder="e.g. CSC/2023/041"
                  required
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
                  <option>Suspended</option>
                  <option>Graduated</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. chinedu.okafor@student.edu"
                required
                className="mt-1 w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Enrolled Courses</label>
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

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                {editingId ? "Save Changes" : "Add Student"}
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
              <th className="px-4 py-3 text-left font-medium text-slate-600">Matric No.</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Courses</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No students found.
                </td>
              </tr>
            )}
            {filtered.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                <td className="px-4 py-3 text-slate-700">{student.matric}</td>
                <td className="px-4 py-3 text-slate-700">{student.email}</td>
                <td className="px-4 py-3 text-slate-700">
                  {student.courses.length > 0 ? student.courses.join(", ") : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      student.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : student.status === "Suspended"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEditForm(student)}
                    className="mr-3 text-sm font-medium text-slate-700 hover:text-slate-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
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
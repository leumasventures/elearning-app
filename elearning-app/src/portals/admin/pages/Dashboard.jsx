import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/api";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingStudent, setSavingStudent] = useState(false);
  const [savingCourse, setSavingCourse] = useState(false);

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    password: "",
    matric: "",
  });

  const [courseForm, setCourseForm] = useState({
    title: "",
    code: "",
    description: "",
  });

  // ── Load from database ───────────────────────────────────
  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [usersData, coursesData] = await Promise.all([
        apiRequest("/users"),
        apiRequest("/courses"),
      ]);
      setStudents((usersData || []).filter((u) => u.role === "student"));
      setCourses(coursesData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function flash(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  // ── Student registration ─────────────────────────────────
  async function handleRegisterStudent(e) {
    e.preventDefault();
    setSavingStudent(true);
    setError("");
    try {
      await apiRequest("/users", {
        method: "POST",
        body: {
          name: studentForm.name.trim(),
          email: studentForm.email.trim().toLowerCase(),
          password: studentForm.password,
          matric: studentForm.matric.trim() || null,
          role: "student",
        },
      });
      setStudentForm({ name: "", email: "", password: "", matric: "" });
      flash("Student registered successfully");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to register student"
      );
    } finally {
      setSavingStudent(false);
    }
  }

  async function handleDeleteStudent(id, name) {
    if (!confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    setError("");
    try {
      await apiRequest(`/users/${id}`, { method: "DELETE" });
      flash("Student deleted");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete student");
    }
  }

  // ── Course registration ──────────────────────────────────
  async function handleRegisterCourse(e) {
    e.preventDefault();
    setSavingCourse(true);
    setError("");
    try {
      await apiRequest("/courses", {
        method: "POST",
        body: {
          title: courseForm.title.trim(),
          code: courseForm.code.trim().toUpperCase(),
          description: courseForm.description.trim() || null,
        },
      });
      setCourseForm({ title: "", code: "", description: "" });
      flash("Course registered successfully");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to register course"
      );
    } finally {
      setSavingCourse(false);
    }
  }

  async function handleDeleteCourse(id, title) {
    if (!confirm(`Delete course "${title}"? This cannot be undone.`)) return;
    setError("");
    try {
      await apiRequest(`/courses/${id}`, { method: "DELETE" });
      flash("Course deleted");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
    }
  }

  // ── UI ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading from database…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              {user?.name} · {user?.email}
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        {/* Alerts */}
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

        {/* ═══════ REGISTRATION FORMS ═══════ */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Student registration form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-slate-800">
              Student registration
            </h2>
            <p className="mb-5 text-sm text-slate-500">
              Create a new student account. They can log in with the email and
              password you set.
            </p>

            <form onSubmit={handleRegisterStudent} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={studentForm.name}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, name: e.target.value })
                  }
                  placeholder="e.g. Chidinma Obi"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  value={studentForm.email}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, email: e.target.value })
                  }
                  placeholder="student@school.edu"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Matric number
                </label>
                <input
                  value={studentForm.matric}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, matric: e.target.value })
                  }
                  placeholder="e.g. CSC/2023/041"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={studentForm.password}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, password: e.target.value })
                  }
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={savingStudent}
                className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingStudent ? "Registering…" : "Register student"}
              </button>
            </form>
          </section>

          {/* Course registration form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-slate-800">
              Course registration
            </h2>
            <p className="mb-5 text-sm text-slate-500">
              Add a new course to the platform. Students can be enrolled later.
            </p>

            <form onSubmit={handleRegisterCourse} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Course title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                  placeholder="e.g. Introduction to Computer Science"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Course code <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={courseForm.code}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, code: e.target.value })
                  }
                  placeholder="e.g. CSC101"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the course (optional)"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={savingCourse}
                className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingCourse ? "Registering…" : "Register course"}
              </button>
            </form>
          </section>
        </div>

        {/* ═══════ LISTS ═══════ */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Students list */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Registered students ({students.length})
              </h2>
            </div>
            <div className="max-h-80 overflow-y-auto px-5 py-3">
              {students.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No students registered yet.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {students.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {s.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {s.email}
                          {s.matric ? ` · ${s.matric}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteStudent(s.id, s.name)}
                        className="ml-3 shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Courses list */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Registered courses ({courses.length})
              </h2>
            </div>
            <div className="max-h-80 overflow-y-auto px-5 py-3">
              {courses.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No courses registered yet.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {courses.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {c.code} — {c.title}
                        </p>
                        {c.description && (
                          <p className="truncate text-xs text-slate-500">
                            {c.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteCourse(c.id, c.title)}
                        className="ml-3 shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
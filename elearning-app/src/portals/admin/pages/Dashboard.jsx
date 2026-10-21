import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  createCourse,
  createUser,
  deleteCourse,
  deleteUser,
  getCourses,
  getUsers,
} from "../../../lib/api";

export default function AdminDashboard() {
  const { user } = useAuth();

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

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [usersData, coursesData] = await Promise.all([
        getUsers(),
        getCourses(),
      ]);
      setStudents(usersData.filter((u) => u.role === "student"));
      setCourses(coursesData);
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

  async function handleRegisterStudent(e) {
    e.preventDefault();
    setSavingStudent(true);
    setError("");
    try {
      await createUser({
        name: studentForm.name.trim(),
        email: studentForm.email.trim().toLowerCase(),
        password: studentForm.password,
        matric: studentForm.matric.trim() || null,
        role: "student",
      });
      setStudentForm({ name: "", email: "", password: "", matric: "" });
      flash("Student registered in database");
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
      await deleteUser(id);
      flash("Student deleted from database");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete student");
    }
  }

  async function handleRegisterCourse(e) {
    e.preventDefault();
    setSavingCourse(true);
    setError("");
    try {
      await createCourse({
        title: courseForm.title.trim(),
        code: courseForm.code.trim().toUpperCase(),
        description: courseForm.description.trim() || undefined,
      });
      setCourseForm({ title: "", code: "", description: "" });
      flash("Course registered in database");
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
      await deleteCourse(id);
      flash("Course deleted from database");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-500">Loading from database…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          {user?.name ? `Signed in as ${user.name}` : "Admin"} · all data from
          MySQL
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Students", value: students.length },
          { label: "Courses", value: courses.length },
          {
            label: "Active courses",
            value: courses.filter((c) => c.status !== "Draft").length,
          },
          {
            label: "Draft courses",
            value: courses.filter((c) => c.status === "Draft").length,
          },
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

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-slate-800">
            Register student
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            Creates a user row in MySQL via the API.
          </p>
          <form onSubmit={handleRegisterStudent} className="space-y-4">
            <input
              required
              value={studentForm.name}
              onChange={(e) =>
                setStudentForm({ ...studentForm, name: e.target.value })
              }
              placeholder="Full name *"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
            <input
              required
              type="email"
              value={studentForm.email}
              onChange={(e) =>
                setStudentForm({ ...studentForm, email: e.target.value })
              }
              placeholder="Email *"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
            <input
              value={studentForm.matric}
              onChange={(e) =>
                setStudentForm({ ...studentForm, matric: e.target.value })
              }
              placeholder="Matric number"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
            <input
              required
              type="password"
              minLength={8}
              value={studentForm.password}
              onChange={(e) =>
                setStudentForm({ ...studentForm, password: e.target.value })
              }
              placeholder="Password (min 8) *"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={savingStudent}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {savingStudent ? "Saving…" : "Register student"}
            </button>
          </form>
          <p className="mt-3 text-xs text-slate-500">
            Or use{" "}
            <Link
              to="/admin/register-student"
              className="font-medium text-indigo-600 hover:underline"
            >
              full registration page
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-slate-800">
            Register course
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            Creates a course row in MySQL via the API.
          </p>
          <form onSubmit={handleRegisterCourse} className="space-y-4">
            <input
              required
              value={courseForm.title}
              onChange={(e) =>
                setCourseForm({ ...courseForm, title: e.target.value })
              }
              placeholder="Course title *"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
            <input
              required
              value={courseForm.code}
              onChange={(e) =>
                setCourseForm({ ...courseForm, code: e.target.value })
              }
              placeholder="Course code * (e.g. CSC101)"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
            <textarea
              rows={3}
              value={courseForm.description}
              onChange={(e) =>
                setCourseForm({ ...courseForm, description: e.target.value })
              }
              placeholder="Description (optional)"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={savingCourse}
              className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {savingCourse ? "Saving…" : "Register course"}
            </button>
          </form>
          <p className="mt-3 text-xs text-slate-500">
            Or use{" "}
            <Link
              to="/admin/register-course"
              className="font-medium text-violet-600 hover:underline"
            >
              full registration page
            </Link>
            .
          </p>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Recent students
            </h2>
            <Link
              to="/admin/students"
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-slate-500">
                No students in the database.
              </li>
            ) : (
              students.slice(0, 8).map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-500">
                      {s.email}
                      {s.matric ? ` · ${s.matric}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteStudent(s.id, s.name)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Recent courses
            </h2>
            <Link
              to="/admin/courses"
              className="text-xs font-medium text-violet-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {courses.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-slate-500">
                No courses in the database.
              </li>
            ) : (
              courses.slice(0, 8).map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {c.code} — {c.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {c.status || "Active"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCourse(c.id, c.title)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

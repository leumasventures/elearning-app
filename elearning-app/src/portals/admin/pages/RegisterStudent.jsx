import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../../../lib/api";

export default function RegisterStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    matric: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await createUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        matric: form.matric.trim() || null,
        role: "student",
      });
      setSuccess("Student registered in the database.");
      setForm({ name: "", email: "", password: "", matric: "" });
      setTimeout(() => navigate("/admin/students"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Register student
          </h1>
          <p className="text-sm text-slate-500">
            Creates a user in MySQL. They sign in with this email and password.
          </p>
        </div>
        <Link
          to="/admin/students"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          ← Back to students
        </Link>
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

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.name}
            onChange={update("name")}
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
            value={form.email}
            onChange={update("email")}
            placeholder="student@school.edu"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Matric number
          </label>
          <input
            value={form.matric}
            onChange={update("matric")}
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
            value={form.password}
            onChange={update("password")}
            placeholder="Minimum 8 characters"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "Registering…" : "Register student"}
        </button>
      </form>
    </div>
  );
}

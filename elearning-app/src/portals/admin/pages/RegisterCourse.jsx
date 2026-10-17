import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";

export default function RegisterCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    code: "",
    description: "",
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
      await apiRequest("/courses", {
        method: "POST",
        body: {
          title: form.title.trim(),
          code: form.code.trim().toUpperCase(),
          description: form.description.trim() || null,
        },
      });
      setSuccess("Course registered successfully.");
      setForm({ title: "", code: "", description: "" });
      setTimeout(() => navigate("/admin/dashboard"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold text-slate-900">
            Register course
          </h1>
          <Link
            to="/admin/dashboard"
            className="text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-6 text-sm text-slate-500">
            Add a new course. Students can be enrolled after it is created.
          </p>

          {error && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Course title <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.title}
                onChange={update("title")}
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
                value={form.code}
                onChange={update("code")}
                placeholder="e.g. CSC101"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={update("description")}
                placeholder="Brief description (optional)"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {saving ? "Registering…" : "Register course"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
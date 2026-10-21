import { useEffect, useState } from "react";
import { createUser, deleteUser, getUsers } from "../../../lib/api";

function Initials({ name }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white shadow-sm">
      {initials}
    </div>
  );
}

export default function Lecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const users = await getUsers();
      setLecturers(users.filter((u) => u.role === "lecturer"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lecturers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = lecturers.filter((l) => {
    const q = search.toLowerCase();
    return (
      (l.name || "").toLowerCase().includes(q) ||
      (l.email || "").toLowerCase().includes(q)
    );
  });

  async function handleDelete(id, name) {
    if (!confirm(`Delete lecturer "${name}" from the database?`)) return;
    try {
      await deleteUser(id);
      setSuccess("Lecturer deleted");
      setTimeout(() => setSuccess(""), 2500);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 8) {
      setError("Name, email, and password (min 8 chars) are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: "lecturer",
      });
      setSuccess("Lecturer registered in database");
      setTimeout(() => setSuccess(""), 2500);
      setModalOpen(false);
      setForm({ name: "", email: "", password: "" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-500">
          Loading lecturers from database…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Lecturers</h1>
          <p className="text-sm text-slate-500">
            Users with role lecturer — stored in MySQL.
          </p>
        </div>
        <button
          onClick={() => {
            setModalOpen(true);
            setError("");
          }}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Add lecturer
        </button>
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

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name or email…"
        className="w-full max-w-sm rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Lecturer</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-slate-500">
                  No lecturers in the database.
                </td>
              </tr>
            ) : (
              filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Initials name={l.name} />
                      <span className="font-medium text-slate-800">{l.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{l.email}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(l.id, l.name)}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Register lecturer
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                required
              />
              <input
                type="password"
                placeholder="Password (min 8)"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                required
                minLength={8}
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

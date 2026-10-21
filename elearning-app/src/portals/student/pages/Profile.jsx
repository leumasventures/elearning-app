import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { meApi, updateUser } from "../../../lib/api";

function Initials({ name }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-semibold text-white shadow-lg shadow-indigo-200/50 ring-4 ring-white">
      {initials}
    </div>
  );
}

export default function Profile() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", matric: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const me = await meApi();
        if (!cancelled) {
          setProfile(me);
          setForm({
            name: me.name || "",
            email: me.email || "",
            matric: me.matric || "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          // Fall back to auth context if /me fails
          if (authUser) {
            setProfile(authUser);
            setForm({
              name: authUser.name || "",
              email: authUser.email || "",
              matric: authUser.matric || "",
            });
          } else {
            setError(
              err instanceof Error ? err.message : "Failed to load profile"
            );
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [authUser]);

  async function handleSave(e) {
    e.preventDefault();
    if (!profile?.id) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const updated = await updateUser(profile.id, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        matric: form.matric.trim() || null,
      });
      setProfile(updated);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-500">Loading profile from database…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || "Could not load profile."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="relative flex flex-wrap items-center gap-5">
          <Initials name={profile.name} />
          <div>
            <p className="text-sm font-medium text-indigo-100">Student profile</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm text-indigo-100/90">
              {profile.email}
              {profile.matric ? ` · ${profile.matric}` : ""}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Profile saved to database.
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Account details</h2>
          {!editing && (
            <button
              onClick={() => {
                setForm({
                  name: profile.name || "",
                  email: profile.email || "",
                  matric: profile.matric || "",
                });
                setEditing(true);
                setSaved(false);
              }}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Matric</label>
              <input
                value={form.matric}
                onChange={(e) =>
                  setForm((f) => ({ ...f, matric: e.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save to database"}
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Name</dt>
              <dd className="font-medium text-slate-800">{profile.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Email</dt>
              <dd className="font-medium text-slate-800">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Matric</dt>
              <dd className="font-medium text-slate-800">
                {profile.matric || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Role</dt>
              <dd className="font-medium capitalize text-slate-800">
                {profile.role}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Profile fields are read from and written to the users table. Password
        changes require a dedicated backend endpoint and are not stored in the
        browser.
      </p>
    </div>
  );
}

import { useState } from "react";

const initialProfile = {
  name: "Chinedu Okafor",
  matric: "CSC/2023/041",
  email: "chinedu.okafor@student.edu",
  phone: "+234 801 234 5678",
  department: "Computer Science",
  level: "300 Level",
};

function Initials({ name }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-xl font-semibold text-white">
      {initials}
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [form, setForm] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  function startEditing() {
    setForm(profile);
    setEditing(true);
    setSaved(false);
  }

  function handleSave(e) {
    e.preventDefault();
    setProfile(form);
    setEditing(false);
    setSaved(true);
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);

    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setPasswordError("Please fill in all password fields.");
      return;
    }
    if (passwordForm.next.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setPasswordForm({ current: "", next: "", confirm: "" });
    setPasswordSaved(true);
  }

  return (
    <div>
      <h1 className="text-lg font-medium text-slate-900">Profile</h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage your personal information and account security.
      </p>

      <div className="mt-6 rounded-lg border border-slate-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Initials name={profile.name} />
          <div>
            <p className="text-base font-medium text-slate-900">
              {profile.name}
            </p>
            <p className="text-sm text-slate-500">{profile.matric}</p>
            <p className="text-sm text-slate-500">
              {profile.department} · {profile.level}
            </p>
          </div>
          {!editing && (
            <button
              onClick={startEditing}
              className="ml-auto rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Edit Profile
            </button>
          )}
        </div>

        {saved && !editing && (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Profile updated successfully.
          </p>
        )}

        {editing ? (
          <form onSubmit={handleSave} className="mt-6 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-600">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Matric No.</label>
                <input
                  type="text"
                  value={form.matric}
                  disabled
                  className="mt-1 w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Department</label>
                <input
                  type="text"
                  value={form.department}
                  disabled
                  className="mt-1 w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Level</label>
                <input
                  type="text"
                  value={form.level}
                  disabled
                  className="mt-1 w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-slate-500">Email</dt>
              <dd className="mt-0.5 text-slate-900">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Phone</dt>
              <dd className="mt-0.5 text-slate-900">{profile.phone}</dd>
            </div>
          </dl>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 p-6">
        <h2 className="text-sm font-medium text-slate-900">Change Password</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose a strong password you haven't used elsewhere.
        </p>

        {passwordError && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {passwordError}
          </p>
        )}
        {passwordSaved && (
          <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Password updated successfully.
          </p>
        )}

        <form
          onSubmit={handlePasswordSubmit}
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <div>
            <label className="text-xs font-medium text-slate-600">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.current}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.next}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, next: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirm}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirm: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
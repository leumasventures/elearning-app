import { useState } from "react";

const initialAssignments = [];

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const statusStyles = {
  Graded: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
  Submitted: "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80",
  Pending: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80",
};

function isOverdue(dueDate, status) {
  return status === "Pending" && new Date(dueDate) < new Date();
}

export default function Assignments() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [filter, setFilter] = useState("All");
  const [submittingId, setSubmittingId] = useState(null);
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);

  const filtered = assignments.filter((a) => {
    if (filter === "All") return true;
    return a.status === filter;
  });

  const pendingCount = assignments.filter((a) => a.status === "Pending").length;
  const submittedCount = assignments.filter((a) => a.status === "Submitted").length;
  const gradedCount = assignments.filter((a) => a.status === "Graded").length;
  const overdueCount = assignments.filter((a) =>
    isOverdue(a.dueDate, a.status)
  ).length;

  function openSubmit(id) {
    setSubmittingId(id);
    setNote("");
    setFile(null);
  }

  function handleSubmit(e, id) {
    e.preventDefault();
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "Submitted", submittedAt: new Date().toISOString() }
          : a
      )
    );
    setSubmittingId(null);
    setNote("");
    setFile(null);
  }

  const stats = [
    {
      label: "Total",
      value: assignments.length,
      gradient: "from-indigo-500 to-violet-600",
      soft: "bg-indigo-50 border-indigo-100 text-indigo-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Pending",
      value: pendingCount,
      gradient: "from-slate-500 to-slate-700",
      soft: "bg-slate-50 border-slate-200 text-slate-800",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Submitted",
      value: submittedCount,
      gradient: "from-amber-500 to-orange-500",
      soft: "bg-amber-50 border-amber-100 text-amber-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      label: "Graded",
      value: gradedCount,
      gradient: "from-emerald-500 to-teal-600",
      soft: "bg-emerald-50 border-emerald-100 text-emerald-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Overdue",
      value: overdueCount,
      gradient: "from-red-500 to-rose-600",
      soft: "bg-red-50 border-red-100 text-red-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ];

  const filters = ["All", "Pending", "Submitted", "Graded"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-indigo-100">Student portal</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Assignments</h1>
          <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
            View, submit, and track your assignments across courses.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-xl border p-4 shadow-sm ${stat.soft}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium opacity-80">{stat.label}</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className={`rounded-lg bg-gradient-to-br ${stat.gradient} p-2 text-white shadow-md`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === f
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/40"
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {f}
          </button>
        ))}
        <p className="ml-auto text-xs font-medium text-slate-500">
          Showing <span className="text-slate-800">{filtered.length}</span> of {assignments.length}
        </p>
      </div>

      {/* Assignment cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-12 text-center shadow-sm">
            <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-600">No assignments found</p>
              <p className="text-xs text-slate-400">Try a different filter.</p>
            </div>
          </div>
        )}

        {filtered.map((a) => {
          const overdue = isOverdue(a.dueDate, a.status);
          const percent =
            a.status === "Graded" && a.maxScore
              ? Math.round((a.score / a.maxScore) * 100)
              : null;

          return (
            <div
              key={a.id}
              className={`overflow-hidden rounded-xl border bg-white shadow-sm transition ${
                overdue
                  ? "border-red-200 ring-1 ring-red-100"
                  : "border-slate-200/80 hover:border-indigo-200 hover:shadow-md"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                      {a.course}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[a.status]}`}
                    >
                      {a.status}
                    </span>
                    {overdue && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-red-200/80">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Overdue
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-900">{a.title}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due {formatDate(a.dueDate)}
                    </span>
                    {a.submittedAt && (
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Submitted {formatDate(a.submittedAt)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      Max {a.maxScore} pts
                    </span>
                  </div>

                  {a.status === "Graded" && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900">
                        {a.score}/{a.maxScore}
                      </span>
                      <span className="text-xs text-slate-500">({percent}%)</span>
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            percent >= 70
                              ? "bg-emerald-500"
                              : percent >= 45
                              ? "bg-amber-500"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {a.status === "Pending" && (
                  <button
                    onClick={() => openSubmit(a.id)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-violet-700"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Submit
                  </button>
                )}
              </div>

              {/* Inline submit form */}
              {submittingId === a.id && (
                <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-4">
                  <form onSubmit={(e) => handleSubmit(e, a.id)} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600">
                        Attach File
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-700"
                      />
                      {file && (
                        <p className="mt-1 text-xs text-indigo-600">
                          Selected: {file.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">
                        Notes (optional)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={2}
                        placeholder="Any comments for your lecturer..."
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="submit"
                        className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-violet-700"
                      >
                        Confirm Submission
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubmittingId(null)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
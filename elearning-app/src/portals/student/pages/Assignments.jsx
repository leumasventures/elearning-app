import { useState } from "react";

const initialAssignments = [
  {
    id: 1,
    title: "Loops and Conditionals Exercise",
    course: "CSC101",
    dueDate: "2026-09-20T23:59",
    status: "Pending",
    score: null,
    maxScore: 20,
    submittedAt: null,
  },
  {
    id: 2,
    title: "Limits and Continuity Problem Set",
    course: "MTH201",
    dueDate: "2026-09-16T23:59",
    status: "Submitted",
    score: null,
    maxScore: 15,
    submittedAt: "2026-09-14T18:32",
  },
  {
    id: 3,
    title: "Business Memo Draft",
    course: "ENG150",
    dueDate: "2026-09-05T23:59",
    status: "Graded",
    score: 18,
    maxScore: 20,
    submittedAt: "2026-09-04T14:10",
  },
];

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusColor(status) {
  if (status === "Graded") return "bg-green-100 text-green-700";
  if (status === "Submitted") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

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

  return (
    <div>
      <div>
        <h1 className="text-lg font-medium text-slate-900">Assignments</h1>
        <p className="mt-1 text-sm text-slate-500">
          View, submit, and track your assignments across courses.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["All", "Pending", "Submitted", "Graded"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              filter === f
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <p className="rounded-lg border border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
            No assignments found.
          </p>
        )}
        {filtered.map((a) => {
          const overdue = isOverdue(a.dueDate, a.status);
          return (
            <div
              key={a.id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                      {a.course}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${statusColor(
                        a.status
                      )}`}
                    >
                      {a.status}
                    </span>
                    {overdue && (
                      <span className="font-medium text-red-600">Overdue</span>
                    )}
                  </div>
                  <p className="mt-1 font-medium text-slate-900">{a.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Due {formatDate(a.dueDate)}
                    {a.submittedAt && (
                      <> · Submitted {formatDate(a.submittedAt)}</>
                    )}
                  </p>
                  {a.status === "Graded" && (
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      Score: {a.score}/{a.maxScore}
                    </p>
                  )}
                </div>

                {a.status === "Pending" && (
                  <button
                    onClick={() => openSubmit(a.id)}
                    className="shrink-0 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                  >
                    Submit
                  </button>
                )}
              </div>

              {submittingId === a.id && (
                <form
                  onSubmit={(e) => handleSubmit(e, a.id)}
                  className="mt-4 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3"
                >
                  <div>
                    <label className="text-xs font-medium text-slate-600">
                      Attach File
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">
                      Notes (optional)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      placeholder="Any comments for your lecturer..."
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                      Confirm Submission
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmittingId(null)}
                      className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
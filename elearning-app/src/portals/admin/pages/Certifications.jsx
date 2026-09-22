import { useState } from "react";
import { certificationOptions } from "./Courses";

const initialCertificates = [
  {
    id: 1,
    student: "Chinedu Okafor",
    matric: "CSC/2023/041",
    course: "CSC101",
    type: "Certificate of Completion",
    completionDate: "2026-08-30",
    certificateId: "LIN-CERT-2026-0001",
    status: "Issued",
    issueDate: "2026-09-02",
  },
  {
    id: 2,
    student: "Bassey Etim",
    matric: "LIN/2026/0142",
    course: "CYBSEC-P",
    type: "Professional Certification",
    completionDate: "2026-09-10",
    certificateId: null,
    status: "Pending",
    issueDate: null,
  },
  {
    id: 3,
    student: "Halima Sule",
    matric: "LIN/2026/0141",
    course: "DATA-B",
    type: "Certificate of Proficiency",
    completionDate: "2026-09-08",
    certificateId: "LIN-CERT-2026-0002",
    status: "Issued",
    issueDate: "2026-09-09",
  },
  {
    id: 4,
    student: "Tunde Bakare",
    matric: "MTH/2023/009",
    course: "MTH201",
    type: "Certificate of Completion",
    completionDate: "2026-07-20",
    certificateId: "LIN-CERT-2026-0003",
    status: "Revoked",
    issueDate: "2026-07-25",
  },
];

const emptyForm = {
  student: "",
  matric: "",
  course: "",
  type: certificationOptions[0],
  completionDate: "",
};

const statusStyles = {
  Issued: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
  Pending: "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80",
  Revoked: "bg-red-100 text-red-800 ring-1 ring-red-200/80",
};

const typeStyles = {
  "Certificate of Completion": "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
  "Certificate of Proficiency": "bg-violet-50 text-violet-700 ring-1 ring-violet-100",
  Diploma: "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
  "Professional Certification": "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
  None: "bg-slate-50 text-slate-600 ring-1 ring-slate-100",
};

function nextCertificateId(certificates) {
  const year = new Date().getFullYear();
  const count = certificates.filter((c) => c.certificateId).length + 1;
  return `LIN-CERT-${year}-${String(count).padStart(4, "0")}`;
}

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

export default function Certifications() {
  const [certificates, setCertificates] = useState(initialCertificates);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filtered = certificates.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.student.toLowerCase().includes(q) ||
      c.matric.toLowerCase().includes(q) ||
      (c.certificateId || "").toLowerCase().includes(q) ||
      c.course.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function openAddModal() {
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(emptyForm);
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !form.student.trim() ||
      !form.matric.trim() ||
      !form.course.trim() ||
      !form.completionDate
    ) {
      setError("Please fill in student, matric no., course, and completion date.");
      return;
    }
    const newCert = {
      id: Date.now(),
      ...form,
      status: "Pending",
      certificateId: null,
      issueDate: null,
    };
    setCertificates((prev) => [newCert, ...prev]);
    closeModal();
  }

  function handleIssue(id) {
    setCertificates((prev) => {
      const certificateId = nextCertificateId(prev);
      return prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "Issued",
              certificateId,
              issueDate: new Date().toISOString().slice(0, 10),
            }
          : c
      );
    });
  }

  function handleRevoke(id) {
    if (confirm("Revoke this certificate?")) {
      setCertificates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Revoked" } : c))
      );
    }
  }

  function handleDownload(c) {
    alert(
      `Certificate ${c.certificateId}\n${c.student} (${c.matric})\n${c.type} — ${c.course}\nIssued: ${c.issueDate}\n\nThis will download as a PDF once connected to a certificate template.`
    );
  }

  const issuedCount = certificates.filter((c) => c.status === "Issued").length;
  const pendingCount = certificates.filter((c) => c.status === "Pending").length;
  const revokedCount = certificates.filter((c) => c.status === "Revoked").length;

  const stats = [
    {
      label: "Issued",
      value: issuedCount,
      gradient: "from-emerald-500 to-teal-600",
      soft: "bg-emerald-50 border-emerald-100 text-emerald-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      label: "Pending Issuance",
      value: pendingCount,
      gradient: "from-amber-500 to-orange-500",
      soft: "bg-amber-50 border-amber-100 text-amber-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Revoked",
      value: revokedCount,
      gradient: "from-red-500 to-rose-600",
      soft: "bg-red-50 border-red-100 text-red-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
    },
    {
      label: "Total Records",
      value: certificates.length,
      gradient: "from-indigo-500 to-violet-600",
      soft: "bg-indigo-50 border-indigo-100 text-indigo-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-100">Admin portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Certifications</h1>
            <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
              Track course completions and issue certificates, diplomas, or professional certifications.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Completion Record
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative min-w-[200px] flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, matric, course, or certificate ID..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">All statuses</option>
          <option>Issued</option>
          <option>Pending</option>
          <option>Revoked</option>
        </select>
        <p className="ml-auto text-xs font-medium text-slate-500">
          Showing <span className="text-slate-800">{filtered.length}</span> of {certificates.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80">
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Student
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Course
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Completion
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Certificate ID
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No certification records found</p>
                      <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-indigo-50/40">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Initials name={c.student} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">{c.student}</p>
                        <p className="truncate text-xs text-slate-500">{c.matric}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      {c.course}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex max-w-[160px] truncate rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        typeStyles[c.type] || typeStyles.None
                      }`}
                    >
                      {c.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{c.completionDate}</td>
                  <td className="px-4 py-3.5">
                    {c.certificateId ? (
                      <span className="font-mono text-xs font-semibold text-indigo-700">
                        {c.certificateId}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[c.status]}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      {c.status === "Pending" && (
                        <button
                          onClick={() => handleIssue(c.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Issue
                        </button>
                      )}
                      {c.status === "Issued" && (
                        <>
                          <button
                            onClick={() => handleDownload(c)}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </button>
                          <button
                            onClick={() => handleRevoke(c.id)}
                            className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-100"
                          >
                            Revoke
                          </button>
                        </>
                      )}
                      {c.status === "Revoked" && (
                        <span className="text-xs text-slate-400">No actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-white">
              <h2 className="text-lg font-semibold">Add Completion Record</h2>
              <p className="mt-0.5 text-sm text-indigo-100">
                Record a student completion to queue for certificate issuance
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Student Name</label>
                  <input
                    type="text"
                    value={form.student}
                    onChange={(e) => setForm({ ...form, student: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. Chinedu Okafor"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Matric / Admission No.
                  </label>
                  <input
                    type="text"
                    value={form.matric}
                    onChange={(e) => setForm({ ...form, matric: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. CSC/2023/041"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">Course</label>
                <input
                  type="text"
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  placeholder="e.g. WEBDEV-D"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Certification Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {certificationOptions.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={form.completionDate}
                    onChange={(e) => setForm({ ...form, completionDate: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
            </form>

            <div className="flex shrink-0 justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-violet-700"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
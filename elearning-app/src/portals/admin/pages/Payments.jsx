import { useState } from "react";

const feeTypes = ["Registration", "Tuition", "Certification Fee", "Exam Fee"];
const methods = ["Bank Transfer", "Card", "Cash", "POS"];

const initialPayments = [
  {
    id: 1,
    student: "Chinedu Okafor",
    matric: "CSC/2023/041",
    course: "CSC101",
    feeType: "Tuition",
    amountDue: 45000,
    amountPaid: 45000,
    method: "Bank Transfer",
    date: "2026-09-15",
    receiptNo: "RCT-1001",
  },
  {
    id: 2,
    student: "Amaka Eze",
    matric: "CSC/2023/017",
    course: "CSC101",
    feeType: "Registration",
    amountDue: 20000,
    amountPaid: 10000,
    method: "Card",
    date: "2026-09-14",
    receiptNo: "RCT-1002",
  },
  {
    id: 3,
    student: "Tunde Bakare",
    matric: "MTH/2023/009",
    course: "MTH201",
    feeType: "Certification Fee",
    amountDue: 15000,
    amountPaid: 15000,
    method: "Cash",
    date: "2026-09-13",
    receiptNo: "RCT-1003",
  },
  {
    id: 4,
    student: "Fatima Bello",
    matric: "ENG/2023/003",
    course: "ENG150",
    feeType: "Tuition",
    amountDue: 60000,
    amountPaid: 0,
    method: "Bank Transfer",
    date: "2026-09-10",
    receiptNo: "RCT-1004",
  },
  {
    id: 5,
    student: "Bassey Etim",
    matric: "LIN/2026/0142",
    course: "CYBSEC-P",
    feeType: "Tuition",
    amountDue: 85000,
    amountPaid: 85000,
    method: "Bank Transfer",
    date: "2026-09-05",
    receiptNo: "RCT-1005",
  },
];

const emptyForm = {
  student: "",
  matric: "",
  course: "",
  feeType: feeTypes[0],
  amountDue: "",
  amountPaid: "",
  method: methods[0],
};

function paymentStatus(p) {
  if (p.amountPaid <= 0) return "Pending";
  if (p.amountPaid < p.amountDue) return "Partial";
  return "Paid";
}

const statusStyles = {
  Paid: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
  Partial: "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80",
  Pending: "bg-red-100 text-red-800 ring-1 ring-red-200/80",
};

const methodStyles = {
  "Bank Transfer": "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
  Card: "bg-violet-50 text-violet-700 ring-1 ring-violet-100",
  Cash: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  POS: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
};

function formatNaira(n) {
  return `₦${Number(n).toLocaleString()}`;
}

function nextReceiptNo(payments) {
  return `RCT-${1000 + payments.length + 1}`;
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

export default function Payments() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.student.toLowerCase().includes(q) ||
      p.matric.toLowerCase().includes(q) ||
      p.receiptNo.toLowerCase().includes(q) ||
      p.course.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || paymentStatus(p) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalOutstanding = payments.reduce(
    (sum, p) => sum + (p.amountDue - p.amountPaid),
    0
  );
  const paidCount = payments.filter((p) => paymentStatus(p) === "Paid").length;
  const pendingCount = payments.filter((p) => paymentStatus(p) === "Pending").length;

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
      !form.amountDue
    ) {
      setError("Please fill in student, matric no., course, and amount due.");
      return;
    }
    const newPayment = {
      id: Date.now(),
      ...form,
      amountDue: Number(form.amountDue) || 0,
      amountPaid: Number(form.amountPaid) || 0,
      date: new Date().toISOString().slice(0, 10),
      receiptNo: nextReceiptNo(payments),
    };
    setPayments((prev) => [newPayment, ...prev]);
    closeModal();
  }

  function handleMarkPaid(id) {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, amountPaid: p.amountDue } : p))
    );
  }

  function handlePrintReceipt(p) {
    alert(
      `Receipt ${p.receiptNo}\n${p.student} (${p.matric})\n${p.feeType} — ${p.course}\nPaid: ${formatNaira(p.amountPaid)} of ${formatNaira(p.amountDue)}\n\nThis will render as a printable PDF once connected to real data.`
    );
  }

  const stats = [
    {
      label: "Total Collected",
      value: formatNaira(totalCollected),
      gradient: "from-emerald-500 to-teal-600",
      soft: "bg-emerald-50 border-emerald-100 text-emerald-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Outstanding",
      value: formatNaira(totalOutstanding),
      gradient: "from-red-500 to-rose-600",
      soft: "bg-red-50 border-red-100 text-red-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      label: "Fully Paid",
      value: paidCount,
      gradient: "from-sky-500 to-cyan-600",
      soft: "bg-sky-50 border-sky-100 text-sky-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Pending",
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
      label: "Records",
      value: payments.length,
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
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Payments</h1>
            <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
              Track fee payments, outstanding balances, and receipts.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Record Payment
          </button>
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
              <div className="min-w-0">
                <p className="text-xs font-medium opacity-80">{stat.label}</p>
                <p className="mt-1.5 truncate text-xl font-bold tracking-tight sm:text-2xl">
                  {stat.value}
                </p>
              </div>
              <div className={`shrink-0 rounded-lg bg-gradient-to-br ${stat.gradient} p-2 text-white shadow-md`}>
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
            placeholder="Search student, matric, course, or receipt..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">All statuses</option>
          <option>Paid</option>
          <option>Partial</option>
          <option>Pending</option>
        </select>
        <p className="ml-auto text-xs font-medium text-slate-500">
          Showing <span className="text-slate-800">{filtered.length}</span> of {payments.length}
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
                  Fee Type
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount Due
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount Paid
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Method
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
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No payments found</p>
                      <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((p) => {
                const status = paymentStatus(p);
                const progress =
                  p.amountDue > 0
                    ? Math.min(100, Math.round((p.amountPaid / p.amountDue) * 100))
                    : 0;
                return (
                  <tr key={p.id} className="transition-colors hover:bg-indigo-50/40">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Initials name={p.student} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">{p.student}</p>
                          <p className="truncate text-xs text-slate-500">
                            {p.matric} ·{" "}
                            <span className="font-mono text-indigo-600">{p.receiptNo}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                        {p.course}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{p.feeType}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {formatNaira(p.amountDue)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p
                          className={`font-medium ${
                            status === "Paid"
                              ? "text-emerald-700"
                              : status === "Partial"
                              ? "text-amber-700"
                              : "text-red-600"
                          }`}
                        >
                          {formatNaira(p.amountPaid)}
                        </p>
                        <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              status === "Paid"
                                ? "bg-emerald-500"
                                : status === "Partial"
                                ? "bg-amber-500"
                                : "bg-red-400"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          methodStyles[p.method] || "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {p.method}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        {status !== "Paid" && (
                          <button
                            onClick={() => handleMarkPaid(p.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => handlePrintReceipt(p)}
                          className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                          Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-white">
              <h2 className="text-lg font-semibold">Record Payment</h2>
              <p className="mt-0.5 text-sm text-indigo-100">
                Log a fee payment and generate a receipt number
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
                  <label className="block text-xs font-medium text-slate-600">Fee Type</label>
                  <select
                    value={form.feeType}
                    onChange={(e) => setForm({ ...form, feeType: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {feeTypes.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Method</label>
                  <select
                    value={form.method}
                    onChange={(e) => setForm({ ...form, method: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {methods.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Amount Due (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.amountDue}
                    onChange={(e) => setForm({ ...form, amountDue: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Amount Paid (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.amountPaid}
                    onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="0"
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
                Save Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
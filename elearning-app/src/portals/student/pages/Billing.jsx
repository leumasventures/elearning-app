import { useState } from "react";

const invoices = [
  {
    id: 1,
    feeType: "Registration",
    course: "CSC101",
    amountDue: 20000,
    amountPaid: 20000,
    date: "2026-08-15",
    receiptNo: "RCT-0991",
  },
  {
    id: 2,
    feeType: "Tuition",
    course: "CSC101",
    amountDue: 45000,
    amountPaid: 30000,
    date: "2026-09-05",
    receiptNo: "RCT-1023",
  },
  {
    id: 3,
    feeType: "Certification Fee",
    course: "CSC101",
    amountDue: 15000,
    amountPaid: 0,
    date: null,
    receiptNo: null,
  },
];

function formatNaira(n) {
  return `₦${Number(n).toLocaleString()}`;
}

function invoiceStatus(inv) {
  if (inv.amountPaid <= 0) return "Pending";
  if (inv.amountPaid < inv.amountDue) return "Partial";
  return "Paid";
}

const statusStyles = {
  Paid: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
  Partial: "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80",
  Pending: "bg-red-100 text-red-800 ring-1 ring-red-200/80",
};

export default function Billing() {
  const [items] = useState(invoices);
  const [statusFilter, setStatusFilter] = useState("All");

  const totalDue = items.reduce((sum, i) => sum + i.amountDue, 0);
  const totalPaid = items.reduce((sum, i) => sum + i.amountPaid, 0);
  const balance = totalDue - totalPaid;
  const paidCount = items.filter((i) => invoiceStatus(i) === "Paid").length;
  const pendingCount = items.filter((i) => invoiceStatus(i) === "Pending").length;

  const filtered = items.filter((inv) => {
    if (statusFilter === "All") return true;
    return invoiceStatus(inv) === statusFilter;
  });

  function handlePay(inv) {
    alert(
      `This will hand off to your institution's payment gateway to pay the ${formatNaira(
        inv.amountDue - inv.amountPaid
      )} balance for ${inv.feeType} once connected.`
    );
  }

  const stats = [
    {
      label: "Total Fees",
      value: formatNaira(totalDue),
      gradient: "from-indigo-500 to-violet-600",
      soft: "bg-indigo-50 border-indigo-100 text-indigo-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Total Paid",
      value: formatNaira(totalPaid),
      gradient: "from-emerald-500 to-teal-600",
      soft: "bg-emerald-50 border-emerald-100 text-emerald-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Outstanding",
      value: formatNaira(balance),
      gradient: balance > 0 ? "from-red-500 to-rose-600" : "from-emerald-500 to-teal-600",
      soft:
        balance > 0
          ? "bg-red-50 border-red-100 text-red-900"
          : "bg-emerald-50 border-emerald-100 text-emerald-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Paid Invoices",
      value: paidCount,
      gradient: "from-sky-500 to-cyan-600",
      soft: "bg-sky-50 border-sky-100 text-sky-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-100">Student portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Billing</h1>
            <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
              Your fee balance, invoices, and payment history.
            </p>
          </div>
          {balance > 0 && (
            <div className="rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur">
              <p className="text-xs font-medium text-indigo-100">Outstanding</p>
              <p className="text-lg font-bold text-white">{formatNaira(balance)}</p>
            </div>
          )}
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
              <div
                className={`shrink-0 rounded-lg bg-gradient-to-br ${stat.gradient} p-2 text-white shadow-md`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">Payment progress</p>
            <p className="text-xs text-slate-500">
              {formatNaira(totalPaid)} of {formatNaira(totalDue)} paid
            </p>
          </div>
          <span className="text-sm font-bold text-slate-800">
            {totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0}%
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${
              balance <= 0
                ? "bg-emerald-500"
                : totalPaid / totalDue >= 0.5
                ? "bg-amber-500"
                : "bg-red-400"
            }`}
            style={{
              width: `${totalDue > 0 ? Math.min(100, (totalPaid / totalDue) * 100) : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        {["All", "Paid", "Partial", "Pending"].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              statusFilter === f
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/40"
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {f}
          </button>
        ))}
        <p className="ml-auto text-xs font-medium text-slate-500">
          Showing <span className="text-slate-800">{filtered.length}</span> of {items.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80">
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Fee Type
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Course
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount Due
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount Paid
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No invoices found</p>
                      <p className="text-xs text-slate-400">Try a different status filter.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((inv) => {
                const status = invoiceStatus(inv);
                const remaining = inv.amountDue - inv.amountPaid;
                const progress =
                  inv.amountDue > 0
                    ? Math.min(100, Math.round((inv.amountPaid / inv.amountDue) * 100))
                    : 0;
                return (
                  <tr key={inv.id} className="transition-colors hover:bg-indigo-50/40">
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-900">{inv.feeType}</p>
                      {inv.date && (
                        <p className="mt-0.5 text-xs text-slate-400">{inv.date}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                        {inv.course}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {formatNaira(inv.amountDue)}
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
                          {formatNaira(inv.amountPaid)}
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
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {status !== "Paid" ? (
                        <button
                          onClick={() => handlePay(inv)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pay {formatNaira(remaining)}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-indigo-600">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {inv.receiptNo}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
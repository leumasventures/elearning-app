import { useState } from "react";

const invoices = [
  { id: 1, feeType: "Registration", course: "CSC101", amountDue: 20000, amountPaid: 20000, date: "2026-08-15", receiptNo: "RCT-0991" },
  { id: 2, feeType: "Tuition", course: "CSC101", amountDue: 45000, amountPaid: 30000, date: "2026-09-05", receiptNo: "RCT-1023" },
  { id: 3, feeType: "Certification Fee", course: "CSC101", amountDue: 15000, amountPaid: 0, date: null, receiptNo: null },
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
  Paid: "bg-green-100 text-green-700",
  Partial: "bg-amber-100 text-amber-700",
  Pending: "bg-red-100 text-red-700",
};

export default function Billing() {
  const [items] = useState(invoices);

  const totalDue = items.reduce((sum, i) => sum + i.amountDue, 0);
  const totalPaid = items.reduce((sum, i) => sum + i.amountPaid, 0);
  const balance = totalDue - totalPaid;

  function handlePay(inv) {
    alert(
      `This will hand off to your institution's payment gateway to pay the ${formatNaira(
        inv.amountDue - inv.amountPaid
      )} balance for ${inv.feeType} once connected.`
    );
  }

  return (
    <div>
      <h1 className="text-lg font-medium text-slate-900">Billing</h1>
      <p className="mt-1 text-sm text-slate-500">
        Your fee balance, invoices, and payment history.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Total Fees</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{formatNaira(totalDue)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Total Paid</p>
          <p className="mt-1 text-xl font-semibold text-green-700">{formatNaira(totalPaid)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Outstanding Balance</p>
          <p className={`mt-1 text-xl font-semibold ${balance > 0 ? "text-red-600" : "text-green-700"}`}>
            {formatNaira(balance)}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Fee Type</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Course</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Amount Due</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Amount Paid</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((inv) => {
              const status = invoiceStatus(inv);
              return (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{inv.feeType}</td>
                  <td className="px-4 py-3 text-slate-700">{inv.course}</td>
                  <td className="px-4 py-3 text-slate-700">{formatNaira(inv.amountDue)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatNaira(inv.amountPaid)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {status !== "Paid" ? (
                      <button
                        onClick={() => handlePay(inv)}
                        className="text-sm font-medium text-slate-900 hover:underline"
                      >
                        Pay Balance
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">{inv.receiptNo}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

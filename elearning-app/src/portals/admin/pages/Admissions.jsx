import { useState } from "react";

const courseCatalog = [
  { code: "CSC101", title: "Introduction to Computer Science", duration: "12 Weeks", certification: "Certificate of Completion" },
  { code: "WEBDEV-D", title: "Diploma in Web Development", duration: "6 Months", certification: "Diploma" },
  { code: "CYBSEC-P", title: "Cybersecurity Fundamentals", duration: "3 Months", certification: "Professional Certification" },
  { code: "DATA-B", title: "Data Analysis Bootcamp", duration: "6 Weeks", certification: "Certificate of Proficiency" },
];

const externalExamCatalog = [
  { code: "WAEC", name: "WASSCE", provider: "WAEC", category: "External Exam", fee: "₦27,000" },
  { code: "NECO", name: "SSCE", provider: "NECO", category: "External Exam", fee: "₦23,000" },
  { code: "JAMB", name: "UTME", provider: "JAMB", category: "External Exam", fee: "₦7,700" },
  { code: "COMPTIA-A", name: "CompTIA A+", provider: "CompTIA", category: "Professional Exam", fee: "$252" },
  { code: "AWS-CCP", name: "AWS Certified Cloud Practitioner", provider: "Amazon Web Services", category: "Professional Exam", fee: "$100" },
  { code: "PMP", name: "Project Management Professional", provider: "PMI", category: "Certification", fee: "$405" },
];

const applicationTypeOptions = ["Course Admission", "External Exam / Certification"];
const intakeOptions = ["January 2026", "May 2026", "September 2026", "January 2027"];

const initialApplicants = [];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  applicationType: applicationTypeOptions[0],
  course: courseCatalog[0].code,
  examCode: externalExamCatalog[0].code,
  intake: intakeOptions[2],
  paymentStatus: "Pending",
};

const statusStyles = {
  "Pending Review": "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80",
  Admitted: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
  Rejected: "bg-red-100 text-red-800 ring-1 ring-red-200/80",
  Waitlisted: "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80",
};

const paymentStyles = {
  Paid: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
  Partial: "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80",
  Pending: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80",
};

const applicationTypeStyles = {
  "Course Admission": "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200/80",
  "External Exam / Certification": "bg-sky-100 text-sky-800 ring-1 ring-sky-200/80",
};

function courseInfo(code) {
  return courseCatalog.find((c) => c.code === code);
}

function examInfo(code) {
  return externalExamCatalog.find((x) => x.code === code);
}

function nextAdmissionNo(applicants) {
  const year = new Date().getFullYear();
  const count = applicants.filter((a) => a.admissionNo).length + 1;
  return `LIN/${year}/${String(count).padStart(4, "0")}`;
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

const statCards = [
  {
    key: "total",
    label: "Total Applicants",
    gradient: "from-slate-700 to-slate-900",
    soft: "bg-slate-50 border-slate-200 text-slate-800",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: "pending",
    label: "Pending Review",
    gradient: "from-amber-500 to-orange-500",
    soft: "bg-amber-50 border-amber-100 text-amber-900",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "admitted",
    label: "Admitted",
    gradient: "from-emerald-500 to-teal-600",
    soft: "bg-emerald-50 border-emerald-100 text-emerald-900",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "external",
    label: "External / Cert.",
    gradient: "from-sky-500 to-cyan-600",
    soft: "bg-sky-50 border-sky-100 text-sky-900",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    key: "intake",
    label: "Current Intake",
    gradient: "from-indigo-500 to-violet-600",
    soft: "bg-indigo-50 border-indigo-100 text-indigo-900",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function Admissions() {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filtered = applicants.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.admissionNo || "").toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    const matchesType = typeFilter === "All" || a.applicationType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
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
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please fill in name, email, and phone before saving.");
      return;
    }
    const isExternal = form.applicationType === "External Exam / Certification";
    const newApplicant = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      applicationType: form.applicationType,
      course: isExternal ? "" : form.course,
      examCode: isExternal ? form.examCode : "",
      intake: form.intake,
      paymentStatus: form.paymentStatus,
      status: "Pending Review",
      admissionNo: null,
      dateApplied: new Date().toISOString().slice(0, 10),
    };
    setApplicants((prev) => [newApplicant, ...prev]);
    closeModal();
  }

  function handleAdmit(id) {
    setApplicants((prev) => {
      const admissionNo = nextAdmissionNo(prev);
      return prev.map((a) =>
        a.id === id ? { ...a, status: "Admitted", admissionNo } : a
      );
    });
  }

  function handleReject(id) {
    if (confirm("Reject this applicant?")) {
      setApplicants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Rejected", admissionNo: null } : a))
      );
    }
  }

  function handleWaitlist(id) {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Waitlisted" } : a))
    );
  }

  function handleDelete(id) {
    if (confirm("Delete this application? This cannot be undone.")) {
      setApplicants((prev) => prev.filter((a) => a.id !== id));
    }
  }

  const pendingCount = applicants.filter((a) => a.status === "Pending Review").length;
  const admittedCount = applicants.filter((a) => a.status === "Admitted").length;
  const externalCount = applicants.filter(
    (a) => a.applicationType === "External Exam / Certification"
  ).length;

  const values = {
    total: applicants.length,
    pending: pendingCount,
    admitted: admittedCount,
    external: externalCount,
    intake: "Sep 2026",
  };

  const isExternalForm = form.applicationType === "External Exam / Certification";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-100">Admin portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Admissions</h1>
            <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
              Review course and external exam applications, track payments, and admit students.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Applicant
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((stat) => (
          <div
            key={stat.key}
            className={`relative overflow-hidden rounded-xl border p-4 shadow-sm ${stat.soft}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium opacity-80">{stat.label}</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight">{values[stat.key]}</p>
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
            placeholder="Search name, email, or admission no..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">All application types</option>
          {applicationTypeOptions.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">All statuses</option>
          <option>Pending Review</option>
          <option>Admitted</option>
          <option>Waitlisted</option>
          <option>Rejected</option>
        </select>
        <p className="ml-auto text-xs font-medium text-slate-500">
          Showing <span className="text-slate-800">{filtered.length}</span> of {applicants.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80">
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Applicant
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Program / Exam
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Duration / Provider
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Intake
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Admission No.
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
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No applicants found</p>
                      <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((a) => {
                const isExternal = a.applicationType === "External Exam / Certification";
                const course = isExternal ? null : courseInfo(a.course);
                const exam = isExternal ? examInfo(a.examCode) : null;
                return (
                  <tr key={a.id} className="transition-colors hover:bg-indigo-50/40">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Initials name={a.name} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">{a.name}</p>
                          <p className="truncate text-xs text-slate-500">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${applicationTypeStyles[a.applicationType]}`}
                      >
                        {isExternal ? "External / Cert." : "Course"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-800">
                        {isExternal ? (exam?.name ?? a.examCode) : (course?.title ?? a.course)}
                      </p>
                      {!isExternal && course && (
                        <p className="text-xs text-slate-500">{course.code}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {isExternal
                        ? exam
                          ? (
                              <span>
                                {exam.provider}
                                <span className="text-slate-400"> · </span>
                                {exam.category}
                              </span>
                            )
                          : "—"
                        : (course?.duration ?? "—")}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-violet-100">
                        {a.intake}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentStyles[a.paymentStatus]}`}
                      >
                        {a.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {a.admissionNo ? (
                        <span className="font-mono text-xs font-semibold text-indigo-700">
                          {a.admissionNo}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[a.status]}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        {a.status === "Pending Review" && (
                          <>
                            <button
                              onClick={() => handleAdmit(a.id)}
                              className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
                            >
                              Admit
                            </button>
                            <button
                              onClick={() => handleWaitlist(a.id)}
                              className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100"
                            >
                              Waitlist
                            </button>
                            <button
                              onClick={() => handleReject(a.id)}
                              className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-100"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {a.status === "Waitlisted" && (
                          <button
                            onClick={() => handleAdmit(a.id)}
                            className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
                          >
                            Admit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="rounded-lg px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          title="Delete"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
            <div className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-white">
              <h2 className="text-lg font-semibold">New Applicant</h2>
              <p className="mt-0.5 text-sm text-indigo-100">
                Add a course or external exam application
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Application type pills */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Application Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {applicationTypeOptions.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, applicationType: t })}
                      className={[
                        "rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition",
                        form.applicationType === t
                          ? t === "Course Admission"
                            ? "border-indigo-300 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-500/20"
                            : "border-sky-300 bg-sky-50 text-sky-800 ring-2 ring-sky-500/20"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {t === "Course Admission" ? "Course Admission" : "External Exam / Cert."}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. Chidinma Obi"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="applicant@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="080-0000-0000"
                  />
                </div>
              </div>

              {isExternalForm ? (
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Exam / Certification
                  </label>
                  <select
                    value={form.examCode}
                    onChange={(e) => setForm({ ...form, examCode: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {externalExamCatalog.map((x) => (
                      <option key={x.code} value={x.code}>
                        {x.name} ({x.provider} · {x.fee})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Course Applying For
                  </label>
                  <select
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {courseCatalog.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.title} ({c.duration})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Intake</label>
                  <select
                    value={form.intake}
                    onChange={(e) => setForm({ ...form, intake: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {intakeOptions.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Payment Status</label>
                  <select
                    value={form.paymentStatus}
                    onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option>Pending</option>
                    <option>Partial</option>
                    <option>Paid</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
            </form>

            <div className="shrink-0 flex justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form=""
                onClick={handleSubmit}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-violet-700"
              >
                Save Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
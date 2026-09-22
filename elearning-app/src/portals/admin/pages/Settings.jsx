import { useState } from "react";
import { Plus, Pencil, Trash2, X, CalendarDays, Layers, Users, Clock, Award } from "lucide-react";

// ---- Mock data -------------------------------------------------------

const initialAcademicYears = [
  { id: 1, label: "2025/2026", startDate: "2025-09-01", endDate: "2026-07-31", status: "Active" },
  { id: 2, label: "2024/2025", startDate: "2024-09-01", endDate: "2025-07-31", status: "Closed" },
];

const initialSessions = [
  { id: 1, label: "First Term", academicYear: "2025/2026", startDate: "2025-09-01", endDate: "2025-12-12", status: "Active" },
  { id: 2, label: "Second Term", academicYear: "2025/2026", startDate: "2026-01-05", endDate: "2026-04-03", status: "Upcoming" },
  { id: 3, label: "Third Term", academicYear: "2025/2026", startDate: "2026-04-20", endDate: "2026-07-31", status: "Upcoming" },
];

const initialCohorts = [
  { id: 1, name: "Cohort 12 - Web Development", academicYear: "2025/2026", capacity: 60, enrolled: 48, status: "Active" },
  { id: 2, name: "Cohort 13 - Data Analytics", academicYear: "2025/2026", capacity: 50, enrolled: 22, status: "Active" },
  { id: 3, name: "Cohort 11 - Cybersecurity", academicYear: "2024/2025", capacity: 40, enrolled: 40, status: "Closed" },
];

const initialDurations = [
  { id: 1, name: "Standard Course", value: 12, unit: "Weeks" },
  { id: 2, name: "Bootcamp", value: 6, unit: "Weeks" },
  { id: 3, name: "CBT Exam Window", value: 60, unit: "Minutes" },
  { id: 4, name: "Assignment Submission", value: 7, unit: "Days" },
];

export const externalExamCategoryOptions = ["External Exam", "Certification", "Professional Exam"];

const initialExternalExams = [
  { id: 1, code: "WAEC", name: "West African Senior School Certificate (WASSCE)", provider: "WAEC", category: "External Exam", fee: "₦27,000", status: "Active" },
  { id: 2, code: "NECO", name: "Senior School Certificate Examination", provider: "NECO", category: "External Exam", fee: "₦23,000", status: "Active" },
  { id: 3, code: "JAMB", name: "Unified Tertiary Matriculation Examination (UTME)", provider: "JAMB", category: "External Exam", fee: "₦7,700", status: "Active" },
  { id: 4, code: "COMPTIA-A", name: "CompTIA A+", provider: "CompTIA", category: "Professional Exam", fee: "$252", status: "Active" },
  { id: 5, code: "AWS-CCP", name: "AWS Certified Cloud Practitioner", provider: "Amazon Web Services", category: "Professional Exam", fee: "$100", status: "Active" },
  { id: 6, code: "PMP", name: "Project Management Professional", provider: "PMI", category: "Certification", fee: "$405", status: "Active" },
];

// ---- Shared bits -------------------------------------------------------

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
  Upcoming: "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80",
  Closed: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80",
  Inactive: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80",
};

const categoryStyles = {
  "External Exam": "bg-sky-100 text-sky-800 ring-1 ring-sky-200/80",
  Certification: "bg-violet-100 text-violet-800 ring-1 ring-violet-200/80",
  "Professional Exam": "bg-orange-100 text-orange-800 ring-1 ring-orange-200/80",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        statusStyles[status] || statusStyles.Closed
      }`}
    >
      {status}
    </span>
  );
}

function CategoryBadge({ category }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        categoryStyles[category] || categoryStyles["External Exam"]
      }`}
    >
      {category}
    </span>
  );
}

function SectionCard({ icon: Icon, title, description, gradient, children, action }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md`}
          >
            <Icon size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Modal({ title, subtitle, onClose, onSubmit, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">{title}</h3>
              {subtitle && <p className="mt-0.5 text-sm text-indigo-100">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg bg-white/10 p-1.5 text-white transition hover:bg-white/20"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">{children}</div>
          <div className="flex shrink-0 justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-violet-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={onEdit}
        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        title="Edit"
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={onDelete}
        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ---- Academic Years -------------------------------------------------------

function AcademicYearsSection() {
  const [years, setYears] = useState(initialAcademicYears);
  const [modal, setModal] = useState(null);

  const emptyForm = { label: "", startDate: "", endDate: "", status: "Upcoming" };
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ mode: "add" });
  };

  const openEdit = (year) => {
    setForm(year);
    setModal({ mode: "edit", id: year.id });
  };

  const save = () => {
    if (!form.label || !form.startDate || !form.endDate) return;
    if (modal.mode === "add") {
      setYears((prev) => [...prev, { ...form, id: Date.now() }]);
    } else {
      setYears((prev) => prev.map((y) => (y.id === modal.id ? { ...form, id: modal.id } : y)));
    }
    setModal(null);
  };

  const remove = (id) => setYears((prev) => prev.filter((y) => y.id !== id));

  return (
    <SectionCard
      icon={CalendarDays}
      title="Academic years"
      description="Define the academic years used across the platform"
      gradient="from-indigo-500 to-violet-600"
      action={
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100"
        >
          <Plus size={14} /> Add year
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="py-2.5 pr-4">Label</th>
              <th className="py-2.5 pr-4">Start date</th>
              <th className="py-2.5 pr-4">End date</th>
              <th className="py-2.5 pr-4">Status</th>
              <th className="py-2.5 pr-0 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {years.map((year) => (
              <tr key={year.id} className="transition hover:bg-indigo-50/30">
                <td className="py-3 pr-4 font-semibold text-slate-800">{year.label}</td>
                <td className="py-3 pr-4 text-slate-500">{year.startDate}</td>
                <td className="py-3 pr-4 text-slate-500">{year.endDate}</td>
                <td className="py-3 pr-4">
                  <StatusBadge status={year.status} />
                </td>
                <td className="py-3 pr-0">
                  <ActionButtons onEdit={() => openEdit(year)} onDelete={() => remove(year.id)} />
                </td>
              </tr>
            ))}
            {years.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No academic years yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          title={modal.mode === "add" ? "Add academic year" : "Edit academic year"}
          subtitle="Set the label, dates, and status"
          onClose={() => setModal(null)}
          onSubmit={save}
        >
          <Field label="Label">
            <input
              className={inputClass}
              placeholder="e.g. 2026/2027"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <input
                type="date"
                className={inputClass}
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </Field>
            <Field label="End date">
              <input
                type="date"
                className={inputClass}
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Status">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Upcoming</option>
              <option>Active</option>
              <option>Closed</option>
            </select>
          </Field>
        </Modal>
      )}
    </SectionCard>
  );
}

// ---- Sessions / Terms -------------------------------------------------------

function SessionsSection({ academicYearOptions }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [modal, setModal] = useState(null);

  const emptyForm = {
    label: "",
    academicYear: academicYearOptions[0] || "",
    startDate: "",
    endDate: "",
    status: "Upcoming",
  };
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ mode: "add" });
  };

  const openEdit = (session) => {
    setForm(session);
    setModal({ mode: "edit", id: session.id });
  };

  const save = () => {
    if (!form.label || !form.startDate || !form.endDate) return;
    if (modal.mode === "add") {
      setSessions((prev) => [...prev, { ...form, id: Date.now() }]);
    } else {
      setSessions((prev) => prev.map((s) => (s.id === modal.id ? { ...form, id: modal.id } : s)));
    }
    setModal(null);
  };

  const remove = (id) => setSessions((prev) => prev.filter((s) => s.id !== id));

  return (
    <SectionCard
      icon={Layers}
      title="Sessions / terms"
      description="Manage the terms or semesters that sit inside each academic year"
      gradient="from-sky-500 to-cyan-600"
      action={
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-100"
        >
          <Plus size={14} /> Add session
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="py-2.5 pr-4">Session</th>
              <th className="py-2.5 pr-4">Academic year</th>
              <th className="py-2.5 pr-4">Start date</th>
              <th className="py-2.5 pr-4">End date</th>
              <th className="py-2.5 pr-4">Status</th>
              <th className="py-2.5 pr-0 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sessions.map((session) => (
              <tr key={session.id} className="transition hover:bg-sky-50/30">
                <td className="py-3 pr-4 font-semibold text-slate-800">{session.label}</td>
                <td className="py-3 pr-4">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">
                    {session.academicYear}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-500">{session.startDate}</td>
                <td className="py-3 pr-4 text-slate-500">{session.endDate}</td>
                <td className="py-3 pr-4">
                  <StatusBadge status={session.status} />
                </td>
                <td className="py-3 pr-0">
                  <ActionButtons onEdit={() => openEdit(session)} onDelete={() => remove(session.id)} />
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No sessions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          title={modal.mode === "add" ? "Add session" : "Edit session"}
          subtitle="Link a term to an academic year"
          onClose={() => setModal(null)}
          onSubmit={save}
        >
          <Field label="Label">
            <input
              className={inputClass}
              placeholder="e.g. First Term"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
            />
          </Field>
          <Field label="Academic year">
            <select
              className={inputClass}
              value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
            >
              {academicYearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <input
                type="date"
                className={inputClass}
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </Field>
            <Field label="End date">
              <input
                type="date"
                className={inputClass}
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Status">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Upcoming</option>
              <option>Active</option>
              <option>Closed</option>
            </select>
          </Field>
        </Modal>
      )}
    </SectionCard>
  );
}

// ---- Cohorts -------------------------------------------------------

function CohortsSection({ academicYearOptions }) {
  const [cohorts, setCohorts] = useState(initialCohorts);
  const [modal, setModal] = useState(null);

  const emptyForm = {
    name: "",
    academicYear: academicYearOptions[0] || "",
    capacity: "",
    enrolled: 0,
    status: "Active",
  };
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ mode: "add" });
  };

  const openEdit = (cohort) => {
    setForm(cohort);
    setModal({ mode: "edit", id: cohort.id });
  };

  const save = () => {
    if (!form.name || !form.capacity) return;
    const payload = {
      ...form,
      capacity: Number(form.capacity),
      enrolled: Number(form.enrolled) || 0,
    };
    if (modal.mode === "add") {
      setCohorts((prev) => [...prev, { ...payload, id: Date.now() }]);
    } else {
      setCohorts((prev) =>
        prev.map((c) => (c.id === modal.id ? { ...payload, id: modal.id } : c))
      );
    }
    setModal(null);
  };

  const remove = (id) => setCohorts((prev) => prev.filter((c) => c.id !== id));

  return (
    <SectionCard
      icon={Users}
      title="Cohorts"
      description="Group students into cohorts tied to an academic year"
      gradient="from-emerald-500 to-teal-600"
      action={
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
        >
          <Plus size={14} /> Add cohort
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="py-2.5 pr-4">Cohort</th>
              <th className="py-2.5 pr-4">Academic year</th>
              <th className="py-2.5 pr-4">Enrolled / Capacity</th>
              <th className="py-2.5 pr-4">Status</th>
              <th className="py-2.5 pr-0 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cohorts.map((cohort) => {
              const fill =
                cohort.capacity > 0
                  ? Math.round((cohort.enrolled / cohort.capacity) * 100)
                  : 0;
              return (
                <tr key={cohort.id} className="transition hover:bg-emerald-50/30">
                  <td className="py-3 pr-4 font-semibold text-slate-800">{cohort.name}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">
                      {cohort.academicYear}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">
                        {cohort.enrolled} / {cohort.capacity}
                      </span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            fill >= 90
                              ? "bg-amber-500"
                              : fill >= 50
                              ? "bg-emerald-500"
                              : "bg-sky-500"
                          }`}
                          style={{ width: `${Math.min(fill, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={cohort.status} />
                  </td>
                  <td className="py-3 pr-0">
                    <ActionButtons
                      onEdit={() => openEdit(cohort)}
                      onDelete={() => remove(cohort.id)}
                    />
                  </td>
                </tr>
              );
            })}
            {cohorts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No cohorts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          title={modal.mode === "add" ? "Add cohort" : "Edit cohort"}
          subtitle="Set capacity and academic year"
          onClose={() => setModal(null)}
          onSubmit={save}
        >
          <Field label="Name">
            <input
              className={inputClass}
              placeholder="e.g. Cohort 14 - UI/UX Design"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Academic year">
            <select
              className={inputClass}
              value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
            >
              {academicYearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Capacity">
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
            </Field>
            <Field label="Enrolled">
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.enrolled}
                onChange={(e) => setForm({ ...form, enrolled: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Status">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Upcoming</option>
              <option>Closed</option>
            </select>
          </Field>
        </Modal>
      )}
    </SectionCard>
  );
}

// ---- Durations -------------------------------------------------------

function DurationsSection() {
  const [durations, setDurations] = useState(initialDurations);
  const [modal, setModal] = useState(null);

  const emptyForm = { name: "", value: "", unit: "Weeks" };
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ mode: "add" });
  };

  const openEdit = (duration) => {
    setForm(duration);
    setModal({ mode: "edit", id: duration.id });
  };

  const save = () => {
    if (!form.name || !form.value) return;
    const payload = { ...form, value: Number(form.value) };
    if (modal.mode === "add") {
      setDurations((prev) => [...prev, { ...payload, id: Date.now() }]);
    } else {
      setDurations((prev) =>
        prev.map((d) => (d.id === modal.id ? { ...payload, id: modal.id } : d))
      );
    }
    setModal(null);
  };

  const remove = (id) => setDurations((prev) => prev.filter((d) => d.id !== id));

  return (
    <SectionCard
      icon={Clock}
      title="Durations"
      description="Default durations used across courses, exams, and submissions"
      gradient="from-amber-500 to-orange-500"
      action={
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100"
        >
          <Plus size={14} /> Add duration
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="py-2.5 pr-4">Name</th>
              <th className="py-2.5 pr-4">Value</th>
              <th className="py-2.5 pr-4">Unit</th>
              <th className="py-2.5 pr-0 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {durations.map((duration) => (
              <tr key={duration.id} className="transition hover:bg-amber-50/30">
                <td className="py-3 pr-4 font-semibold text-slate-800">{duration.name}</td>
                <td className="py-3 pr-4">
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                    {duration.value}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-500">{duration.unit}</td>
                <td className="py-3 pr-0">
                  <ActionButtons
                    onEdit={() => openEdit(duration)}
                    onDelete={() => remove(duration.id)}
                  />
                </td>
              </tr>
            ))}
            {durations.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  No durations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          title={modal.mode === "add" ? "Add duration" : "Edit duration"}
          subtitle="Set a named default duration"
          onClose={() => setModal(null)}
          onSubmit={save}
        >
          <Field label="Name">
            <input
              className={inputClass}
              placeholder="e.g. Standard Course"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Value">
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </Field>
            <Field label="Unit">
              <select
                className={inputClass}
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              >
                <option>Minutes</option>
                <option>Hours</option>
                <option>Days</option>
                <option>Weeks</option>
                <option>Months</option>
              </select>
            </Field>
          </div>
        </Modal>
      )}
    </SectionCard>
  );
}

// ---- External Exams -------------------------------------------------------

function ExternalExamsSection() {
  const [exams, setExams] = useState(initialExternalExams);
  const [modal, setModal] = useState(null);

  const emptyForm = {
    code: "",
    name: "",
    provider: "",
    category: externalExamCategoryOptions[0],
    fee: "",
    status: "Active",
  };
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ mode: "add" });
  };

  const openEdit = (exam) => {
    setForm(exam);
    setModal({ mode: "edit", id: exam.id });
  };

  const save = () => {
    if (!form.code.trim() || !form.name.trim() || !form.provider.trim()) return;
    if (modal.mode === "add") {
      setExams((prev) => [...prev, { ...form, id: Date.now() }]);
    } else {
      setExams((prev) =>
        prev.map((x) => (x.id === modal.id ? { ...form, id: modal.id } : x))
      );
    }
    setModal(null);
  };

  const remove = (id) => setExams((prev) => prev.filter((x) => x.id !== id));

  return (
    <SectionCard
      icon={Award}
      title="External exams & certifications"
      description="External exams, certifications, and professional exams applicants can register for"
      gradient="from-rose-500 to-pink-600"
      action={
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100"
        >
          <Plus size={14} /> Add exam
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="py-2.5 pr-4">Code</th>
              <th className="py-2.5 pr-4">Name</th>
              <th className="py-2.5 pr-4">Provider</th>
              <th className="py-2.5 pr-4">Category</th>
              <th className="py-2.5 pr-4">Fee</th>
              <th className="py-2.5 pr-4">Status</th>
              <th className="py-2.5 pr-0 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {exams.map((exam) => (
              <tr key={exam.id} className="transition hover:bg-rose-50/30">
                <td className="py-3 pr-4">
                  <span className="font-mono text-xs font-semibold text-indigo-700">
                    {exam.code}
                  </span>
                </td>
                <td className="py-3 pr-4 font-medium text-slate-800">{exam.name}</td>
                <td className="py-3 pr-4 text-slate-500">{exam.provider}</td>
                <td className="py-3 pr-4">
                  <CategoryBadge category={exam.category} />
                </td>
                <td className="py-3 pr-4 font-medium text-slate-700">{exam.fee}</td>
                <td className="py-3 pr-4">
                  <StatusBadge status={exam.status} />
                </td>
                <td className="py-3 pr-0">
                  <ActionButtons
                    onEdit={() => openEdit(exam)}
                    onDelete={() => remove(exam.id)}
                  />
                </td>
              </tr>
            ))}
            {exams.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No external exams or certifications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          title={modal.mode === "add" ? "Add exam / certification" : "Edit exam / certification"}
          subtitle="External exam, certification, or professional exam"
          onClose={() => setModal(null)}
          onSubmit={save}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Code">
              <input
                className={inputClass}
                placeholder="e.g. WAEC, PMP"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
              />
            </Field>
            <Field label="Category">
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {externalExamCategoryOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Name">
            <input
              className={inputClass}
              placeholder="e.g. Project Management Professional"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Provider / examining body">
            <input
              className={inputClass}
              placeholder="e.g. PMI, WAEC, AWS"
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fee">
              <input
                className={inputClass}
                placeholder="e.g. ₦27,000 or $405"
                value={form.fee}
                onChange={(e) => setForm({ ...form, fee: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </Field>
          </div>
        </Modal>
      )}
    </SectionCard>
  );
}

// ---- Page -------------------------------------------------------

export default function Settings() {
  const academicYearOptions = initialAcademicYears.map((y) => y.label);

  const overview = [
    {
      label: "Academic Years",
      value: initialAcademicYears.length,
      gradient: "from-indigo-500 to-violet-600",
      soft: "bg-indigo-50 border-indigo-100 text-indigo-900",
      icon: CalendarDays,
    },
    {
      label: "Sessions",
      value: initialSessions.length,
      gradient: "from-sky-500 to-cyan-600",
      soft: "bg-sky-50 border-sky-100 text-sky-900",
      icon: Layers,
    },
    {
      label: "Cohorts",
      value: initialCohorts.length,
      gradient: "from-emerald-500 to-teal-600",
      soft: "bg-emerald-50 border-emerald-100 text-emerald-900",
      icon: Users,
    },
    {
      label: "Durations",
      value: initialDurations.length,
      gradient: "from-amber-500 to-orange-500",
      soft: "bg-amber-50 border-amber-100 text-amber-900",
      icon: Clock,
    },
    {
      label: "External Exams",
      value: initialExternalExams.length,
      gradient: "from-rose-500 to-pink-600",
      soft: "bg-rose-50 border-rose-100 text-rose-900",
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-indigo-100">Admin portal</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">General settings</h1>
          <p className="mt-1 max-w-2xl text-sm text-indigo-100/90">
            Manage academic years, sessions, cohorts, default durations, and external exams / certifications used across the platform.
          </p>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {overview.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`relative overflow-hidden rounded-xl border p-4 shadow-sm ${stat.soft}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium opacity-80">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div
                  className={`rounded-lg bg-gradient-to-br ${stat.gradient} p-2 text-white shadow-md`}
                >
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AcademicYearsSection />
      <SessionsSection academicYearOptions={academicYearOptions} />
      <CohortsSection academicYearOptions={academicYearOptions} />
      <DurationsSection />
      <ExternalExamsSection />
    </div>
  );
}
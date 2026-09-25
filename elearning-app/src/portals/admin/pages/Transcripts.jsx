import { useState } from "react";

const students = [];

function getGrade(percent) {
  if (percent >= 70) return "A";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 45) return "D";
  return "F";
}

function gradePoint(grade) {
  return { A: 5, B: 4, C: 3, D: 2, F: 0 }[grade];
}

function gradeColor(grade) {
  if (grade === "A" || grade === "B")
    return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80";
  if (grade === "C" || grade === "D")
    return "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80";
  return "bg-red-100 text-red-800 ring-1 ring-red-200/80";
}

function computeGPA(courses) {
  if (courses.length === 0) return "0.00";
  const totalPoints = courses.reduce((sum, c) => {
    const percent = Math.round((c.score / c.total) * 100);
    return sum + gradePoint(getGrade(percent));
  }, 0);
  return (totalPoints / courses.length).toFixed(2);
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

export default function Transcripts() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(students[0].id);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.matric.toLowerCase().includes(q);
  });

  const selected = students.find((s) => s.id === selectedId);
  const gpa = selected ? computeGPA(selected.courses) : "0.00";
  const gpaNum = parseFloat(gpa);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-indigo-100">Admin portal</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Transcripts</h1>
          <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
            Generate an academic transcript for any student, combining every course and result on file.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr]">
        {/* Student list */}
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-3">
            <div className="relative">
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
                placeholder="Search students..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <ul className="max-h-[28rem] divide-y divide-slate-100 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-slate-400">
                No students found.
              </li>
            )}
            {filtered.map((s) => {
              const isSelected = s.id === selectedId;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => setSelectedId(s.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                      isSelected
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                        : "hover:bg-indigo-50/60 text-slate-700"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                      }`}
                    >
                      {s.name
                        .split(" ")
                        .map((n) => n[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p
                        className={`truncate text-xs ${
                          isSelected ? "text-indigo-200" : "text-slate-500"
                        }`}
                      >
                        {s.matric}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Transcript panel */}
        {selected && (
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            {/* Transcript header */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/40 px-6 py-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Initials name={selected.name} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      Official Transcript
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      {selected.name}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                      <span className="font-mono text-xs font-semibold text-indigo-700">
                        {selected.matric}
                      </span>
                      <span className="mx-1.5 text-slate-300">·</span>
                      {selected.program}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Admitted {selected.admissionDate}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-violet-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print / Download
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 border-b border-slate-100 px-6 py-4">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2.5">
                <p className="text-xs font-medium text-indigo-600/80">Courses</p>
                <p className="mt-0.5 text-xl font-bold text-indigo-900">
                  {selected.courses.length}
                </p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-2.5">
                <p className="text-xs font-medium text-amber-600/80">Cumulative GPA</p>
                <p className="mt-0.5 text-xl font-bold text-amber-900">{gpa}</p>
              </div>
              <div
                className={`rounded-xl border px-3 py-2.5 ${
                  gpaNum >= 4
                    ? "border-emerald-100 bg-emerald-50/60"
                    : gpaNum >= 2.5
                    ? "border-amber-100 bg-amber-50/60"
                    : "border-red-100 bg-red-50/60"
                }`}
              >
                <p
                  className={`text-xs font-medium ${
                    gpaNum >= 4
                      ? "text-emerald-600/80"
                      : gpaNum >= 2.5
                      ? "text-amber-600/80"
                      : "text-red-600/80"
                  }`}
                >
                  Standing
                </p>
                <p
                  className={`mt-0.5 text-xl font-bold ${
                    gpaNum >= 4
                      ? "text-emerald-900"
                      : gpaNum >= 2.5
                      ? "text-amber-900"
                      : "text-red-900"
                  }`}
                >
                  {gpaNum >= 4 ? "Good" : gpaNum >= 2.5 ? "Fair" : "Probation"}
                </p>
              </div>
            </div>

            {/* Course results table */}
            <div className="px-6 py-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Course results
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead>
                    <tr className="bg-slate-50/80">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Code
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Course Title
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Score
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selected.courses.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                          No results on file yet for this student.
                        </td>
                      </tr>
                    )}
                    {selected.courses.map((c) => {
                      const percent = Math.round((c.score / c.total) * 100);
                      const grade = getGrade(percent);
                      return (
                        <tr key={c.code} className="transition hover:bg-indigo-50/30">
                          <td className="px-4 py-3">
                            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                              {c.code}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800">{c.title}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800">
                                {c.score}/{c.total}
                              </span>
                              <span className="text-xs text-slate-500">({percent}%)</span>
                              <div className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-slate-100 sm:block">
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
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${gradeColor(grade)}`}
                            >
                              {grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* GPA footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Cumulative GPA</p>
                <p className="text-xs text-slate-400">Based on {selected.courses.length} course(s) on a 5.00 scale</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{gpa}</span>
                <span className="text-sm font-medium text-slate-400">/ 5.00</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
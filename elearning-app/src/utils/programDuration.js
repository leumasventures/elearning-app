const learnerPrograms = [
  // example shape — load from API when ready
  // {
  //   id: "e1",
  //   student: "Chinedu Okafor",
  //   matric: "CSC/2023/041",
  //   program: "Diploma in Web Development",
  //   courseCode: "WEBDEV-D",
  //   durationWeeks: 24,          // total program length
  //   startDate: "2026-03-01",    // enrolment / start
  //   endDate: "2026-08-31",      // planned end (or start + duration)
  //   progress: 45,               // 0–100 % content complete
  //   status: "On track",         // On track | At risk | Overdue | Completed
  // },
];

export function daysBetween(a, b) {
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Derive duration / progress metrics for a learner program.
 * Expected program shape (flexible):
 * {
 *   id, student, matric, program, courseCode,
 *   durationWeeks, startDate, endDate, progress (0–100)
 * }
 */
export function monitorProgram(p) {
  const now = new Date();
  const start = p.startDate ? new Date(p.startDate) : null;
  const end = p.endDate
    ? new Date(p.endDate)
    : start && p.durationWeeks
      ? new Date(start.getTime() + p.durationWeeks * 7 * 24 * 60 * 60 * 1000)
      : null;

  const durationDays =
    start && end
      ? Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))
      : (p.durationWeeks || 0) * 7;

  const elapsed =
    start
      ? Math.max(0, Math.round((now - start) / (1000 * 60 * 60 * 24)))
      : 0;

  const remaining =
    end
      ? Math.max(0, Math.round((end - now) / (1000 * 60 * 60 * 24)))
      : Math.max(0, durationDays - elapsed);

  const timeUsedPct =
    durationDays > 0 ? Math.round((elapsed / durationDays) * 100) : 0;

  const progress = Number(p.progress ?? 0);

  let status = "On track";
  if (remaining === 0 && progress < 100) status = "Overdue";
  else if (timeUsedPct > progress + 15) status = "At risk";
  else if (progress >= 100) status = "Completed";

  return {
    durationWeeks: p.durationWeeks ?? Math.round(durationDays / 7),
    elapsed,
    remaining,
    timeUsedPct,
    progress,
    status,
  };
}

export function statusStyles(status) {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-800";
    case "On track":
      return "bg-sky-100 text-sky-800";
    case "At risk":
      return "bg-amber-100 text-amber-800";
    case "Overdue":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function statusStyles(status) {
  if (status === "Completed") return "bg-emerald-100 text-emerald-700";
  if (status === "On track") return "bg-sky-100 text-sky-700";
  if (status === "At risk") return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-700";
}



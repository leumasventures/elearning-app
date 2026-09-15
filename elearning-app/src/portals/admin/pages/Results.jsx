import { useState } from "react";

const courseOptions = ["All Courses", "CSC101", "MTH201", "ENG150"];

const examsByCourse = {
  CSC101: ["Mid-Semester Test"],
  MTH201: ["CA2 Assessment"],
  ENG150: ["First Semester Final"],
};

const initialResults = [
  { id: 1, student: "Chinedu Okafor", matric: "CSC/2023/041", course: "CSC101", exam: "Mid-Semester Test", score: 82, total: 100 },
  { id: 2, student: "Amaka Eze", matric: "CSC/2023/017", course: "CSC101", exam: "Mid-Semester Test", score: 58, total: 100 },
  { id: 3, student: "Tunde Bakare", matric: "MTH/2023/009", course: "MTH201", exam: "CA2 Assessment", score: 71, total: 100 },
  { id: 4, student: "Ngozi Umeh", matric: "MTH/2023/022", course: "MTH201", exam: "CA2 Assessment", score: 45, total: 100 },
  { id: 5, student: "Fatima Bello", matric: "ENG/2023/003", course: "ENG150", exam: "First Semester Final", score: 90, total: 100 },
];

function getGrade(percent) {
  if (percent >= 70) return "A";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 45) return "D";
  return "F";
}

function gradeColor(grade) {
  if (grade === "A" || grade === "B") return "bg-green-100 text-green-700";
  if (grade === "C" || grade === "D") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function Results() {
  const [results] = useState(initialResults);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [examFilter, setExamFilter] = useState("All Exams");

  const availableExams =
    courseFilter === "All Courses"
      ? ["All Exams", ...Object.values(examsByCourse).flat()]
      : ["All Exams", ...(examsByCourse[courseFilter] || [])];

  const filtered = results.filter((r) => {
    const matchesSearch =
      r.student.toLowerCase().includes(search.toLowerCase()) ||
      r.matric.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === "All Courses" || r.course === courseFilter;
    const matchesExam = examFilter === "All Exams" || r.exam === examFilter;
    return matchesSearch && matchesCourse && matchesExam;
  });

  function handleCourseChange(value) {
    setCourseFilter(value);
    setExamFilter("All Exams");
  }

  function handleExport() {
    alert("Export will generate a CSV of these results once connected to real data.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-slate-900">Results</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage student exam results.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Export
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name or matric no..."
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        <select
          value={courseFilter}
          onChange={(e) => handleCourseChange(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          {courseOptions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          {availableExams.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Matric No.</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Course</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Exam</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Score</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Grade</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  No results found.
                </td>
              </tr>
            )}
            {filtered.map((r) => {
              const percent = Math.round((r.score / r.total) * 100);
              const grade = getGrade(percent);
              const passed = percent >= 45;
              return (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.student}</td>
                  <td className="px-4 py-3 text-slate-700">{r.matric}</td>
                  <td className="px-4 py-3 text-slate-700">{r.course}</td>
                  <td className="px-4 py-3 text-slate-700">{r.exam}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {r.score}/{r.total} ({percent}%)
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${gradeColor(
                        grade
                      )}`}
                    >
                      {grade}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium ${
                        passed ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {passed ? "Pass" : "Fail"}
                    </span>
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
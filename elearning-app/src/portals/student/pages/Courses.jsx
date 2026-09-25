import { useState } from "react";

const initialEnrolledCourses = [];

const availableCourses = [];

const contentTypeStyles = {
  Video: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200/80",
  PDF: "bg-rose-100 text-rose-800 ring-1 ring-rose-200/80",
  "Live Class": "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
  Link: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80",
};

const contentActionLabel = {
  Video: "Watch",
  PDF: "Download",
  "Live Class": "Join",
  Link: "Open",
};

function ProgressBar({ value }) {
  const color =
    value >= 100
      ? "bg-emerald-500"
      : value >= 50
      ? "bg-indigo-500"
      : "bg-amber-500";
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export default function Courses() {
  const [enrolled, setEnrolled] = useState(initialEnrolledCourses);
  const [available, setAvailable] = useState(availableCourses);
  const [search, setSearch] = useState("");
  const [contentCourseId, setContentCourseId] = useState(null);

  const filteredEnrolled = enrolled.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const contentCourse = enrolled.find((c) => c.id === contentCourseId) || null;
  const completedCount = enrolled.filter((c) => c.progress === 100).length;
  const avgProgress =
    enrolled.length > 0
      ? Math.round(
          enrolled.reduce((sum, c) => sum + c.progress, 0) / enrolled.length
        )
      : 0;

  function handleEnroll(course) {
    setAvailable((prev) => prev.filter((c) => c.id !== course.id));
    setEnrolled((prev) => [
      ...prev,
      {
        id: course.id,
        code: course.code,
        title: course.title,
        lecturer: course.lecturer,
        progress: 0,
        lessonsCompleted: 0,
        totalLessons: course.lessons,
        materials: [],
      },
    ]);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-indigo-100">Student portal</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Courses</h1>
          <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
            Track progress on your enrolled courses, or enroll in new ones.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-indigo-700/80">Enrolled</p>
              <p className="mt-1.5 text-2xl font-bold text-indigo-900">{enrolled.length}</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 p-2 text-white shadow-md">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-emerald-700/80">Completed</p>
              <p className="mt-1.5 text-2xl font-bold text-emerald-900">{completedCount}</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-2 text-white shadow-md">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-amber-700/80">Avg Progress</p>
              <p className="mt-1.5 text-2xl font-bold text-amber-900">{avgProgress}%</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-2 text-white shadow-md">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-sky-700/80">Available</p>
              <p className="mt-1.5 text-2xl font-bold text-sky-900">{available.length}</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 p-2 text-white shadow-md">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
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
          placeholder="Search your courses..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Enrolled courses */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900">My Courses</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEnrolled.length === 0 && (
            <div className="col-span-full rounded-xl border border-slate-200/80 bg-white px-4 py-12 text-center shadow-sm">
              <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-600">No enrolled courses match your search</p>
              </div>
            </div>
          )}
          {filteredEnrolled.map((course) => (
            <div
              key={course.id}
              className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md"
            >
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                    {course.code}
                  </span>
                  {course.progress === 100 && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/80">
                      Completed
                    </span>
                  )}
                </div>
                <p className="mt-2.5 font-semibold text-slate-900">{course.title}</p>
                <p className="mt-1 text-sm text-slate-500">{course.lecturer}</p>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {course.lessonsCompleted}/{course.totalLessons} lessons
                    </span>
                    <span className="font-semibold text-slate-700">{course.progress}%</span>
                  </div>
                  <ProgressBar value={course.progress} />
                </div>

                <div className="mt-4 space-y-2">
                  <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-violet-700">
                    {course.progress === 0
                      ? "Start Course"
                      : course.progress === 100
                      ? "Review Course"
                      : "Continue Learning"}
                  </button>
                  <button
                    onClick={() => setContentCourseId(course.id)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Course Content ({course.materials.length})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available courses */}
      {available.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Available Courses</h2>
          <p className="mt-1 text-sm text-slate-500">
            Courses you're eligible to enroll in.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((course) => (
              <div
                key={course.id}
                className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 p-5 transition hover:border-indigo-300 hover:bg-indigo-50/60"
              >
                <span className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                  {course.code}
                </span>
                <p className="mt-2.5 font-semibold text-slate-900">{course.title}</p>
                <p className="mt-1 text-sm text-slate-500">{course.lecturer}</p>
                <p className="mt-1.5 text-xs text-slate-400">
                  {course.lessons} lessons
                </p>
                <button
                  onClick={() => handleEnroll(course)}
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-violet-700"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content modal */}
      {contentCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Course Content</h2>
                  <p className="mt-0.5 text-sm text-indigo-100">
                    {contentCourse.code} · {contentCourse.title}
                  </p>
                </div>
                <button
                  onClick={() => setContentCourseId(null)}
                  className="rounded-lg bg-white/10 p-1.5 text-white transition hover:bg-white/20"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto">
              {contentCourse.materials.length === 0 ? (
                <li className="px-6 py-12 text-center">
                  <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      No content uploaded yet
                    </p>
                    <p className="text-xs text-slate-400">
                      Materials will appear here when your lecturer adds them.
                    </p>
                  </div>
                </li>
              ) : (
                contentCourse.materials.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-indigo-50/40"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${contentTypeStyles[item.type]}`}
                        >
                          {item.type}
                        </span>
                        <span className="truncate text-sm font-medium text-slate-800">
                          {item.title}
                        </span>
                      </div>
                      {item.scheduledAt && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.scheduledAt.replace("T", " ")}
                        </p>
                      )}
                    </div>
                    <a
                      href={
                        item.type === "Video" || item.type === "PDF"
                          ? undefined
                          : item.source
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="ml-3 shrink-0 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100"
                    >
                      {contentActionLabel[item.type]}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
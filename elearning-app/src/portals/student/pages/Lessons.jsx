import { useState } from "react";

const courses = [
  {
    code: "CSC101",
    title: "Introduction to Programming",
    lessons: [
      {
        id: "l1",
        title: "What is Programming?",
        duration: "12 min",
        completed: true,
        content:
          "Programming is the process of giving instructions to a computer to perform a task. In this lesson we cover what a program is, how computers execute instructions, and the difference between compiled and interpreted languages.",
      },
      {
        id: "l2",
        title: "Variables and Data Types",
        duration: "18 min",
        completed: true,
        content:
          "Variables are named containers for storing data. We cover common data types — numbers, strings, booleans — and how to declare and assign variables in Python.",
      },
      {
        id: "l3",
        title: "Loops and Conditionals",
        duration: "25 min",
        completed: false,
        content:
          "Loops let you repeat actions, and conditionals let your program make decisions. This lesson covers for-loops, while-loops, if/elif/else statements, and common patterns.",
      },
    ],
  },
  {
    code: "MTH201",
    title: "Calculus II",
    lessons: [
      {
        id: "m1",
        title: "Review of Limits",
        duration: "15 min",
        completed: true,
        content:
          "A refresher on limits before diving into derivatives — evaluating limits algebraically, graphically, and understanding one-sided limits.",
      },
      {
        id: "m2",
        title: "Derivatives of Trigonometric Functions",
        duration: "22 min",
        completed: false,
        content:
          "How to differentiate sin(x), cos(x), tan(x) and their combinations, with worked examples using the chain rule.",
      },
    ],
  },
];

export default function Lessons() {
  const [activeCourseCode, setActiveCourseCode] = useState(courses[0].code);
  const activeCourse = courses.find((c) => c.code === activeCourseCode);

  const [activeLessonId, setActiveLessonId] = useState(
    activeCourse.lessons[0]?.id
  );
  const [completionByLesson, setCompletionByLesson] = useState(() => {
    const map = {};
    courses.forEach((c) =>
      c.lessons.forEach((l) => {
        map[l.id] = l.completed;
      })
    );
    return map;
  });

  const activeLesson = activeCourse.lessons.find(
    (l) => l.id === activeLessonId
  );

  function selectCourse(code) {
    setActiveCourseCode(code);
    const course = courses.find((c) => c.code === code);
    setActiveLessonId(course.lessons[0]?.id ?? null);
  }

  function toggleComplete(lessonId) {
    setCompletionByLesson((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  }

  const completedCount = activeCourse.lessons.filter(
    (l) => completionByLesson[l.id]
  ).length;
  const progressPct =
    activeCourse.lessons.length > 0
      ? Math.round((completedCount / activeCourse.lessons.length) * 100)
      : 0;

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const totalCompleted = Object.values(completionByLesson).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-100">Student portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Lessons</h1>
            <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
              Work through course lessons at your own pace.
            </p>
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur">
            <p className="text-xs font-medium text-indigo-100">Overall</p>
            <p className="text-lg font-bold text-white">
              {totalCompleted}/{totalLessons}
            </p>
          </div>
        </div>
      </div>

      {/* Course tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        {courses.map((c) => {
          const done = c.lessons.filter((l) => completionByLesson[l.id]).length;
          const active = activeCourseCode === c.code;
          return (
            <button
              key={c.code}
              onClick={() => selectCourse(c.code)}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/40"
                  : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {c.code}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {done}/{c.lessons.length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Lesson list */}
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm lg:col-span-1">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/40 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">
              {activeCourse.title}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>
                {completedCount}/{activeCourse.lessons.length} completed
              </span>
              <span className="font-semibold text-indigo-600">{progressPct}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full transition-all ${
                  progressPct === 100
                    ? "bg-emerald-500"
                    : progressPct >= 50
                    ? "bg-indigo-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-1 p-2">
            {activeCourse.lessons.map((lesson, index) => {
              const done = completionByLesson[lesson.id];
              const active = lesson.id === activeLessonId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                      : "text-slate-700 hover:bg-indigo-50/60"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      done
                        ? active
                          ? "bg-white text-indigo-600"
                          : "bg-emerald-500 text-white"
                        : active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {done ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{lesson.title}</p>
                    <p
                      className={`text-xs ${
                        active ? "text-indigo-200" : "text-slate-400"
                      }`}
                    >
                      {lesson.duration}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lesson content */}
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm lg:col-span-2">
          {activeLesson ? (
            <>
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30 px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                        {activeCourse.code}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {activeLesson.duration}
                      </span>
                      {completionByLesson[activeLesson.id] && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/80">
                          Completed
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900">
                      {activeLesson.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => toggleComplete(activeLesson.id)}
                    className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      completionByLesson[activeLesson.id]
                        ? "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md hover:from-indigo-700 hover:to-violet-700"
                    }`}
                  >
                    {completionByLesson[activeLesson.id]
                      ? "Mark as Incomplete"
                      : "Mark as Complete"}
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                <p className="text-sm leading-relaxed text-slate-700">
                  {activeLesson.content}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                <button
                  onClick={() => {
                    const idx = activeCourse.lessons.findIndex(
                      (l) => l.id === activeLessonId
                    );
                    if (idx > 0)
                      setActiveLessonId(activeCourse.lessons[idx - 1].id);
                  }}
                  disabled={activeCourse.lessons[0]?.id === activeLessonId}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button
                  onClick={() => {
                    const idx = activeCourse.lessons.findIndex(
                      (l) => l.id === activeLessonId
                    );
                    if (idx < activeCourse.lessons.length - 1)
                      setActiveLessonId(activeCourse.lessons[idx + 1].id);
                  }}
                  disabled={
                    activeCourse.lessons[activeCourse.lessons.length - 1]?.id ===
                    activeLessonId
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-slate-600">
                No lessons available for this course yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
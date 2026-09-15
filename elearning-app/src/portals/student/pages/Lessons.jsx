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

  return (
    <div>
      <h1 className="text-lg font-medium text-slate-900">Lessons</h1>
      <p className="mt-1 text-sm text-slate-500">
        Work through course lessons at your own pace.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {courses.map((c) => (
          <button
            key={c.code}
            onClick={() => selectCourse(c.code)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              activeCourseCode === c.code
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {c.code}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-3 lg:col-span-1">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-medium text-slate-500">
              {activeCourse.title}
            </p>
            <p className="text-xs text-slate-400">
              {completedCount}/{activeCourse.lessons.length}
            </p>
          </div>
          <div className="mt-2 space-y-1">
            {activeCourse.lessons.map((lesson) => {
              const done = completionByLesson[lesson.id];
              const active = lesson.id === activeLessonId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                        done
                          ? active
                            ? "border-white bg-white text-slate-900"
                            : "border-green-600 bg-green-600 text-white"
                          : active
                          ? "border-white/50"
                          : "border-slate-300"
                      }`}
                    >
                      {done ? "✓" : ""}
                    </span>
                    {lesson.title}
                  </span>
                  <span
                    className={`text-xs ${
                      active ? "text-white/70" : "text-slate-400"
                    }`}
                  >
                    {lesson.duration}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-6 lg:col-span-2">
          {activeLesson ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {activeCourse.code} · {activeLesson.duration}
                  </p>
                  <h2 className="mt-1 text-lg font-medium text-slate-900">
                    {activeLesson.title}
                  </h2>
                </div>
                <button
                  onClick={() => toggleComplete(activeLesson.id)}
                  className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium ${
                    completionByLesson[activeLesson.id]
                      ? "border border-slate-300 text-slate-600 hover:bg-slate-100"
                      : "bg-slate-900 text-white hover:bg-slate-700"
                  }`}
                >
                  {completionByLesson[activeLesson.id]
                    ? "Mark as Incomplete"
                    : "Mark as Complete"}
                </button>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                {activeLesson.content}
              </p>

              <div className="mt-6 flex justify-between border-t border-slate-100 pt-4">
                <button
                  onClick={() => {
                    const idx = activeCourse.lessons.findIndex(
                      (l) => l.id === activeLessonId
                    );
                    if (idx > 0) setActiveLessonId(activeCourse.lessons[idx - 1].id);
                  }}
                  disabled={activeCourse.lessons[0]?.id === activeLessonId}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
                >
                  ← Previous Lesson
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
                    activeCourse.lessons[activeCourse.lessons.length - 1]
                      ?.id === activeLessonId
                  }
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
                >
                  Next Lesson →
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">
              No lessons available for this course yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
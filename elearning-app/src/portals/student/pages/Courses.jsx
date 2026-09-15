import { useState } from "react";

const initialEnrolledCourses = [
  {
    id: 1,
    code: "CSC101",
    title: "Introduction to Programming",
    lecturer: "Dr. A. Obi",
    progress: 65,
    lessonsCompleted: 13,
    totalLessons: 20,
  },
  {
    id: 2,
    code: "MTH201",
    title: "Calculus II",
    lecturer: "Prof. F. Adeyemi",
    progress: 40,
    lessonsCompleted: 6,
    totalLessons: 15,
  },
  {
    id: 3,
    code: "ENG150",
    title: "Technical Writing",
    lecturer: "Mrs. C. Nwosu",
    progress: 100,
    lessonsCompleted: 10,
    totalLessons: 10,
  },
];

const availableCourses = [
  {
    id: 4,
    code: "PHY102",
    title: "General Physics II",
    lecturer: "Dr. K. Musa",
    lessons: 18,
  },
  {
    id: 5,
    code: "CSC205",
    title: "Data Structures",
    lecturer: "Dr. A. Obi",
    lessons: 22,
  },
];

function ProgressBar({ value }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-slate-900"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function Courses() {
  const [enrolled, setEnrolled] = useState(initialEnrolledCourses);
  const [available, setAvailable] = useState(availableCourses);
  const [search, setSearch] = useState("");

  const filteredEnrolled = enrolled.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

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
      },
    ]);
  }

  return (
    <div>
      <h1 className="text-lg font-medium text-slate-900">Courses</h1>
      <p className="mt-1 text-sm text-slate-500">
        Track progress on your enrolled courses, or enroll in new ones.
      </p>

      <div className="mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your courses..."
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEnrolled.length === 0 && (
          <p className="col-span-full rounded-lg border border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
            No enrolled courses match your search.
          </p>
        )}
        {filteredEnrolled.map((course) => (
          <div
            key={course.id}
            className="rounded-lg border border-slate-200 p-4 hover:border-slate-300"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {course.code}
              </span>
              {course.progress === 100 && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  Completed
                </span>
              )}
            </div>
            <p className="mt-2 font-medium text-slate-900">{course.title}</p>
            <p className="mt-1 text-sm text-slate-500">{course.lecturer}</p>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {course.lessonsCompleted}/{course.totalLessons} lessons
                </span>
                <span>{course.progress}%</span>
              </div>
              <div className="mt-1">
                <ProgressBar value={course.progress} />
              </div>
            </div>

            <button className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              {course.progress === 0 ? "Start Course" : "Continue Learning"}
            </button>
          </div>
        ))}
      </div>

      {available.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-medium text-slate-900">
            Available Courses
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Courses you're eligible to enroll in.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((course) => (
              <div
                key={course.id}
                className="rounded-lg border border-dashed border-slate-300 p-4"
              >
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {course.code}
                </span>
                <p className="mt-2 font-medium text-slate-900">{course.title}</p>
                <p className="mt-1 text-sm text-slate-500">{course.lecturer}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {course.lessons} lessons
                </p>
                <button
                  onClick={() => handleEnroll(course)}
                  className="mt-4 w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
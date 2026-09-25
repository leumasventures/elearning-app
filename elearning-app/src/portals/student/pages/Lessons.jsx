import { useMemo, useRef, useState } from "react";

const courses = [
  {
    code: "CSC101",
    title: "Introduction to Programming",
    lessons: [
      {
        id: "csc101-1",
        title: "What is Programming?",
        duration: "12 min",
        completed: false,
        // Sample public domain / demo video (Big Buck Bunny)
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        posterUrl: "",
        content:
          "Programming is the process of writing instructions that a computer can execute. Watch the video, then review the notes below.",
      },
      {
        id: "csc101-2",
        title: "Variables and Data Types",
        duration: "18 min",
        completed: false,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        content:
          "Variables store values. Learn common data types such as numbers, strings, and booleans.",
      },
      {
        id: "csc101-3",
        title: "Control Flow",
        duration: "20 min",
        completed: false,
        videoUrl: "",
        content:
          "Control flow lets your program make decisions and repeat work. (No video for this lesson yet.)",
      },
    ],
  },
  {
    code: "WEBDEV-D",
    title: "Diploma in Web Development",
    lessons: [
      {
        id: "web-1",
        title: "HTML Foundations",
        duration: "15 min",
        completed: true,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        content:
          "HTML structures web pages. Tags, elements, attributes, and a simple document outline.",
      },
      {
        id: "web-2",
        title: "CSS Layout Basics",
        duration: "22 min",
        completed: false,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        content:
          "CSS box model, flexbox, and responsive layout fundamentals.",
      },
    ],
  },
];

function matchesQuery(course, query) {
  if (!query?.trim()) return true;
  const q = query.trim().toLowerCase();
  if (course.code.toLowerCase().includes(q)) return true;
  if (course.title.toLowerCase().includes(q)) return true;
  return course.lessons.some((l) => l.title.toLowerCase().includes(q));
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Lesson video player */
function LessonVideoPlayer({ src, poster, title }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  if (!src) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
          </svg>
        </div>
        <p className="mt-3 text-sm font-medium text-slate-600">No video for this lesson</p>
        <p className="mt-1 text-xs text-slate-400">Content notes are available below.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center rounded-xl bg-slate-900 text-center text-white">
        <p className="text-sm font-medium">Could not load video</p>
        <p className="mt-1 text-xs text-slate-400">Check the video URL or try again later.</p>
      </div>
    );
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  function onSeek(e) {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * duration;
    setCurrent(v.currentTime);
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-xl bg-slate-950 shadow-lg ring-1 ring-slate-200/80">
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          key={src}
          className="h-full w-full object-contain"
          src={src}
          poster={poster || undefined}
          playsInline
          preload="metadata"
          onTimeUpdate={() => setCurrent(videoRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => setError(true)}
          onClick={togglePlay}
          aria-label={title || "Lesson video"}
        />

        {/* Center play overlay when paused */}
        {!playing && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/25 transition hover:bg-black/35"
            aria-label="Play video"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-indigo-600 shadow-xl">
              <svg className="ml-0.5 h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-2 bg-slate-900 px-3 py-2.5 text-white">
        <button
          type="button"
          className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700"
          onClick={onSeek}
          aria-label="Seek"
        >
          <div
            className="h-full rounded-full bg-indigo-500 transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <span className="text-xs tabular-nums text-slate-300">
            {formatTime(current)} / {formatTime(duration)}
          </span>
          <span className="ml-auto truncate text-xs text-slate-400">{title}</span>
        </div>
      </div>
    </div>
  );
}

export default function Lessons() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(
    () => courses.filter((c) => matchesQuery(c, searchQuery)),
    [searchQuery]
  );

  const [activeCourseCode, setActiveCourseCode] = useState(
    courses[0]?.code ?? null
  );

  const activeCourseCodeSafe = filteredCourses.some(
    (c) => c.code === activeCourseCode
  )
    ? activeCourseCode
    : filteredCourses[0]?.code ?? null;

  const activeCourse =
    filteredCourses.find((c) => c.code === activeCourseCodeSafe) ?? null;

  const [activeLessonId, setActiveLessonId] = useState(
    courses[0]?.lessons[0]?.id ?? null
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

  const lessons = activeCourse?.lessons ?? [];
  const activeLesson =
    lessons.find((l) => l.id === activeLessonId) ?? lessons[0] ?? null;

  function selectCourse(code) {
    setActiveCourseCode(code);
    const course = courses.find((c) => c.code === code);
    setActiveLessonId(course?.lessons[0]?.id ?? null);
  }

  function toggleComplete(lessonId) {
    setCompletionByLesson((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  }

  const completedCount = lessons.filter((l) => completionByLesson[l.id]).length;
  const progressPct =
    lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const totalCompleted = Object.values(completionByLesson).filter(Boolean)
    .length;

  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
        <p className="text-sm font-medium text-slate-600">No courses yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-100">Student portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Lessons</h1>
            <p className="mt-1 text-sm text-indigo-100/90">
              Watch videos and work through lessons at your own pace.
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

      {/* Search + tabs */}
      <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by code, title, or lesson…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filteredCourses.map((c) => {
            const done = c.lessons.filter((l) => completionByLesson[l.id]).length;
            const active = activeCourseCodeSafe === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => selectCourse(c.code)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {c.code}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active ? "bg-white/20" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {done}/{c.lessons.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {!activeCourse ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">
          No matching courses.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Sidebar lesson list */}
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm lg:col-span-1">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/40 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">
                {activeCourse.title}
              </p>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>
                  {completedCount}/{lessons.length} completed
                </span>
                <span className="font-semibold text-indigo-600">{progressPct}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <div className="space-y-1 p-2">
              {lessons.map((lesson, index) => {
                const done = completionByLesson[lesson.id];
                const active = lesson.id === activeLesson?.id;
                return (
                  <button
                    key={lesson.id}
                    type="button"
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
                      {done ? "✓" : index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{lesson.title}</p>
                      <p className={`text-xs ${active ? "text-indigo-200" : "text-slate-400"}`}>
                        {lesson.duration}
                        {lesson.videoUrl ? " · Video" : ""}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content + video */}
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm lg:col-span-2">
            {activeLesson ? (
              <>
                <div className="border-b border-slate-100 px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                          {activeCourse.code}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          {activeLesson.duration}
                        </span>
                        {completionByLesson[activeLesson.id] && (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                            Completed
                          </span>
                        )}
                      </div>
                      <h2 className="mt-2 text-lg font-semibold text-slate-900">
                        {activeLesson.title}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleComplete(activeLesson.id)}
                      className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        completionByLesson[activeLesson.id]
                          ? "border border-slate-200 bg-white text-slate-600"
                          : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                      }`}
                    >
                      {completionByLesson[activeLesson.id]
                        ? "Mark as Incomplete"
                        : "Mark as Complete"}
                    </button>
                  </div>
                </div>

                <div className="space-y-5 px-6 py-5">
                  {/* Video player */}
                  <LessonVideoPlayer
                    key={activeLesson.id}
                    src={activeLesson.videoUrl}
                    poster={activeLesson.posterUrl}
                    title={activeLesson.title}
                  />

                  {/* Notes */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Lesson notes
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {activeLesson.content}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      const idx = lessons.findIndex((l) => l.id === activeLesson.id);
                      if (idx > 0) setActiveLessonId(lessons[idx - 1].id);
                    }}
                    disabled={lessons[0]?.id === activeLesson.id}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const idx = lessons.findIndex((l) => l.id === activeLesson.id);
                      if (idx < lessons.length - 1)
                        setActiveLessonId(lessons[idx + 1].id);
                    }}
                    disabled={lessons[lessons.length - 1]?.id === activeLesson.id}
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="px-6 py-16 text-center text-sm text-slate-500">
                Select a lesson.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
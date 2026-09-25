import { useState, useEffect, useCallback } from "react";

const initialExams = [];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function ExamTaking({ exam, onSubmit, onExit }) {
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const submit = useCallback(() => {
    let score = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) score += 1;
    });
    onSubmit(score);
  }, [answers, exam.questions, onSubmit]);

  useEffect(() => {
    if (timeLeft <= 0) {
      submit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submit]);

  const question = exam.questions[current];
  const answeredCount = Object.keys(answers).length;
  const lowTime = timeLeft <= 60;
  const progress =
    exam.questions.length > 0
      ? Math.round((answeredCount / exam.questions.length) * 100)
      : 0;

  return (
    <div className="space-y-5">
      {/* Exam header bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-5 py-5 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-indigo-100">{exam.course}</p>
            <h1 className="mt-0.5 text-lg font-semibold tracking-tight">{exam.title}</h1>
            <p className="mt-1 text-sm text-indigo-100/90">
              Question {current + 1} of {exam.questions.length} · {answeredCount} answered
            </p>
          </div>
          <div
            className={`rounded-xl px-4 py-2.5 text-center shadow-md ${
              lowTime
                ? "bg-red-500 text-white animate-pulse"
                : "bg-white/15 text-white backdrop-blur"
            }`}
          >
            <p className="text-[10px] font-medium uppercase tracking-wide opacity-80">
              Time left
            </p>
            <p className="text-xl font-bold tabular-nums">{formatTime(timeLeft)}</p>
          </div>
        </div>
        {/* Answer progress */}
        <div className="relative mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
            {current + 1}
          </span>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Question
          </p>
        </div>
        <p className="mt-3 text-base font-medium leading-relaxed text-slate-900">
          {question.text}
        </p>
        <div className="mt-5 space-y-2.5">
          {question.options.map((opt, i) => {
            const selected = answers[question.id] === i;
            return (
              <label
                key={i}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                  selected
                    ? "border-indigo-300 bg-indigo-50 ring-2 ring-indigo-500/20 text-indigo-900"
                    : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40 text-slate-700"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    selected
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <input
                  type="radio"
                  name={question.id}
                  checked={selected}
                  onChange={() =>
                    setAnswers((prev) => ({ ...prev, [question.id]: i }))
                  }
                  className="sr-only"
                />
                <span className="font-medium">{opt}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <button
            onClick={() =>
              setCurrent((c) => Math.min(exam.questions.length - 1, c + 1))
            }
            disabled={current === exam.questions.length - 1}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            Next
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => setConfirmSubmit(true)}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-violet-700"
        >
          Submit Exam
        </button>
      </div>

      {/* Question map */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Question map
        </p>
        <div className="flex flex-wrap gap-2">
          {exam.questions.map((q, i) => {
            const isCurrent = i === current;
            const isAnswered = answers[q.id] !== undefined;
            return (
              <button
                key={q.id}
                onClick={() => setCurrent(i)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition ${
                  isCurrent
                    ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md"
                    : isAnswered
                    ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-gradient-to-br from-indigo-600 to-violet-600" />
            Current
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-emerald-100 ring-1 ring-emerald-200" />
            Answered
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-slate-100" />
            Unanswered
          </span>
        </div>
      </div>

      {/* Confirm modal */}
      {confirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white">
              <h2 className="text-base font-semibold">Submit exam?</h2>
              <p className="mt-0.5 text-sm text-indigo-100">
                You've answered {answeredCount} of {exam.questions.length}{" "}
                questions. This cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 bg-slate-50/80 px-5 py-4">
              <button
                onClick={() => setConfirmSubmit(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Keep Working
              </button>
              <button
                onClick={submit}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-violet-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onExit}
        className="text-xs font-medium text-slate-400 transition hover:text-slate-600"
      >
        ← Exit without submitting (progress will be lost)
      </button>
    </div>
  );
}

export default function CBTExams() {
  const [exams, setExams] = useState(initialExams);
  const [activeExamId, setActiveExamId] = useState(null);
  const [justFinishedScore, setJustFinishedScore] = useState(null);

  const activeExam = exams.find((e) => e.id === activeExamId);

  const availableCount = exams.filter(
    (e) => e.status === "Available" && !e.attempted
  ).length;
  const completedCount = exams.filter((e) => e.attempted).length;

  function startExam(id) {
    setJustFinishedScore(null);
    setActiveExamId(id);
  }

  function handleFinish(score) {
    setExams((prev) =>
      prev.map((e) =>
        e.id === activeExamId
          ? { ...e, status: "Closed", attempted: true, score }
          : e
      )
    );
    setJustFinishedScore(score);
    setActiveExamId(null);
  }

  if (activeExam) {
    return (
      <ExamTaking
        exam={activeExam}
        onSubmit={handleFinish}
        onExit={() => setActiveExamId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-indigo-100">Student portal</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">CBT Exams</h1>
          <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
            Take available exams and review your past results.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-indigo-700/80">Total Exams</p>
              <p className="mt-1.5 text-2xl font-bold text-indigo-900">{exams.length}</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 p-2 text-white shadow-md">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-emerald-700/80">Available</p>
              <p className="mt-1.5 text-2xl font-bold text-emerald-900">{availableCount}</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-2 text-white shadow-md">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-slate-600/80">Completed</p>
              <p className="mt-1.5 text-2xl font-bold text-slate-800">{completedCount}</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-slate-500 to-slate-700 p-2 text-white shadow-md">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Success banner */}
      {justFinishedScore !== null && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800 shadow-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Exam submitted successfully</p>
            <p className="mt-0.5 text-emerald-700">
              You scored {justFinishedScore} question
              {justFinishedScore !== 1 ? "s" : ""} correct.
            </p>
          </div>
        </div>
      )}

      {/* Exam list */}
      <div className="space-y-3">
        {exams.map((exam) => {
          const canStart = exam.status === "Available" && !exam.attempted;
          return (
            <div
              key={exam.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                    {exam.course}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {exam.duration} min
                  </span>
                  {exam.questions.length > 0 && (
                    <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-violet-100">
                      {exam.questions.length} questions
                    </span>
                  )}
                  {exam.attempted && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                      Completed
                    </span>
                  )}
                  {!exam.attempted && exam.status === "Closed" && (
                    <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-red-100">
                      Closed
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{exam.title}</p>
                {exam.attempted && exam.score !== null && (
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Your score: {exam.score}
                  </p>
                )}
              </div>
              {canStart ? (
                <button
                  onClick={() => startExam(exam.id)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-violet-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Exam
                </button>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                  {exam.attempted ? "Completed" : "Closed"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
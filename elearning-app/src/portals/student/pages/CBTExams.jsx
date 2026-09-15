import { useState, useEffect, useCallback } from "react";

const initialExams = [
  {
    id: 1,
    title: "Mid-Semester Test",
    course: "CSC101",
    duration: 5, // minutes, short for demo purposes
    status: "Available",
    attempted: false,
    score: null,
    questions: [
      {
        id: "q1",
        text: "Which of the following is not a programming language?",
        options: ["Python", "Java", "HTML", "Photoshop"],
        correctIndex: 3,
      },
      {
        id: "q2",
        text: "What does 'CPU' stand for?",
        options: [
          "Central Process Unit",
          "Central Processing Unit",
          "Computer Personal Unit",
          "Central Processor Utility",
        ],
        correctIndex: 1,
      },
      {
        id: "q3",
        text: "In JavaScript, which keyword declares a constant?",
        options: ["var", "let", "const", "define"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 2,
    title: "First Semester Final",
    course: "ENG150",
    duration: 30,
    status: "Closed",
    attempted: true,
    score: 18,
    questions: [],
  },
];

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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <div>
          <h1 className="text-lg font-medium text-slate-900">{exam.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Question {current + 1} of {exam.questions.length} · {answeredCount} answered
          </p>
        </div>
        <div
          className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
            lowTime ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
          }`}
        >
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 p-6">
        <p className="text-xs font-medium text-slate-500">
          Question {current + 1}
        </p>
        <p className="mt-2 text-base font-medium text-slate-900">
          {question.text}
        </p>
        <div className="mt-4 space-y-2">
          {question.options.map((opt, i) => (
            <label
              key={i}
              className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm ${
                answers[question.id] === i
                  ? "border-slate-900 bg-slate-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                checked={answers[question.id] === i}
                onChange={() =>
                  setAnswers((prev) => ({ ...prev, [question.id]: i }))
                }
                className="h-4 w-4"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrent((c) => Math.min(exam.questions.length - 1, c + 1))
            }
            disabled={current === exam.questions.length - 1}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40"
          >
            Next
          </button>
        </div>
        <button
          onClick={() => setConfirmSubmit(true)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Submit Exam
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {exam.questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrent(i)}
            className={`h-8 w-8 rounded-md text-xs font-medium ${
              i === current
                ? "bg-slate-900 text-white"
                : answers[q.id] !== undefined
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {confirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-5">
            <h2 className="text-sm font-medium text-slate-900">
              Submit exam?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              You've answered {answeredCount} of {exam.questions.length}{" "}
              questions. This cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmSubmit(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Keep Working
              </button>
              <button
                onClick={submit}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onExit}
        className="mt-4 text-xs text-slate-400 hover:text-slate-600"
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
    <div>
      <h1 className="text-lg font-medium text-slate-900">CBT Exams</h1>
      <p className="mt-1 text-sm text-slate-500">
        Take available exams and review your past results.
      </p>

      {justFinishedScore !== null && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Exam submitted. You scored {justFinishedScore} question
          {justFinishedScore !== 1 ? "s" : ""} correct.
        </div>
      )}

      <div className="mt-6 space-y-3">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4"
          >
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                  {exam.course}
                </span>
                <span>{exam.duration} min</span>
                <span>· {exam.questions.length || "—"} questions</span>
              </div>
              <p className="mt-1 font-medium text-slate-900">{exam.title}</p>
              {exam.attempted && exam.score !== null && (
                <p className="mt-1 text-sm text-slate-600">
                  Your score: {exam.score}
                </p>
              )}
            </div>
            {exam.status === "Available" && !exam.attempted ? (
              <button
                onClick={() => startExam(exam.id)}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Start Exam
              </button>
            ) : (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                {exam.attempted ? "Completed" : "Closed"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
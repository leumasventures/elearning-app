import { useEffect, useState } from "react";
import { getExam, getExams, submitExam } from "../../../lib/api";

export default function CBTExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeExam, setActiveExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const list = await getExams();
        setExams(
          list.filter((e) => e.status === "Active" || e.status === "Scheduled")
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load exams");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function startExam(exam) {
    setError("");
    setResult(null);
    try {
      const data = await getExam(exam.id);
      setActiveExam(data.exam);
      setQuestions(data.questions || []);
      setAnswers({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open exam");
    }
  }

  function selectAnswer(questionId, index) {
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  }

  async function handleSubmit() {
    if (!activeExam) return;
    if (
      !confirm(
        "Submit answers? Scoring is calculated on the server and stored in the database."
      )
    )
      return;
    setSubmitting(true);
    setError("");
    try {
      const res = await submitExam(activeExam.id, answers);
      setResult(res);
      setActiveExam(null);
      setQuestions([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-500">Loading exams from database…</p>
      </div>
    );
  }

  if (activeExam) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {activeExam.title}
            </h1>
            <p className="text-sm text-slate-500">
              Duration: {activeExam.durationMinutes} minutes · Answers scored in
              DB
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveExam(null);
                setQuestions([]);
              }}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium"
            >
              Exit
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit exam"}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-900">
                {idx + 1}. {q.text}
              </p>
              <div className="mt-3 space-y-2">
                {(q.options || []).map((opt, i) => (
                  <label
                    key={i}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
                      answers[q.id] === i
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === i}
                      onChange={() => selectAnswer(q.id, i)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">CBT Exams</h1>
        <p className="text-sm text-slate-500">
          Take exams; scores are written to the results table.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="font-semibold text-emerald-900">Exam submitted</p>
          <p className="mt-1 text-sm text-emerald-800">
            Score: {result.score}/{result.total} (
            {result.percent ??
              Math.round((result.score / (result.total || 1)) * 100)}
            %)
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {exams.length === 0 ? (
          <p className="col-span-full py-12 text-center text-slate-500">
            No scheduled or active exams in the database.
          </p>
        ) : (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-slate-900">{exam.title}</h2>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  {exam.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {exam.courseCode || "Course"} · {exam.durationMinutes} min ·{" "}
                {exam.questionCount ?? exam.questionIds?.length ?? 0} questions
              </p>
              <button
                onClick={() => startExam(exam)}
                disabled={exam.status === "Closed"}
                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Start exam
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

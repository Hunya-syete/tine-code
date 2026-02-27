import type { Quiz } from "@/lib/api";

export function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{quiz.title}</h2>
      <p className="mt-2 text-sm text-slate-600">{quiz.description}</p>
      <div className="mt-4 flex gap-4 text-sm text-slate-700">
        <span>⏱ {quiz.duration_minutes} min</span>
        <span>❓ {quiz.total_questions} questions</span>
      </div>
      <button className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
        Start Exam
      </button>
    </article>
  );
}

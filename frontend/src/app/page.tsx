import Link from "next/link";

import { QuizCard } from "@/components/quiz-card";
import { fetchQuizzes } from "@/lib/api";

export default async function Home() {
  let quizzes = [];
  let error = "";

  try {
    quizzes = await fetchQuizzes();
  } catch {
    error = "Could not connect to Laravel API. Make sure backend is running.";
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-wide text-indigo-600">Classroom Portal</p>
        <h1 className="text-3xl font-bold">Online Quiz / Exam Website</h1>
        <p className="mt-2 text-slate-600">Take class exams online with auto-graded objective questions.</p>
        <Link
          href="/attendance"
          className="mt-4 inline-flex rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Open QR Attendance App
        </Link>
      </header>

      {error ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-700">{error}</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </section>
      )}
    </main>
  );
}

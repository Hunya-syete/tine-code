export interface Quiz {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_questions: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export async function fetchQuizzes(): Promise<Quiz[]> {
  const response = await fetch(`${API_BASE}/quizzes`, {
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("Unable to load quizzes");
  }

  const body = await response.json();
  return body.data ?? [];
}

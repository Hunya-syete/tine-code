<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AttemptController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_name' => ['required', 'string', 'max:120'],
            'quiz_id' => ['required', 'integer'],
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', 'integer'],
            'answers.*.selected_option' => ['required', 'string'],
        ]);

        $quiz = $this->quizById((int) $validated['quiz_id']);

        if ($quiz === null) {
            throw ValidationException::withMessages([
                'quiz_id' => ['Unknown quiz.'],
            ]);
        }

        /** @var array<int, string> $answerKey */
        $answerKey = collect($quiz['questions'])
            ->mapWithKeys(fn (array $question): array => [
                (int) $question['id'] => (string) $question['correct_option'],
            ])
            ->all();

        $score = collect($validated['answers'])
            ->unique('question_id')
            ->filter(function (array $answer) use ($answerKey): bool {
                $questionId = (int) $answer['question_id'];
                $selectedOption = (string) $answer['selected_option'];

                return array_key_exists($questionId, $answerKey)
                    && $answerKey[$questionId] === $selectedOption;
            })
            ->count();

        return response()->json([
            'message' => 'Attempt submitted successfully.',
            'student_name' => $validated['student_name'],
            'quiz_id' => $validated['quiz_id'],
            'score' => $score,
        ], 201);
    }

    private function quizById(int $quizId): ?array
    {
        $quizzes = config('quizzes', []);

        foreach ($quizzes as $quiz) {
            if ((int) ($quiz['id'] ?? 0) === $quizId) {
                return $quiz;
            }
        }

        return null;
    }
}

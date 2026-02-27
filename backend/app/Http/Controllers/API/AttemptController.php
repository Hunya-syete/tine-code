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

        $answerKey = $this->answerKeyForQuiz((int) $validated['quiz_id']);

        if ($answerKey === []) {
            throw ValidationException::withMessages([
                'quiz_id' => ['Unknown quiz.'],
            ]);
        }

        $score = collect($validated['answers'])
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

    /**
     * @return array<int, string>
     */
    private function answerKeyForQuiz(int $quizId): array
    {
        $answerKeys = [
            1 => [
                101 => 'B',
                102 => 'D',
                103 => 'A',
                104 => 'C',
            ],
            2 => [
                201 => 'C',
                202 => 'A',
                203 => 'B',
                204 => 'D',
            ],
        ];

        return $answerKeys[$quizId] ?? [];
    }
}

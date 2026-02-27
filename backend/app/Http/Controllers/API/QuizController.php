<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class QuizController extends Controller
{
    public function index(): JsonResponse
    {
        $quizzes = collect(config('quizzes', []))
            ->map(function (array $quiz): array {
                return [
                    'id' => (int) $quiz['id'],
                    'title' => (string) $quiz['title'],
                    'description' => (string) $quiz['description'],
                    'duration_minutes' => (int) $quiz['duration_minutes'],
                    'total_questions' => count($quiz['questions'] ?? []),
                ];
            })
            ->values();

        return response()->json([
            'data' => $quizzes,
        ]);
    }
}

<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class QuizController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                [
                    'id' => 1,
                    'title' => 'Mathematics Midterm',
                    'description' => 'Algebra and geometry multiple-choice quiz.',
                    'duration_minutes' => 45,
                    'total_questions' => 30,
                ],
                [
                    'id' => 2,
                    'title' => 'Science Unit Test',
                    'description' => 'Physics and chemistry concepts for class exam.',
                    'duration_minutes' => 35,
                    'total_questions' => 25,
                ],
            ],
        ]);
    }
}

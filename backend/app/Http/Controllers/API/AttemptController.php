<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttemptController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_name' => ['required', 'string', 'max:120'],
            'quiz_id' => ['required', 'integer'],
            'answers' => ['required', 'array'],
        ]);

        $score = collect($validated['answers'])->filter(fn ($answer) => ($answer['is_correct'] ?? false) === true)->count();

        return response()->json([
            'message' => 'Attempt submitted successfully.',
            'student_name' => $validated['student_name'],
            'quiz_id' => $validated['quiz_id'],
            'score' => $score,
        ], 201);
    }
}

<?php

use App\Http\Controllers\API\AttemptController;
use App\Http\Controllers\API\QuizController;
use Illuminate\Support\Facades\Route;

Route::get('/quizzes', [QuizController::class, 'index']);
Route::post('/attempts', [AttemptController::class, 'store']);

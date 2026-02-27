<?php

use App\Http\Controllers\API\ResumeController;
use Illuminate\Support\Facades\Route;

Route::get('/resume', [ResumeController::class, 'show']);

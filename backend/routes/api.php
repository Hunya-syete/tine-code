<?php

use App\Http\Controllers\API\AttendanceController;
use App\Http\Controllers\API\ResumeController;
use Illuminate\Support\Facades\Route;

Route::get('/resume', [ResumeController::class, 'show']);

Route::post('/auth/login', [AttendanceController::class, 'login']);
Route::get('/attendance/qr', [AttendanceController::class, 'issueQr']);
Route::post('/attendance/scan', [AttendanceController::class, 'scan']);
Route::get('/attendance/logs', [AttendanceController::class, 'logs']);

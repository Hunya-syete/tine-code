<?php

return [
    'class_code' => env('ATTENDANCE_CLASS_CODE', 'CS-101'),
    'token_ttl_seconds' => (int) env('ATTENDANCE_TOKEN_TTL_SECONDS', 120),
    'present_grace_minutes' => (int) env('ATTENDANCE_PRESENT_GRACE_MINUTES', 10),
    'schedule_start' => env('ATTENDANCE_SCHEDULE_START', now()->startOfHour()->toIso8601String()),
    'users' => [
        [
            'username' => env('ATTENDANCE_TEACHER_USERNAME', 'teacher'),
            'password' => env('ATTENDANCE_TEACHER_PASSWORD', 'teacher123'),
            'role' => 'teacher',
        ],
    ],
];

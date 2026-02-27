<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AttendanceController extends Controller
{
    private const AUTH_CACHE_PREFIX = 'attendance:auth:';
    private const LOG_CACHE_KEY = 'attendance:logs';
    private const LOG_LIMIT = 100;

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'max:120'],
            'password' => ['required', 'string', 'max:120'],
        ]);

        $user = collect(config('attendance.users', []))
            ->first(fn (array $candidate): bool =>
                ($candidate['username'] ?? null) === $validated['username']
                && ($candidate['password'] ?? null) === $validated['password']
            );

        if (! is_array($user)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $token = Str::random(48);
        Cache::put(self::AUTH_CACHE_PREFIX.$token, [
            'username' => $user['username'],
            'role' => $user['role'] ?? 'student',
        ], now()->addHours(8));

        return response()->json([
            'token' => $token,
            'username' => $user['username'],
            'role' => $user['role'] ?? 'student',
            'expires_at' => now()->addHours(8)->toIso8601String(),
        ]);
    }

    public function issueQr(Request $request): JsonResponse
    {
        $auth = $this->requireAuth($request);
        if ($auth instanceof JsonResponse) {
            return $auth;
        }

        $settings = config('attendance');
        $now = CarbonImmutable::now();
        $expiresAt = $now->addSeconds((int) ($settings['token_ttl_seconds'] ?? 120));

        $payload = [
            'class_code' => (string) ($settings['class_code'] ?? 'CS-101'),
            'issued_at' => $now->toIso8601String(),
            'expires_at' => $expiresAt->toIso8601String(),
            'nonce' => Str::uuid()->toString(),
        ];

        $encodedPayload = base64_encode((string) json_encode($payload));
        $signature = hash_hmac('sha256', $encodedPayload, (string) config('app.key'));

        return response()->json([
            'token' => $encodedPayload.'.'.$signature,
            'payload' => $payload,
        ]);
    }

    public function scan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_name' => ['required', 'string', 'max:120'],
            'student_id' => ['required', 'string', 'max:60'],
            'qr_token' => ['required', 'string'],
        ]);

        $tokenParts = explode('.', $validated['qr_token']);
        if (count($tokenParts) !== 2) {
            return response()->json(['message' => 'Malformed QR token.'], 422);
        }

        [$encodedPayload, $signature] = $tokenParts;
        $expectedSignature = hash_hmac('sha256', $encodedPayload, (string) config('app.key'));
        if (! hash_equals($expectedSignature, $signature)) {
            return response()->json(['message' => 'Invalid QR signature.'], 422);
        }

        $payload = json_decode((string) base64_decode($encodedPayload, true), true);
        if (! is_array($payload)) {
            return response()->json(['message' => 'Invalid QR payload.'], 422);
        }

        $now = CarbonImmutable::now();
        $expiresAt = CarbonImmutable::parse((string) ($payload['expires_at'] ?? $now->toIso8601String()));
        if ($now->greaterThan($expiresAt)) {
            return response()->json(['message' => 'QR token already expired.'], 422);
        }

        $scheduleStart = CarbonImmutable::parse((string) config('attendance.schedule_start', $now->startOfHour()->toIso8601String()));
        $graceMinutes = (int) config('attendance.present_grace_minutes', 10);
        $status = $now->lessThanOrEqualTo($scheduleStart->addMinutes($graceMinutes)) ? 'Present' : 'Late';

        $entry = [
            'student_name' => $validated['student_name'],
            'student_id' => $validated['student_id'],
            'status' => $status,
            'class_code' => (string) ($payload['class_code'] ?? config('attendance.class_code', 'CS-101')),
            'scanned_at' => $now->toIso8601String(),
            'qr_expires_at' => $expiresAt->toIso8601String(),
        ];

        $this->appendAuditLog($entry);

        return response()->json([
            'message' => 'Attendance recorded.',
            'data' => $entry,
        ], 201);
    }

    public function logs(Request $request): JsonResponse
    {
        $auth = $this->requireAuth($request);
        if ($auth instanceof JsonResponse) {
            return $auth;
        }

        return response()->json([
            'data' => Cache::get(self::LOG_CACHE_KEY, []),
        ]);
    }

    private function requireAuth(Request $request): array|JsonResponse
    {
        $header = (string) $request->header('Authorization', '');
        if (! str_starts_with($header, 'Bearer ')) {
            return response()->json(['message' => 'Missing bearer token.'], 401);
        }

        $token = Str::after($header, 'Bearer ');
        $session = Cache::get(self::AUTH_CACHE_PREFIX.$token);
        if (! is_array($session)) {
            return response()->json(['message' => 'Invalid or expired session token.'], 401);
        }

        return $session;
    }

    private function appendAuditLog(array $entry): void
    {
        $logs = Cache::get(self::LOG_CACHE_KEY, []);
        if (! is_array($logs)) {
            $logs = [];
        }

        array_unshift($logs, $entry);
        $logs = array_slice($logs, 0, self::LOG_LIMIT);

        Cache::put(self::LOG_CACHE_KEY, $logs, now()->addDay());
        Log::channel('daily')->info('attendance.scan', $entry);
    }
}

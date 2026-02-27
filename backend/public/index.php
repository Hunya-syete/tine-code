<?php

declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($method === 'GET' && $uri === '/api/resume') {
    header('Content-Type: application/json; charset=utf-8');

    $resume = require __DIR__ . '/../data/resume.php';
    echo json_encode(['data' => $resume], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
http_response_code(404);
echo json_encode([
    'message' => 'Not Found',
    'path' => $uri,
]);

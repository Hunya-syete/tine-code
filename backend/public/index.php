<?php

declare(strict_types=1);

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

$autoload = __DIR__ . '/../vendor/autoload.php';
$appBootstrap = __DIR__ . '/../bootstrap/app.php';

if (! file_exists($autoload) || ! file_exists($appBootstrap)) {
    http_response_code(503);
    header('Content-Type: application/json');

    echo json_encode([
        'message' => 'Laravel backend is not fully installed. Run composer install and ensure bootstrap files are present.',
    ], JSON_PRETTY_PRINT);

    return;
}

require $autoload;

$app = require_once $appBootstrap;

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);

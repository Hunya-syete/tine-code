<?php

$publicEntrypoint = __DIR__ . '/../public/index.php';

if (! file_exists($publicEntrypoint)) {
    http_response_code(503);
    header('Content-Type: application/json');

    echo json_encode([
        'message' => 'Laravel public entrypoint is missing. Ensure backend/public/index.php exists in the deployment artifact.',
    ], JSON_PRETTY_PRINT);

    return;
}

require $publicEntrypoint;

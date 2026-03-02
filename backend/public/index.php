<?php

declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function respondJson(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function inventoryFilePath(): string
{
    return __DIR__ . '/../data/inventory-db.json';
}

function seedInventoryPath(): string
{
    return __DIR__ . '/../data/inventory.php';
}

function loadInventory(): array
{
    $filePath = inventoryFilePath();

    if (!file_exists($filePath)) {
        $seed = require seedInventoryPath();
        file_put_contents($filePath, json_encode($seed, JSON_PRETTY_PRINT));
        return $seed;
    }

    $contents = file_get_contents($filePath);

    if ($contents === false) {
        return [];
    }

    $decoded = json_decode($contents, true);
    return is_array($decoded) ? $decoded : [];
}

function saveInventory(array $items): void
{
    file_put_contents(inventoryFilePath(), json_encode(array_values($items), JSON_PRETTY_PRINT));
}

function requestBody(): array
{
    $rawBody = file_get_contents('php://input');

    if ($rawBody === false || trim($rawBody) === '') {
        return [];
    }

    $decoded = json_decode($rawBody, true);
    return is_array($decoded) ? $decoded : [];
}

function validateItem(array $data): array
{
    $name = trim((string)($data['name'] ?? ''));
    $sku = trim((string)($data['sku'] ?? ''));
    $quantity = (int)($data['quantity'] ?? -1);
    $price = (float)($data['price'] ?? -1);
    $category = trim((string)($data['category'] ?? 'General'));

    $errors = [];

    if ($name === '') {
        $errors['name'] = 'Name is required.';
    }

    if ($sku === '') {
        $errors['sku'] = 'SKU is required.';
    }

    if ($quantity < 0) {
        $errors['quantity'] = 'Quantity must be zero or greater.';
    }

    if ($price < 0) {
        $errors['price'] = 'Price must be zero or greater.';
    }

    if ($errors !== []) {
        respondJson(['message' => 'Validation failed.', 'errors' => $errors], 422);
    }

    return [
        'name' => $name,
        'sku' => strtoupper($sku),
        'quantity' => $quantity,
        'price' => round($price, 2),
        'category' => $category === '' ? 'General' : $category,
    ];
}

if ($method === 'GET' && $uri === '/api/health') {
    respondJson(['status' => 'ok', 'service' => 'inventory-api']);
}

if ($method === 'GET' && $uri === '/api/items') {
    respondJson(['data' => loadInventory()]);
}

if ($method === 'POST' && $uri === '/api/items') {
    $items = loadInventory();
    $validated = validateItem(requestBody());
    $nextId = (int)max(array_column($items, 'id') ?: [0]) + 1;

    $newItem = [
        'id' => $nextId,
        ...$validated,
        'updated_at' => gmdate('c'),
    ];

    $items[] = $newItem;
    saveInventory($items);

    respondJson(['message' => 'Item created.', 'data' => $newItem], 201);
}

if (preg_match('#^/api/items/(\d+)$#', $uri, $matches) === 1) {
    $itemId = (int)$matches[1];
    $items = loadInventory();

    foreach ($items as $index => $item) {
        if ((int)$item['id'] !== $itemId) {
            continue;
        }

        if ($method === 'PUT') {
            $validated = validateItem(requestBody());
            $updated = [
                'id' => $itemId,
                ...$validated,
                'updated_at' => gmdate('c'),
            ];
            $items[$index] = $updated;
            saveInventory($items);
            respondJson(['message' => 'Item updated.', 'data' => $updated]);
        }

        if ($method === 'DELETE') {
            unset($items[$index]);
            saveInventory($items);
            respondJson(['message' => 'Item deleted.']);
        }
    }

    respondJson(['message' => 'Item not found.'], 404);
}

respondJson([
    'message' => 'Not Found',
    'path' => $uri,
], 404);

<?php
// ==============================================================================
// Hostinger PHP Reverse Proxy to Live Render Backend
// Forwards all /api/ requests directly to Render without CORS or cross-domain issues
// ==============================================================================
$backend = 'https://lakshayenterproses.onrender.com';

// Get request URI
$requestUri = $_SERVER['REQUEST_URI'];
if (preg_match('#/api/(.*)$#', $requestUri, $matches)) {
    $targetUrl = $backend . '/api/' . $matches[1];
} else {
    $endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';
    $targetUrl = $backend . '/api/' . ltrim($endpoint, '/');
}

$ch = curl_init($targetUrl);

// Forward method
$method = $_SERVER['REQUEST_METHOD'];
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

// Forward headers
$headers = [];
$incomingHeaders = function_exists('getallheaders') ? getallheaders() : [];
foreach ($incomingHeaders as $name => $value) {
    $lower = strtolower($name);
    if ($lower !== 'host' && $lower !== 'content-length') {
        $headers[] = "$name: $value";
    }
}
// Pass client IP and user headers
if (!empty($_SERVER['HTTP_X_USER_ID'])) {
    $headers[] = 'x-user-id: ' . $_SERVER['HTTP_X_USER_ID'];
}
if (!empty($_SERVER['HTTP_X_ADMIN_AUTH'])) {
    $headers[] = 'x-admin-auth: ' . $_SERVER['HTTP_X_ADMIN_AUTH'];
}

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Forward body
$body = file_get_contents('php://input');
if (!empty($body)) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

// Settings
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

curl_close($ch);

// Output response to client
http_response_code($httpCode ? $httpCode : 200);
if ($contentType) {
    header('Content-Type: ' . $contentType);
} else {
    header('Content-Type: application/json; charset=utf-8');
}
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

echo $response;
exit;

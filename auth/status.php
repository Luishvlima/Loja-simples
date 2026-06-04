<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'logged_in' => !empty($_SESSION['usuario']),
    'user' => $_SESSION['usuario'] ?? null,
], JSON_UNESCAPED_UNICODE);

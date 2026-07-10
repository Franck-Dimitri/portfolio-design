<?php
$logPath = __DIR__ . '/storage/logs/laravel.log';
if (!file_exists($logPath)) {
    echo "No log file found.";
    exit;
}
$lines = file($logPath);
$lastLines = array_slice($lines, -50);
echo implode("", $lastLines);

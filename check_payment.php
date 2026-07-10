<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$payment = \App\Models\Payment::where('status', 'pending')->latest()->first();
if ($payment) {
    echo "Found payment reference: " . $payment->transaction_reference . "\n";
} else {
    echo "No pending payments found.\n";
}

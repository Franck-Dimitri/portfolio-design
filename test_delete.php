<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $pkg = \App\Models\ServicePackage::first();
    if (!$pkg) {
        echo "No package found\n";
        exit;
    }
    echo "Trying to delete package {$pkg->id}...\n";
    $pkg->delete();
    echo "DELETED\n";
} catch (\Exception $e) {
    echo "FAILED: " . $e->getMessage() . "\n";
}

<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

function keepLatest($modelClass, $keepCount) {
    $idsToKeep = $modelClass::latest()->take($keepCount)->pluck('id')->toArray();
    $modelsToDelete = $modelClass::whereNotIn('id', $idsToKeep)->get();
    $count = 0;
    foreach ($modelsToDelete as $model) {
        if ($modelClass === \App\Models\Project::class) {
            foreach ($model->images as $img) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($img->path);
            }
            $model->images()->delete();
        }
        $model->delete();
        $count++;
    }
    echo "Deleted $count records from $modelClass\n";
}

keepLatest(\App\Models\Project::class, 10);
keepLatest(\App\Models\Post::class, 2);
keepLatest(\App\Models\Service::class, 6);
keepLatest(\App\Models\ServicePackage::class, 10);

echo "Cleanup completed successfully!\n";

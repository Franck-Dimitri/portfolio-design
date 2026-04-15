<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/laravel', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return Inertia::render('Home');
});


Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/pages/Dashboard');
})->middleware(['auth', 'verified'], ['role', 'admin'])->name('dashboard');

Route::get('/admin/projects', function () {
    return Inertia::render('Admin/pages/Projet');
})->middleware(['auth', 'verified'], ['role', 'admin'])->name('dashboard');

Route::get('/admin/services', function () {
    return Inertia::render('Admin/pages/Services');
})->middleware(['auth', 'verified'], ['role', 'admin'])->name('dashboard');

Route::get('/admin/blogs', function () {
    return Inertia::render('Admin/pages/Blog');
})->middleware(['auth', 'verified'], ['role', 'admin'])->name('dashboard');

Route::get('/admin/packages', function () {
    return Inertia::render('Admin/pages/Package');
})->middleware(['auth', 'verified'], ['role', 'admin'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

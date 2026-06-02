<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ServiceController;

use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;


use App\Http\Controllers\PublicProjectController;
use App\Http\Controllers\PublicServiceController;


// Route::get('/laravel', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', [HomeController::class, 'index'])->name('home');


Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/pages/Dashboard');
    });

    Route::get('/blogs', function () {
        return Inertia::render('Admin/pages/Blog');
    });

    Route::get('/packages', function () {
        return Inertia::render('Admin/pages/Package');
    });

    Route::resource('projects', ProjectController::class);
    Route::resource('services', ServiceController::class);

});




Route::get('/projects', [PublicProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{slug}', [PublicProjectController::class, 'show'])->name('projects.show');

Route::get('/services', [PublicServiceController::class, 'index'])->name('services.index');
Route::get('/services/{slug}', [PublicServiceController::class, 'show'])->name('services.show');

Route::get('/a-propos', function () {
    return Inertia::render('contact/Propos');
})->name('about');
Route::get('/contact', function () {
    return Inertia::render('contact/Contact');
})->name('contact');
// Route pour le formulaire de contact
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

Route::get('/blog', function () {
    return Inertia::render('blog/Blog');
})->name('blog');

Route::get('/blog/{slug}', function ($slug) {
    return Inertia::render('blog/BlogShow', ['slug' => $slug]);
})->name('blog.show');
// Route pour les projets individuels (slug)
Route::get('/projets/{slug}', function ($slug) {
    return Inertia::render('ProjectShow', ['slug' => $slug]);
})->name('projects.show');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

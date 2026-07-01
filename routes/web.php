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

use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\PublicServiceController;
use App\Http\Controllers\PaymentController;

use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\SouscriptionController;
use App\Http\Controllers\PackagePublicController;
use App\Http\Controllers\CinetPayWebhookController;
 


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
            return Inertia::render('Admin/pages/Packages/Index');
        });

    // Gestion des packs
    Route::resource('packages', PackageController::class)
        ->only(['index', 'store', 'update', 'destroy']);
    Route::patch('packages/{package}/toggle', [PackageController::class, 'toggleActif'])
        ->name('packages.toggle');
 
    // Souscriptions
    Route::get('souscriptions', [SouscriptionController::class, 'index'])
        ->name('souscriptions.index');
    Route::get('souscriptions/{souscription}', [SouscriptionController::class, 'show'])
        ->name('souscriptions.show');
    Route::patch('souscriptions/{souscription}/statut', [SouscriptionController::class, 'updateStatut'])
        ->name('souscriptions.statut');
    Route::post('souscriptions/{souscription}/livrable', [SouscriptionController::class, 'uploadLivrable'])
        ->name('souscriptions.livrable');

    Route::resource('projects', ProjectController::class);
    Route::resource('services', ServiceController::class);

});



    // Route protégée par le middleware auth pour s'assurer que l'utilisateur est connecté
    Route::middleware(['auth'])->group(function () {
        Route::post('/payment/process/{subscription}', [PaymentController::class, 'processPayment'])
            ->name('payment.process');
    });

Route::get('/projects', [PublicProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{slug}', [PublicProjectController::class, 'show'])->name('projects.show');

Route::get('/services', [PublicServiceController::class, 'index'])->name('services.index');
Route::get('/services/{slug}', [PublicServiceController::class, 'show'])->name('services.show');

// ── Pages publiques ───────────────────────────────────────────
// routes/web.php
Route::prefix('packages')->name('packages.')->group(function () {
    Route::get('/', [PackagePublicController::class, 'index'])->name('index');
    Route::get('/{slug}', [PackagePublicController::class, 'show'])->name('show');
});

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
// NOTE: single route for project show is defined above at /projects/{slug}

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// routes/web.php

Route::middleware(['auth'])->group(function () {
    // Souscription à un pack (injection manuelle du type 'package')
    Route::get('/packages/{slug}/souscrire', function ($slug) {
        return app(\App\Http\Controllers\SubscriptionController::class)->create('package', $slug);
    })->name('subscription.create.package');

    Route::post('/packages/{slug}/souscrire', function (\Illuminate\Http\Request $request, $slug) {
        return app(\App\Http\Controllers\SubscriptionController::class)->store($request, 'package', $slug);
    })->name('subscription.store.package');
    
    // Souscription à un service (injection manuelle du type 'service')
    Route::get('/services/{slug}/souscrire', function ($slug) {
        return app(\App\Http\Controllers\SubscriptionController::class)->create('service', $slug);
    })->name('subscription.create.service');

    Route::post('/services/{slug}/souscrire', function (\Illuminate\Http\Request $request, $slug) {
        return app(\App\Http\Controllers\SubscriptionController::class)->store($request, 'service', $slug);
    })->name('subscription.store.service');
// Dans Route::middleware(['auth'])->group(function () { ...

    Route::get('/payment/process/{subscription}', [PaymentController::class, 'processPayment'])
        ->name('payment.process');
    // Suivi Paiement
    Route::get('/payment/waiting/{reference}', [PaymentController::class, 'waiting'])->name('payment.waiting');
    Route::get('/payment/check/{reference}', [PaymentController::class, 'checkStatus'])->name('payment.check');
});

// Webhook intact
Route::post('/payment/webhook', [PaymentController::class, 'webhook'])->name('payment.webhook');

require __DIR__.'/auth.php';

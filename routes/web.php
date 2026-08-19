<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\SouscriptionController;
use App\Http\Controllers\Admin\CommandeAdminController;
use App\Http\Controllers\Admin\ClientAdminController;
use App\Http\Controllers\Admin\LogAdminController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\ContactAdminController;

use App\Http\Controllers\Client\ClientDashboardController;
use App\Http\Controllers\InvoiceController;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PublicProjectController;
use App\Http\Controllers\PublicServiceController;
use App\Http\Controllers\PublicBlogController;
use App\Http\Controllers\PackagePublicController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\PaymentController;

// ── Pages publiques ───────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');

// Redirection intelligente dashboard selon le rôle (Admin ou Client)
Route::middleware(['auth'])->get('/dashboard', function () {
    if (Auth::user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('client.dashboard');
})->name('dashboard');

// Factures & Reçus officiels (Admin & Propriétaire client)
Route::middleware(['auth'])->get('/invoices/{subscription}', [InvoiceController::class, 'show'])->name('invoices.show');

// Alias pour compatibilité /projets et /projects
Route::get('/projects', [PublicProjectController::class, 'index'])->name('projects.index');
Route::get('/projets', [PublicProjectController::class, 'index'])->name('projets.index');
Route::get('/projects/{slug}', [PublicProjectController::class, 'show'])->name('projects.show');

Route::get('/services', [PublicServiceController::class, 'index'])->name('services.index');
Route::get('/services/{slug}', [PublicServiceController::class, 'show'])->name('services.show');

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
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

Route::get('/blog', [PublicBlogController::class, 'index'])->name('blog');
Route::get('/blog/{slug}', [PublicBlogController::class, 'show'])->name('blog.show');
Route::post('/blog/{id}/like', [PublicBlogController::class, 'like'])->name('blog.like');
Route::post('/blog/{id}/comment', [PublicBlogController::class, 'storeComment'])->name('blog.comment');

// ── Tunnel de Souscription & Paiement (Auth requis) ───────────
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Souscription Pack
    Route::get('/packages/{slug}/souscrire', function ($slug) {
        return app(SubscriptionController::class)->create('package', $slug);
    })->name('subscription.create.package');

    Route::post('/packages/{slug}/souscrire', function (\Illuminate\Http\Request $request, $slug) {
        return app(SubscriptionController::class)->store($request, 'package', $slug);
    })->name('subscription.store.package');

    // Souscription Service
    Route::get('/services/{slug}/souscrire', function ($slug) {
        return app(SubscriptionController::class)->create('service', $slug);
    })->name('subscription.create.service');

    Route::post('/services/{slug}/souscrire', function (\Illuminate\Http\Request $request, $slug) {
        return app(SubscriptionController::class)->store($request, 'service', $slug);
    })->name('subscription.store.service');

    // Passerelle Paiement
    Route::get('/payment/process/{subscription}', [PaymentController::class, 'processPayment'])
        ->name('payment.process');
    Route::post('/payment/process/{subscription}', [PaymentController::class, 'processPayment']);
    Route::get('/payment/waiting/{reference}', [PaymentController::class, 'waiting'])->name('payment.waiting');
    Route::get('/payment/check/{reference}', [PaymentController::class, 'checkStatus'])->name('payment.check');
    Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/failed', [PaymentController::class, 'failed'])->name('payment.failed');
});

// Webhook de Paiement (ouvert)
Route::post('/payment/webhook', [PaymentController::class, 'webhook'])->name('payment.webhook');

// ── Espace Client (Auth requis) ───────────────────────────────
Route::middleware(['auth'])->prefix('client')->name('client.')->group(function () {
    Route::get('/dashboard', [ClientDashboardController::class, 'index'])->name('dashboard');
    Route::get('/souscriptions', [ClientDashboardController::class, 'souscriptions'])->name('souscriptions.index');
    Route::get('/souscriptions/{subscription}', [ClientDashboardController::class, 'show'])->name('souscriptions.show');
    Route::post('/souscriptions/{subscription}/message', [ClientDashboardController::class, 'sendMessage'])->name('souscriptions.message');
});

// ── Espace Administration (Auth + Verified requis) ────────────
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Commandes & Kanban de Production
    Route::get('commandes', [CommandeAdminController::class, 'index'])->name('commandes.index');
    Route::patch('commandes/{commande}/quick-status', [CommandeAdminController::class, 'quickStatus'])->name('commandes.quick-status');

    // CRM & Clients
    Route::get('clients', [ClientAdminController::class, 'index'])->name('clients.index');
    Route::get('clients/{client}', [ClientAdminController::class, 'show'])->name('clients.show');
    Route::patch('clients/{client}/role', [ClientAdminController::class, 'updateRole'])->name('clients.role');

    // Souscriptions & Ventes
    Route::get('souscriptions/export/csv', [SouscriptionController::class, 'exportCsv'])->name('souscriptions.export');
    Route::get('souscriptions', [SouscriptionController::class, 'index'])->name('souscriptions.index');
    Route::get('souscriptions/{souscription}', [SouscriptionController::class, 'show'])->name('souscriptions.show');
    Route::patch('souscriptions/{souscription}/statut', [SouscriptionController::class, 'updateStatut'])->name('souscriptions.statut');
    Route::post('souscriptions/{souscription}/livrable', [SouscriptionController::class, 'uploadLivrable'])->name('souscriptions.livrable');
    Route::post('souscriptions/{souscription}/message', [SouscriptionController::class, 'sendMessage'])->name('souscriptions.message');

    // Projets & Portfolio
    Route::resource('projects', ProjectController::class);

    // Services
    Route::resource('services', ServiceController::class);

    // Packs & Tarifs
    Route::resource('packages', PackageController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::patch('packages/{package}/toggle', [PackageController::class, 'toggleActif'])->name('packages.toggle');

    // Blog
    Route::resource('blogs', BlogController::class);

    // Messages de Contact
    Route::get('contacts', [ContactAdminController::class, 'index'])->name('contacts.index');
    Route::patch('contacts/{id}/toggle-read', [ContactAdminController::class, 'toggleRead'])->name('contacts.toggle-read');
    Route::delete('contacts/{id}', [ContactAdminController::class, 'destroy'])->name('contacts.destroy');

    // Logs Système & Audit Trail
    Route::get('logs', [LogAdminController::class, 'index'])->name('logs.index');
    Route::get('logs/export/csv', [LogAdminController::class, 'exportCsv'])->name('logs.export');
    Route::post('logs/clear-old', [LogAdminController::class, 'clearOld'])->name('logs.clear');
});

require __DIR__.'/auth.php';

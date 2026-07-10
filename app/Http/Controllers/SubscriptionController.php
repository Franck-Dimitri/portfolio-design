<?php
// app/Http/Controllers/SubscriptionController.php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\ServicePackage;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function create($type, $slug)
    {
        if ($type === 'package') {
            $package = ServicePackage::where('slug', $slug)->firstOrFail();
            
            $existingSubscription = Subscription::where('user_id', Auth::id())
                ->where('service_package_id', $package->id)
                ->where('status', 'active')
                ->where(function ($query) {
                    $query->whereNull('ends_at')->orWhere('ends_at', '>', now());
                })->first();

            if ($existingSubscription) {
                return redirect()->route('packages.show', $slug)
                    ->with('error', 'Vous avez déjà une souscription active pour ce pack.');
            }

            return Inertia::render('Subscription/Create', [
                'type' => 'package',
                'item' => $package,
                'durations' => [1, 3, 6, 12],
                'title' => 'Souscrire au pack ' . $package->titre
            ]);
        }

        if ($type === 'service') {
            $service = Service::where('slug', $slug)->firstOrFail();
            
            $existingSubscription = Subscription::where('user_id', Auth::id())
                ->where('service_id', $service->id)
                ->where('status', 'active')
                ->where(function ($query) {
                    $query->whereNull('ends_at')->orWhere('ends_at', '>', now());
                })->first();

            if ($existingSubscription) {
                return redirect()->route('services.show', $slug)
                    ->with('error', 'Vous avez déjà une souscription active pour ce service.');
            }

            return Inertia::render('Subscription/Create', [
                'type' => 'service',
                'item' => $service,
                'durations' => [1],
                'title' => 'Souscrire au service ' . $service->nom
            ]);
        }

        abort(404);
    }

    public function store(Request $request, $type, $slug)
    {
        // Validation stricte des données reçues de React
        $validated = $request->validate([
            'duration_months' => 'required|integer|min:1|max:12',
            'phone_number'    => 'required|regex:/^6[0-9]{8}$/', // Format Cameroun : 9 chiffres commençant par 6
            'operator'        => 'required|in:MTN,ORANGE',
        ]);

        if ($type === 'package') {
            $package = ServicePackage::where('slug', $slug)->firstOrFail();
            
            // Supprimer les anciennes souscriptions en attente pour ce pack et cet utilisateur
            Subscription::where('user_id', Auth::id())
                ->where('service_package_id', $package->id)
                ->where('status', 'pending')
                ->delete();

            $subscription = Subscription::create([
                'user_id' => Auth::id(),
                'service_package_id' => $package->id,
                'service_id' => null,
                'duration_months' => $validated['duration_months'],
                'status' => 'pending',
                // Tu pourras aussi stocker l'opérateur et le téléphone si ta table possède ces colonnes :
                // 'phone' => $validated['phone_number'],
                // 'operator' => $validated['operator'],
            ]);

            // Redirection vers le traitement de paiement en passant les paramètres nécessaires
            return redirect()->route('payment.process', [
                'subscription' => $subscription->id,
                'phone' => $validated['phone_number'],
                'operator' => $validated['operator']
            ]);
        }

        if ($type === 'service') {
            $service = Service::where('slug', $slug)->firstOrFail();
            
            // Supprimer les anciennes souscriptions en attente pour ce service et cet utilisateur
            Subscription::where('user_id', Auth::id())
                ->where('service_id', $service->id)
                ->where('status', 'pending')
                ->delete();

            $subscription = Subscription::create([
                'user_id' => Auth::id(),
                'service_package_id' => null,
                'service_id' => $service->id,
                'duration_months' => 1,
                'status' => 'pending',
            ]);

            return redirect()->route('payment.process', [
                'subscription' => $subscription->id,
                'phone' => $validated['phone_number'],
                'operator' => $validated['operator']
            ]);
        }

        abort(404);
    }
}
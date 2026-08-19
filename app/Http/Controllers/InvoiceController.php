<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InvoiceController extends Controller
{
    public function show(Subscription $subscription)
    {
        $user = Auth::user();
        
        // Vérification de sécurité : Seul l'admin ou le propriétaire de la commande peut voir la facture
        if ($user->role !== 'admin' && $subscription->user_id !== $user->id) {
            abort(403, 'Accès non autorisé à cette facture.');
        }

        $subscription->load(['servicePackage', 'service', 'payment', 'user']);

        return view('invoices.show', [
            'subscription' => $subscription,
            'item' => $subscription->servicePackage ?: $subscription->service,
            'clientNom' => $subscription->client_nom ?: $subscription->user?->name ?: 'Client',
            'clientEmail' => $subscription->client_email ?: $subscription->user?->email ?: '—',
            'clientPhone' => $subscription->client_telephone ?: '—',
            'payment' => $subscription->payment,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionMessage;
use App\Models\Livrable;
use App\Services\WhatsAppService;
use App\Notifications\NouvelleCommandeAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClientDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $subscriptions = Subscription::where('user_id', $user->id)
            ->with(['servicePackage', 'service', 'livrables', 'payment'])
            ->latest()
            ->get();

        $activeOrders = $subscriptions->whereIn('statut_production', ['non_demarre', 'en_cours', 'en_revision']);
        $completedOrders = $subscriptions->where('statut_production', 'termine');

        // Récupération de tous les livrables du client
        $subIds = $subscriptions->pluck('id');
        $recentDeliverables = Livrable::whereIn('souscription_id', $subIds)
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Client/Dashboard', [
            'stats' => [
                'total_commandes' => $subscriptions->count(),
                'en_cours' => $activeOrders->count(),
                'livrees' => $completedOrders->count(),
                'total_livrables' => Livrable::whereIn('souscription_id', $subIds)->count(),
            ],
            'recentOrders' => $subscriptions->take(5)->values(),
            'recentDeliverables' => $recentDeliverables,
        ]);
    }

    public function souscriptions(Request $request)
    {
        $user = Auth::user();

        $query = Subscription::where('user_id', $user->id)
            ->with(['servicePackage', 'service', 'livrables', 'payment'])
            ->latest();

        if ($request->filled('statut')) {
            $query->where('statut_production', $request->statut);
        }

        return Inertia::render('Client/Souscriptions/Index', [
            'souscriptions' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['statut']),
        ]);
    }

    public function show(Subscription $subscription)
    {
        $user = Auth::user();

        if ($subscription->user_id !== $user->id && $user->role !== 'admin') {
            abort(403, 'Accès non autorisé.');
        }

        $subscription->load([
            'servicePackage',
            'service',
            'livrables',
            'payment',
            'messages.user',
            'activities'
        ]);

        return Inertia::render('Client/Souscriptions/Show', [
            'souscription' => $subscription,
        ]);
    }

    public function sendMessage(Request $request, Subscription $subscription)
    {
        $user = Auth::user();

        if ($subscription->user_id !== $user->id && $user->role !== 'admin') {
            abort(403, 'Accès non autorisé.');
        }

        $request->validate([
            'message' => 'required|string|max:2000',
            'attachment' => 'nullable|file|max:20480', // 20 MB max
        ]);

        $path = null;
        $name = null;
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $name = $file->getClientOriginalName();
            $path = $file->store("messages/{$subscription->id}", 'public');
        }

        $message = SubscriptionMessage::create([
            'subscription_id' => $subscription->id,
            'user_id' => $user->id,
            'sender_type' => 'client',
            'message' => $request->message,
            'attachment_path' => $path,
            'attachment_name' => $name,
            'is_read' => false,
        ]);

        $subscription->logActivity('message_sent', "Message envoyé par le client ({$user->name})");

        return back()->with('success', 'Message transmis au designer.');
    }
}

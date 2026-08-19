<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Livrable;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = User::withCount(['subscriptions'])
            ->with(['subscriptions' => function ($q) {
                $q->with(['payment', 'servicePackage', 'service']);
            }])
            ->latest();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $allUsers = User::with(['subscriptions.payment', 'subscriptions.servicePackage', 'subscriptions.service'])->get();

        // Calcul du LTV (Total dépensé) pour chaque utilisateur
        $usersData = $query->paginate(15)->through(function ($user) {
            $totalSpent = $user->subscriptions->filter(fn($s) => $s->statut_paiement === 'paye')->sum(fn($s) => $s->montant);
            $activeOrders = $user->subscriptions->filter(fn($s) => in_array($s->statut_production, ['non_demarre', 'en_cours', 'en_revision']))->count();

            return [
                'id'                   => $user->id,
                'name'                 => $user->name,
                'email'                => $user->email,
                'phone'                => $user->phone ?: ($user->subscriptions->first()?->client_telephone),
                'whatsapp'             => $user->subscriptions->first()?->client_whatsapp,
                'role'                 => $user->role,
                'total_commandes'      => $user->subscriptions_count,
                'commandes_en_cours'   => $activeOrders,
                'total_depense'        => $totalSpent,
                'is_vip'               => $totalSpent >= 100000,
                'created_at'           => $user->created_at,
                'derniere_commande'    => $user->subscriptions->sortByDesc('created_at')->first()?->created_at,
            ];
        });

        $totalClients = $allUsers->count();
        $clientsAcheteurs = $allUsers->filter(fn($u) => $u->subscriptions->count() > 0)->count();
        $totalCA = $allUsers->sum(function ($u) {
            return $u->subscriptions->filter(fn($s) => $s->statut_paiement === 'paye')->sum(fn($s) => $s->montant);
        });
        $totalVIP = $allUsers->filter(function ($u) {
            return $u->subscriptions->filter(fn($s) => $s->statut_paiement === 'paye')->sum(fn($s) => $s->montant) >= 100000;
        })->count();

        return Inertia::render('Admin/pages/Clients/Index', [
            'clients' => $usersData,
            'filters' => $request->only(['search', 'role']),
            'stats'   => [
                'total'           => $totalClients,
                'acheteurs'       => $clientsAcheteurs,
                'ca_total'        => $totalCA,
                'vip'             => $totalVIP,
            ]
        ]);
    }

    public function show(User $client)
    {
        $client->load([
            'subscriptions' => function ($q) {
                $q->with(['servicePackage', 'service', 'payment', 'livrables'])->latest();
            }
        ]);

        $subIds = $client->subscriptions->pluck('id');
        $allDeliverables = Livrable::whereIn('souscription_id', $subIds)->latest()->get();

        $totalSpent = $client->subscriptions->filter(fn($s) => $s->statut_paiement === 'paye')->sum(fn($s) => $s->montant);

        return Inertia::render('Admin/pages/Clients/Show', [
            'client' => [
                'id'            => $client->id,
                'name'          => $client->name,
                'email'         => $client->email,
                'phone'         => $client->phone ?: ($client->subscriptions->first()?->client_telephone),
                'whatsapp'      => $client->subscriptions->first()?->client_whatsapp,
                'role'          => $client->role,
                'created_at'    => $client->created_at,
                'total_depense' => $totalSpent,
                'is_vip'        => $totalSpent >= 100000,
                'subscriptions' => $client->subscriptions,
                'livrables'     => $allDeliverables,
            ]
        ]);
    }

    public function updateRole(Request $request, User $client)
    {
        $request->validate([
            'role' => 'required|in:admin,client,designer',
        ]);

        $oldRole = $client->role;
        $client->update(['role' => $request->role]);

        ActivityLogger::client(
            'client.role_updated',
            "Rôle de l'utilisateur {$client->name} modifié : {$oldRole} → {$request->role}",
            $client,
            'warning'
        );

        return back()->with('success', 'Rôle du client mis à jour.');
    }
}

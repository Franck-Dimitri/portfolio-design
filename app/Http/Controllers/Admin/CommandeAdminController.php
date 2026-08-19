<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommandeAdminController extends Controller
{
    public function index(Request $request)
    {
        $view = $request->get('view', 'kanban'); // 'kanban' or 'list'

        $query = Subscription::with(['servicePackage', 'service', 'livrables', 'payment', 'user'])
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                  ->orWhere('client_nom', 'like', "%{$search}%")
                  ->orWhere('client_email', 'like', "%{$search}%");
            });
        }

        $allOrders = (clone $query)->get();

        // Répartition Kanban
        $kanban = [
            'non_demarre' => $allOrders->where('statut_production', 'non_demarre')->values(),
            'en_cours'    => $allOrders->where('statut_production', 'en_cours')->values(),
            'en_revision' => $allOrders->where('statut_production', 'en_revision')->values(),
            'termine'     => $allOrders->where('statut_production', 'termine')->values(),
        ];

        return Inertia::render('Admin/pages/Commandes/Index', [
            'commandes' => $query->paginate(15)->withQueryString(),
            'kanban'    => $kanban,
            'filters'   => $request->only(['search', 'view']),
            'stats'     => [
                'total'       => $allOrders->count(),
                'non_demarre' => $kanban['non_demarre']->count(),
                'en_cours'    => $kanban['en_cours']->count(),
                'en_revision' => $kanban['en_revision']->count(),
                'termine'     => $kanban['termine']->count(),
            ]
        ]);
    }

    public function quickStatus(Request $request, Subscription $commande)
    {
        $request->validate([
            'statut_production' => 'required|in:non_demarre,en_cours,en_revision,termine,archive',
        ]);

        $oldStatus = $commande->statut_production;
        $commande->update([
            'statut_production' => $request->statut_production,
            'livre_le' => $request->statut_production === 'termine' ? now() : $commande->livre_le,
        ]);

        $commande->logActivity('status_updated', "Statut de commande modifié : {$oldStatus} → {$request->statut_production}");

        ActivityLogger::order(
            'order.status_updated',
            "Changement de statut rapide pour la commande #{$commande->reference} : {$oldStatus} → {$request->statut_production}",
            $commande,
            'info',
            ['old_status' => $oldStatus, 'new_status' => $request->statut_production]
        );

        return back()->with('success', 'Statut de production mis à jour.');
    }
}

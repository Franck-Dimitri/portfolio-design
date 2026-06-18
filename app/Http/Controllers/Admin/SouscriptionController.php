<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Souscription;
use App\Models\Livrable;
use App\Services\WhatsAppService;
use App\Notifications\LivrableDisponible;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SouscriptionController extends Controller
{
    public function index(Request $request)
    {
        $query = Souscription::with(['user', 'servicePackage', 'livrables'])
            ->latest();

        if ($request->filled('statut_paiement')) {
            $query->where('statut_paiement', $request->statut_paiement);
        }
        if ($request->filled('statut_production')) {
            $query->where('statut_production', $request->statut_production);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('reference', 'like', "%{$request->search}%")
                  ->orWhere('client_nom', 'like', "%{$request->search}%")
                  ->orWhere('client_email', 'like', "%{$request->search}%");
            });
        }

        return Inertia::render('Admin/Packages/Souscriptions', [
            'souscriptions' => $query->paginate(15)->withQueryString(),
            'filters'       => $request->only(['statut_paiement', 'statut_production', 'search']),
            'stats'         => [
                'total'       => Souscription::count(),
                'payees'      => Souscription::paye()->count(),
                'en_cours'    => Souscription::where('statut_production', 'en_cours')->count(),
                'terminees'   => Souscription::where('statut_production', 'termine')->count(),
                'ca_total'    => Souscription::paye()->sum('montant'),
            ],
        ]);
    }

    public function show(Souscription $souscription)
    {
        return Inertia::render('Admin/Packages/SouscriptionDetail', [
            'souscription' => $souscription->load(['user', 'servicePackage', 'livrables']),
        ]);
    }

    public function updateStatut(Request $request, Souscription $souscription)
    {
        $request->validate([
            'statut_production'       => 'required|in:non_demarre,en_cours,en_revision,termine,archive',
            'notes_admin'             => 'nullable|string',
            'date_livraison_estimee'  => 'nullable|date',
        ]);

        $data = $request->only(['statut_production', 'notes_admin', 'date_livraison_estimee']);

        if ($request->statut_production === 'en_cours' && !$souscription->date_debut_production) {
            $data['date_debut_production'] = now();
        }
        if ($request->statut_production === 'termine') {
            $data['livre_le'] = now();
        }

        $souscription->update($data);

        return back()->with('success', 'Statut mis à jour.');
    }

    /**
     * Upload + envoi d'un livrable
     */
    public function uploadLivrable(Request $request, Souscription $souscription)
    {
        $request->validate([
            'fichier'  => 'required|file|max:51200',  // 50Mo max
            'nom'      => 'required|string|max:100',
            'message'  => 'nullable|string',
            'type'     => 'in:livrable,apercu,revision',
        ]);

        $file      = $request->file('fichier');
        $path      = $file->store("livrables/{$souscription->reference}", 'public');

        $livrable = Livrable::create([
            'souscription_id'    => $souscription->id,
            'nom'                => $request->nom,
            'fichier_path'       => $path,
            'fichier_nom_original' => $file->getClientOriginalName(),
            'mime_type'          => $file->getMimeType(),
            'taille'             => $file->getSize(),
            'type'               => $request->type ?? 'livrable',
            'message'            => $request->message,
        ]);

        // ── Notifier par email ────────────────────────────────
        $souscription->user->notify(new LivrableDisponible($souscription, $livrable));
        $livrable->update(['notifie_email' => true]);

        // ── Notifier par WhatsApp ─────────────────────────────
        if ($souscription->client_whatsapp) {
            $whatsapp = app(WhatsAppService::class);
            $fileUrl  = Storage::url($path);

            // Message texte
            $whatsapp->envoyer(
                $souscription->client_whatsapp,
                $whatsapp->messageLivraisonClient($souscription, $livrable->nom)
            );

            // Fichier joint (si image ou PDF < 10Mo)
            if ($livrable->taille < 10 * 1024 * 1024) {
                $whatsapp->envoyerFichier(
                    $souscription->client_whatsapp,
                    url($fileUrl),
                    "📎 {$livrable->nom}"
                );
            }

            $livrable->update([
                'notifie_whatsapp' => true,
                'envoye_le'        => now(),
            ]);
        }

        // Marquer comme terminé si type = livrable
        if ($request->type === 'livrable') {
            $souscription->update(['statut_production' => 'termine', 'livre_le' => now()]);
        }

        return back()->with('success', 'Livrable envoyé au client.');
    }
}
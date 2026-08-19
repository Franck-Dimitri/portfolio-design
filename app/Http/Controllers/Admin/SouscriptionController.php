<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
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
        $query = Subscription::with(['user', 'servicePackage', 'service', 'livrables', 'payment'])
            ->latest();

        if ($request->filled('statut_paiement')) {
            $statut = $request->statut_paiement;
            if ($statut === 'paye') {
                $query->where(function ($q) {
                    $q->where('status', 'active')
                      ->orWhereHas('payment', fn($pq) => $pq->where('status', 'success'));
                });
            } elseif ($statut === 'en_attente') {
                $query->where('status', 'pending');
            } elseif ($statut === 'echoue') {
                $query->whereHas('payment', fn($pq) => $pq->where('status', 'failed'));
            }
        }

        if ($request->filled('statut_production')) {
            $query->where('statut_production', $request->statut_production);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                  ->orWhere('client_nom', 'like', "%{$search}%")
                  ->orWhere('client_email', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $allSubs = Subscription::with(['servicePackage', 'service', 'payment'])->get();
        $totalCA = Payment::where('status', 'success')->sum('amount');
        if ($totalCA == 0) {
            $totalCA = Subscription::paye()->get()->sum(fn($s) => $s->montant);
        }

        return Inertia::render('Admin/pages/Packages/Souscription', [
            'souscriptions' => $query->paginate(15)->withQueryString(),
            'filters'       => $request->only(['statut_paiement', 'statut_production', 'search']),
            'stats'         => [
                'total'       => Subscription::count(),
                'payees'      => Subscription::paye()->count(),
                'en_cours'    => Subscription::whereIn('statut_production', ['en_cours', 'en_revision'])->count(),
                'terminees'   => Subscription::where('statut_production', 'termine')->count(),
                'ca_total'    => $totalCA,
            ],
        ]);
    }

    public function show($id)
    {
        $souscription = Subscription::with(['user', 'servicePackage', 'service', 'livrables', 'payment', 'payments'])
            ->findOrFail($id);

        return Inertia::render('Admin/pages/Packages/SouscriptionDetail', [
            'souscription' => $souscription,
        ]);
    }

    public function updateStatut(Request $request, $id)
    {
        $souscription = Subscription::findOrFail($id);

        $request->validate([
            'statut_production'       => 'required|in:non_demarre,en_cours,en_revision,termine,archive',
            'notes_admin'             => 'nullable|string',
            'date_livraison_estimee'  => 'nullable|date',
        ]);

        $data = $request->only(['statut_production', 'notes_admin', 'date_livraison_estimee']);

        if ($request->statut_production === 'en_cours' && !$souscription->date_debut_production) {
            $data['date_debut_production'] = now();
        }
        if ($request->statut_production === 'termine' && !$souscription->livre_le) {
            $data['livre_le'] = now();
        }

        $souscription->update($data);

        return back()->with('success', 'Statut de production mis à jour avec succès.');
    }

    /**
     * Upload + envoi d'un livrable
     */
    public function uploadLivrable(Request $request, $id)
    {
        $souscription = Subscription::with(['user', 'servicePackage', 'service'])->findOrFail($id);

        $request->validate([
            'fichier'  => 'required|file|max:51200',  // 50 Mo max
            'nom'      => 'required|string|max:100',
            'message'  => 'nullable|string',
            'type'     => 'in:livrable,apercu,revision',
        ]);

        $file = $request->file('fichier');
        $path = $file->store("livrables/{$souscription->reference}", 'public');

        $livrable = Livrable::create([
            'souscription_id'      => $souscription->id,
            'nom'                  => $request->nom,
            'fichier_path'         => $path,
            'fichier_nom_original' => $file->getClientOriginalName(),
            'mime_type'            => $file->getMimeType(),
            'taille'               => $file->getSize(),
            'type'                 => $request->type ?? 'livrable',
            'message'              => $request->message,
        ]);

        // ── Notifier par email ────────────────────────────────
        try {
            if ($souscription->user) {
                $souscription->user->notify(new LivrableDisponible($souscription, $livrable));
                $livrable->update(['notifie_email' => true]);
            }
        } catch (\Exception $e) {
            \Log::warning("Notification email livrable échouée: " . $e->getMessage());
        }

        // ── Notifier par WhatsApp ─────────────────────────────
        $clientPhone = $souscription->client_whatsapp ?: $souscription->client_telephone;
        if ($clientPhone) {
            try {
                $whatsapp = app(WhatsAppService::class);
                $fileUrl  = Storage::disk('public')->url($path);

                // Message texte
                $whatsapp->envoyer(
                    $clientPhone,
                    $whatsapp->messageLivraisonClient($souscription, $livrable->nom)
                );

                // Fichier joint (si image ou PDF < 10Mo)
                if ($livrable->taille < 10 * 1024 * 1024) {
                    $whatsapp->envoyerFichier(
                        $clientPhone,
                        url($fileUrl),
                        "📎 {$livrable->nom}"
                    );
                }

                $livrable->update([
                    'notifie_whatsapp' => true,
                    'envoye_le'        => now(),
                ]);
            } catch (\Exception $e) {
                \Log::warning("Notification WhatsApp livrable échouée: " . $e->getMessage());
            }
        }

        // Marquer comme terminé si type = livrable
        if ($request->type === 'livrable') {
            $souscription->update([
                'statut_production' => 'termine',
                'livre_le' => now()
            ]);
        }

        return back()->with('success', 'Livrable téléversé et notification envoyée avec succès.');
    }
}
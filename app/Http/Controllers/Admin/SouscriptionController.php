<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\Livrable;
use App\Models\SubscriptionMessage;
use App\Services\WhatsAppService;
use App\Notifications\LivrableDisponible;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
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

    public function show(Subscription $souscription)
    {
        $souscription->load([
            'user',
            'servicePackage',
            'service',
            'livrables',
            'payment',
            'messages.user',
            'activities'
        ]);

        return Inertia::render('Admin/pages/Packages/SouscriptionDetail', [
            'souscription' => $souscription,
        ]);
    }

    public function updateStatut(Request $request, Subscription $souscription)
    {
        $request->validate([
            'statut_production'     => 'required|in:non_demarre,en_cours,en_revision,termine,archive',
            'notes_admin'           => 'nullable|string|max:2000',
            'date_livraison_estimee'=> 'nullable|date',
        ]);

        $ancienStatut = $souscription->statut_production;

        $souscription->update([
            'statut_production'     => $request->statut_production,
            'notes_admin'           => $request->notes_admin,
            'date_livraison_estimee'=> $request->date_livraison_estimee,
            'livre_le'              => $request->statut_production === 'termine' ? now() : $souscription->livre_le,
        ]);

        $souscription->logActivity('status_updated', "Statut de production changé : {$ancienStatut} → {$request->statut_production}");

        // Notification WhatsApp si statut change et client a un numéro WhatsApp
        if ($ancienStatut !== $request->statut_production) {
            $phone = $souscription->client_whatsapp ?: $souscription->client_telephone;
            if ($phone) {
                $statutsLabels = [
                    'non_demarre' => 'Non démarré',
                    'en_cours'    => 'En cours de création',
                    'en_revision' => 'En cours de révision',
                    'termine'     => 'Terminé',
                    'archive'     => 'Archivé',
                ];
                $label = $statutsLabels[$request->statut_production] ?? $request->statut_production;
                $msg = "Bonjour {$souscription->client_nom}, le statut de votre commande #{$souscription->reference} chez DCA a été mis à jour : *{$label}*.";
                
                try {
                    WhatsAppService::send($phone, $msg);
                } catch (\Exception $e) {
                    \Log::warning("Échec notification WhatsApp: " . $e->getMessage());
                }
            }
        }

        return back()->with('success', 'Statut de production mis à jour.');
    }

    public function uploadLivrable(Request $request, Subscription $souscription)
    {
        $request->validate([
            'fichier' => 'required|file|max:51200', // Max 50 Mo
            'nom'     => 'required|string|max:255',
            'message' => 'nullable|string|max:1000',
            'type'    => 'required|in:livrable,apercu,revision',
        ]);

        $file = $request->file('fichier');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $mime = $file->getMimeType();
        $size = $file->getSize();

        $path = $file->store("livrables/{$souscription->id}", 'public');

        $livrable = Livrable::create([
            'souscription_id'     => $souscription->id,
            'nom'                 => $request->nom,
            'fichier_path'        => $path,
            'fichier_nom_original'=> $originalName,
            'type'                => $request->type,
            'extension'           => $extension,
            'mime_type'           => $mime,
            'taille_octets'       => $size,
            'message'             => $request->message,
            'notifie_email'       => false,
            'notifie_whatsapp'    => false,
        ]);

        $souscription->logActivity('deliverable_added', "Nouveau livrable déposé : {$livrable->nom} ({$livrable->taille_formattee})");

        // Si livrable final, passer la commande en "terminé"
        if ($request->type === 'livrable') {
            $souscription->update([
                'statut_production' => 'termine',
                'livre_le'          => now(),
            ]);
        }

        // Notification Email
        $clientUser = $souscription->user;
        $clientEmail = $souscription->client_email ?: $clientUser?->email;
        if ($clientEmail) {
            try {
                if ($clientUser) {
                    $clientUser->notify(new LivrableDisponible($souscription, $livrable));
                } else {
                    \Illuminate\Support\Facades\Notification::route('mail', $clientEmail)
                        ->notify(new LivrableDisponible($souscription, $livrable));
                }
                $livrable->update(['notifie_email' => true]);
            } catch (\Exception $e) {
                \Log::warning("Échec notification email livrable: " . $e->getMessage());
            }
        }

        // Notification WhatsApp
        $phone = $souscription->client_whatsapp ?: $souscription->client_telephone;
        if ($phone) {
            $msg = "Bonjour {$souscription->client_nom}, un nouveau fichier \"{$livrable->nom}\" est disponible pour votre commande #{$souscription->reference} chez DCA. Rendez-vous sur votre espace pour le télécharger.";
            try {
                $sent = WhatsAppService::send($phone, $msg);
                if ($sent) {
                    $livrable->update(['notifie_whatsapp' => true]);
                }
            } catch (\Exception $e) {
                \Log::warning("Échec notification WhatsApp livrable: " . $e->getMessage());
            }
        }

        return back()->with('success', 'Livrable téléversé et notifications envoyées au client.');
    }

    public function sendMessage(Request $request, Subscription $souscription)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'attachment' => 'nullable|file|max:20480',
        ]);

        $path = null;
        $name = null;
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $name = $file->getClientOriginalName();
            $path = $file->store("messages/{$souscription->id}", 'public');
        }

        SubscriptionMessage::create([
            'subscription_id' => $souscription->id,
            'user_id' => Auth::id(),
            'sender_type' => 'admin',
            'message' => $request->message,
            'attachment_path' => $path,
            'attachment_name' => $name,
            'is_read' => false,
        ]);

        $souscription->logActivity('message_sent', 'Message envoyé par l\'administration DCA');

        return back()->with('success', 'Message envoyé au client.');
    }

    public function exportCsv(): StreamedResponse
    {
        $fileName = 'dca_souscriptions_' . date('Y-m-d_His') . '.csv';
        $subscriptions = Subscription::with(['servicePackage', 'service', 'payment', 'user'])->get();

        $headers = [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        return response()->stream(function () use ($subscriptions) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF)); // BOM UTF-8

            // En-têtes
            fputcsv($handle, [
                'Référence',
                'Client',
                'Email',
                'Téléphone',
                'Prestation',
                'Montant (FCFA)',
                'Statut Paiement',
                'Statut Production',
                'Date Commande',
                'Date Livraison Estimée'
            ], ';');

            foreach ($subscriptions as $sub) {
                fputcsv($handle, [
                    $sub->reference,
                    $sub->client_nom ?: $sub->user?->name,
                    $sub->client_email ?: $sub->user?->email,
                    $sub->client_telephone ?: '—',
                    $sub->servicePackage?->titre ?: $sub->service?->titre ?: 'Sur-mesure',
                    $sub->montant,
                    $sub->statut_paiement,
                    $sub->statut_production,
                    $sub->created_at->format('d/m/Y H:i'),
                    $sub->date_livraison_estimee ? $sub->date_livraison_estimee->format('d/m/Y') : '—',
                ], ';');
            }

            fclose($handle);
        }, 200, $headers);
    }
}
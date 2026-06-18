<?php

// ══════════════════════════════════════════════════════════════
// app/Http/Controllers/Client/PackagePublicController.php
// ══════════════════════════════════════════════════════════════



use App\Http\Controllers\Controller;
use App\Models\ServicePackage;
use App\Models\Souscription;
use App\Services\CinetPayService;
use App\Services\WhatsAppService;
use App\Notifications\NouvelleCommandeAdmin;
use App\Notifications\ConfirmationSouscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PackagePublicController extends Controller
{
    // Page publique – liste des packs
    public function index()
    {
        $packages = ServicePackage::actif()->get();

        return Inertia::render('Client/Packages/Index', [
            'packages' => $packages,
        ]);
    }

    // Page publique – détail d'un pack
    public function show(ServicePackage $package)
    {
        abort_unless($package->is_active, 404);

        return Inertia::render('Client/Packages/Show', [
            'package' => $package,
        ]);
    }

    // Formulaire de souscription
    public function souscrire(Request $request, ServicePackage $package)
    {
        abort_unless($package->is_active, 404);

        $data = $request->validate([
            'client_nom'        => 'required|string|max:100',
            'client_email'      => 'required|email',
            'client_telephone'  => 'required|string|max:20',
            'client_whatsapp'   => 'nullable|string|max:20',
            'client_entreprise' => 'nullable|string|max:100',
            'besoins'           => 'nullable|string|max:2000',
        ]);

        // Créer la souscription (statut: en_attente)
        $souscription = Souscription::create([
            ...$data,
            'user_id'            => Auth::id(),
            'service_package_id' => $package->id,
            'montant'            => $package->prix,
            'devise'             => $package->devise,
        ]);

        // Rediriger vers CinetPay
        $cinetpay = app(CinetPayService::class);
        $result   = $cinetpay->initierPaiement($souscription);

        if (!$result['success']) {
            return back()->withErrors(['paiement' => $result['message']]);
        }

        return Inertia::location($result['payment_url']);
    }

    // Retour après paiement CinetPay
    public function retourPaiement(Request $request, string $reference)
    {
        $souscription = Souscription::where('reference', $reference)
            ->with('servicePackage')
            ->firstOrFail();

        // Vérifier le paiement
        $cinetpay = app(CinetPayService::class);
        $check    = $cinetpay->verifierPaiement($reference);

        if (isset($check['data']['status']) && $check['data']['status'] === 'ACCEPTED') {
            $souscription->update([
                'statut_paiement'            => 'paye',
                'cinetpay_transaction_id'    => $check['data']['transaction_id'] ?? null,
                'paye_le'                    => now(),
                'cinetpay_response'          => $check,
                'statut_production'          => 'non_demarre',
            ]);

            // Notifier le client par email
            $souscription->user->notify(new ConfirmationSouscription($souscription));

            // Notifier admin par email
            $adminEmail = config('mail.admin_address');
            \Notification::route('mail', $adminEmail)
                ->notify(new NouvelleCommandeAdmin($souscription));

            // Notifier admin par WhatsApp
            $adminWA = config('services.twilio.admin_whatsapp');
            if ($adminWA) {
                $wa = app(WhatsAppService::class);
                $wa->envoyer($adminWA, $wa->messageNouvelleSouscription($souscription));
            }

            // Notifier client par WhatsApp
            if ($souscription->client_whatsapp) {
                $wa = app(WhatsAppService::class);
                $wa->envoyer($souscription->client_whatsapp, $wa->messageConfirmationPaiement($souscription));
            }

            return Inertia::render('Client/Packages/Confirmation', [
                'souscription' => $souscription,
                'statut'       => 'succes',
            ]);
        }

        $souscription->update(['statut_paiement' => 'echoue', 'cinetpay_response' => $check]);

        return Inertia::render('Client/Packages/Confirmation', [
            'souscription' => $souscription,
            'statut'       => 'echec',
        ]);
    }

    // Espace client – mes commandes
    public function mesCommandes()
    {
        $souscriptions = Souscription::where('user_id', Auth::id())
            ->with(['servicePackage', 'livrables'])
            ->latest()
            ->get();

        return Inertia::render('Client/Packages/MesCommandes', [
            'souscriptions' => $souscriptions,
        ]);
    }

    // Espace client – détail d'une commande
    public function maCommande(Souscription $souscription)
    {
        abort_unless($souscription->user_id === Auth::id(), 403);

        return Inertia::render('Client/Packages/CommandeDetail', [
            'souscription' => $souscription->load(['servicePackage', 'livrables']),
        ]);
    }
}

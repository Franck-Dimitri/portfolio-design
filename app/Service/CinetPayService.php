<?php
// ══════════════════════════════════════════════════════════════
// app/Services/CinetPayService.php
// ══════════════════════════════════════════════════════════════
namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Souscription;

class CinetPayService
{
    private string $apiKey;
    private string $siteId;
    private string $baseUrl = 'https://api-checkout.cinetpay.com/v2';

    public function __construct()
    {
        $this->apiKey  = config('services.cinetpay.api_key');
        $this->siteId  = config('services.cinetpay.site_id');
    }

    /**
     * Initialiser un paiement → retourne le payment_url
     */
    public function initierPaiement(Souscription $souscription): array
    {
        $response = Http::post("{$this->baseUrl}/payment", [
            'apikey'            => $this->apiKey,
            'site_id'           => $this->siteId,
            'transaction_id'    => $souscription->reference,
            'amount'            => $souscription->montant,
            'currency'          => 'XAF',   // FCFA zone CEMAC
            'description'       => "Souscription pack : {$souscription->servicePackage->titre}",
            'return_url'        => route('souscriptions.retour', $souscription->reference),
            'notify_url'        => route('cinetpay.webhook'),
            'customer_name'     => $souscription->client_nom,
            'customer_email'    => $souscription->client_email,
            'customer_phone_number' => $souscription->client_telephone ?? '',
            'channels'          => 'ALL',   // Mobile Money + cartes
            'metadata'          => json_encode(['ref' => $souscription->reference]),
        ]);

        $data = $response->json();

        if (isset($data['data']['payment_token'])) {
            $souscription->update([
                'cinetpay_payment_token' => $data['data']['payment_token'],
                'statut_paiement'        => 'initie',
            ]);

            return [
                'success'     => true,
                'payment_url' => $data['data']['payment_url'],
                'token'       => $data['data']['payment_token'],
            ];
        }

        return ['success' => false, 'message' => $data['message'] ?? 'Erreur CinetPay'];
    }

    /**
     * Vérifier le statut d'un paiement (webhook ou retour)
     */
    public function verifierPaiement(string $transactionId): array
    {
        $response = Http::post("{$this->baseUrl}/payment/check", [
            'apikey'         => $this->apiKey,
            'site_id'        => $this->siteId,
            'transaction_id' => $transactionId,
        ]);

        return $response->json();
    }
}


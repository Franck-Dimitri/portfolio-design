<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    private $publicKey = "hrsk_pk_live_VOTRE_CLE_A";
    private $secretKey = "hrsk_sk_live_VOTRE_CLE_B";
    private $baseUrl = "https://api.hrskills-pay.com";

    public function processPayment(Request $request, $subscriptionId)
    {
        $subscription = Subscription::with('user')->findOrFail($subscriptionId);
        
        // Déterminer le montant selon le Pack ou le Service
        $amount = $subscription->service_package_id 
            ? ($subscription->servicePackage->prix * $subscription->duration_months)
            : $subscription->service->prix;

        // ══════════════════════════════════════════════════════════
        // ÉTAPE 1 : Récupérer le Transaction Token
        // ══════════════════════════════════════════════════════════
        $tokenResponse = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->publicKey,
            'Content-Type' => 'application/json',
        ])->post($this->baseUrl . '/v1/auth/transaction-token', [
            'api_secret' => $this->secretKey
        ]);

        if (!$tokenResponse->successful()) {
            return back()->with('error', 'Impossible de s\'authentifier auprès de la passerelle de paiement.');
        }

        $transactionToken = $tokenResponse->json()['transaction_token'];

        // ══════════════════════════════════════════════════════════
        // ÉTAPE 2 : Initier le prélèvement Mobile Money (Cash-In)
        // ══════════════════════════════════════════════════════════
        // Formatage du numéro (ex: 2376xxxxxxxx)
        $formattedPhone = $this->formatPhoneNumber($request->phone_number); 

        $payinResponse = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->publicKey,
            'X-Transaction-Token' => $transactionToken,
            'Content-Type' => 'application/json',
            'Idempotency-Key' => Str::uuid()->toString(), // Générateur UUID de Laravel
        ])->post($this->baseUrl . '/api/v1/payin/mobile-money', [
            'operator'     => $request->operator, // 'MTN' ou 'ORANGE'
            'country'      => 'CM',
            'phone_number' => $formattedPhone,
            'amount'       => $amount,
            'currency'     => 'XAF',
        ]);

        $responseData = $payinResponse->json();

        if ($payinResponse->status() === 202 && $responseData['success']) {
            $apiData = $responseData['data'];

            // ══════════════════════════════════════════════════════════
            // ÉTAPE 3 : Enregistrer le Paiement en PENDING dans ta BDD
            // ══════════════════════════════════════════════════════════
            $payment = Payment::create([
                'user_id' => auth()->id(),
                'subscription_id' => $subscription->id,
                'amount' => $apiData['amount'],
                'currency' => $apiData['currency'],
                'payment_method' => strtolower($apiData['operator']),
                'transaction_reference' => $apiData['reference'], // Ex: ref_d5b40...
                'status' => 'pending',
                'gateway_response' => json_encode($apiData),
            ]);

            // Rediriger le client vers une page d'attente sur son Dashboard
            return redirect()->route('payment.waiting', $payment->transaction_reference)
                             ->with('info', 'Veuillez valider le prompt sur votre téléphone.');
        }

        return back()->with('error', 'Échec de l\'initialisation du paiement : ' . $responseData['message']);
    }

    /**
     * Nettoyage simple du numéro de téléphone pour le Cameroun
     */
    private function formatPhoneNumber($phone) {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        if (!str_starts_with($phone, '237') && strlen($phone) === 9) {
            $phone = '237' . $phone;
        }
        return $phone;
    }
}
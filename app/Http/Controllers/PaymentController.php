<?php
// app/Http/Controllers/PaymentController.php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Inertia\Inertia; 

AQ.Ab8RN6LQEtYHWNvFwQyPOjKLR1P19HylNuGVJGMU4aRWrhbPwQ

class PaymentController extends Controller
{
    private $publicKey;
    private $secretKey;
    private $baseUrl;

    public function __construct()
    {
        $this->baseUrl   = config('services.hrskills_pay.base_url');
        $this->publicKey = config('services.hrskills_pay.public_key');
        $this->secretKey = config('services.hrskills_pay.secret_key');
    }

    public function processPayment(Request $request, $subscriptionId)
    {

    
        $subscription = Subscription::with(['user', 'servicePackage', 'service'])->findOrFail($subscriptionId);
        
        // Vérifier que la souscription appartient à l'utilisateur connecté
        if ($subscription->user_id !== auth()->id()) {
            abort(403, 'Vous n\'êtes pas autorisé à payer cette souscription.');
        }

        // Vérifier que la souscription est en attente
        if ($subscription->status !== 'pending') {
            return back()->with('error', 'Cette souscription n\'est pas en attente de paiement.');
        }

        // Déterminer le montant total
        $amount = $subscription->getTotalAmount();

        // EXTRACTION DES PARAMÈTRES DEPUIS L'URL (Query Strings)
        $phone = $request->query('phone');
        $operator = $request->query('operator');

        // Sécurité au cas où les paramètres manquent dans la redirection URL
        if (!$phone || !$operator) {
            return back()->with('error', 'Informations de paiement manquantes (téléphone ou opérateur).');
        }

        try {
            $tokenResponse = Http::timeout(10)->withHeaders([
                'Authorization' => 'Bearer ' . $this->publicKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/v1/auth/transaction-token', [
                'api_secret' => $this->secretKey
            ]);

            if (!$tokenResponse->successful()) {
                return back()->with('error', 'Impossible de s\'authentifier auprès de la passerelle de paiement.');
            }

            $transactionToken = $tokenResponse->json()['transaction_token'] ?? null;
            
            if (!$transactionToken) {
                return back()->with('error', 'Jeton de transaction introuvable.');
            }

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            // Si l'hôte est introuvable ou l'API hors-ligne, on attrape l'erreur proprement
            return back()->with('error', 'La passerelle de paiement est actuellement inaccessible. Veuillez réessayer plus tard.');
        }

        // ══════════════════════════════════════════════════════════
        // ÉTAPE 2 : Initier le prélèvement Mobile Money (Cash-In)
        // ══════════════════════════════════════════════════════════
        // CORRECTION : On utilise la variable locale $phone extraite plus haut
        $formattedPhone = $this->formatPhoneNumber($phone); 

        $payinResponse = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->publicKey,
            'X-Transaction-Token' => $transactionToken,
            'Content-Type' => 'application/json',
            'Idempotency-Key' => Str::uuid()->toString(),
        ])->post($this->baseUrl . '/api/v1/payin/mobile-money', [
            'operator'     => strtoupper($operator), // CORRECTION : Utilise la variable locale $operator
            'country'      => 'CM',
            'phone_number' => $formattedPhone,
            'amount'       => $amount,
            'currency'     => 'XAF',
            'description'  => 'Paiement pour ' . ($subscription->service_package_id ? 'Pack ' . $subscription->servicePackage->titre : 'Service ' . $subscription->service->nom),
        ]);

        $responseData = $payinResponse->json();

        if ($payinResponse->status() === 202 && isset($responseData['success']) && $responseData['success']) {
            $apiData = $responseData['data'];

            // ══════════════════════════════════════════════════════════
            // ÉTAPE 3 : Enregistrer le Paiement en PENDING dans la BDD
            // ══════════════════════════════════════════════════════════
            $payment = Payment::create([
                'user_id' => auth()->id(),
                'subscription_id' => $subscription->id,
                'amount' => $apiData['amount'],
                'currency' => $apiData['currency'] ?? 'XAF',
                'payment_method' => strtolower($apiData['operator'] ?? $operator),
                'transaction_reference' => $apiData['reference'],
                'status' => 'pending',
                'gateway_response' => json_encode($apiData),
            ]);

            session(['current_payment_id' => $payment->id]);

            return redirect()->route('payment.waiting', $payment->transaction_reference)
                            ->with('info', 'Veuillez valider le prompt sur votre téléphone.');
        }

        return back()->with('error', 'Échec de l\'initialisation du paiement : ' . ($responseData['message'] ?? 'Erreur de la passerelle.'));
    }

    // Page d'attente de confirmation
    public function waiting($reference)
    {
        $payment = Payment::where('transaction_reference', $reference)->firstOrFail();
        
        return Inertia::render('Payment/Waiting', [
            'payment' => $payment,
            'reference' => $reference,
        ]);
    }

    // Vérifier le statut du paiement (via AJAX)
    public function checkStatus($reference)
    {
        $payment = Payment::where('transaction_reference', $reference)->firstOrFail();
        
        return response()->json([
            'status' => $payment->status,
            'message' => $payment->status === 'success' ? 'Paiement confirmé !' : 'En attente...'
        ]);
    }

    // Webhook pour les notifications de paiement
    public function webhook(Request $request)
    {
        // Vérifier la signature (à adapter selon votre passerelle)
        $payload = $request->all();
        
        // Log pour debugging
        \Log::info('Webhook reçu', $payload);

        if (!isset($payload['reference']) || !isset($payload['status'])) {
            return response()->json(['error' => 'Données incomplètes'], 400);
        }

        $reference = $payload['reference'];
        $status = $payload['status'];

        $payment = Payment::where('transaction_reference', $reference)->first();

        if (!$payment) {
            return response()->json(['error' => 'Paiement non trouvé'], 404);
        }

        // Mettre à jour le statut du paiement
        $payment->status = $status === 'SUCCESS' ? 'success' : 'failed';
        $payment->gateway_response = json_encode($payload);
        $payment->save();

        // Si le paiement est réussi, activer la souscription
        if ($payment->status === 'success') {
            $subscription = $payment->subscription;
            $subscription->status = 'active';
            $subscription->starts_at = now();
            
            // Si c'est un pack, calculer la date de fin
            if ($subscription->service_package_id) {
                $subscription->ends_at = now()->addMonths($subscription->duration_months);
            }
            
            $subscription->save();
        }

        return response()->json(['success' => true]);
    }

    /**
     * Nettoyage du numéro de téléphone pour le Cameroun
     */
    private function formatPhoneNumber($phone) {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // Supprimer le préfixe 237 s'il est déjà présent
        if (str_starts_with($phone, '237')) {
            $phone = substr($phone, 3);
        }
        
        // Si le numéro commence par 0, le supprimer
        if (str_starts_with($phone, '0')) {
            $phone = substr($phone, 1);
        }
        
        // Vérifier que le numéro fait 9 chiffres
        if (strlen($phone) === 9) {
            $phone = '237' . $phone;
        }
        
        return $phone;
    }
}
<?php



use App\Models\Souscription;
use App\Http\Controllers\Controller;

use App\Services\CinetPayService;
use App\Services\WhatsAppService;
use App\Notifications\ConfirmationSouscription;
use App\Notifications\NouvelleCommandeAdmin;
use Illuminate\Http\Request;

class CinetPayWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $transactionId = $request->input('cpm_trans_id');

        if (!$transactionId) return response('OK');

        $souscription = Souscription::where('reference', $transactionId)
            ->with(['servicePackage', 'user'])
            ->first();

        if (!$souscription) return response('OK');

        // Vérification sécurisée
        $cinetpay = app(CinetPayService::class);
        $check    = $cinetpay->verifierPaiement($transactionId);

        if (
            isset($check['data']['status']) &&
            $check['data']['status'] === 'ACCEPTED' &&
            $souscription->statut_paiement !== 'paye'
        ) {
            $souscription->update([
                'statut_paiement'         => 'paye',
                'cinetpay_transaction_id' => $check['data']['transaction_id'] ?? null,
                'paye_le'                 => now(),
                'cinetpay_response'       => $check,
                'statut_production'       => 'non_demarre',
            ]);

            // Notifications
            $souscription->user->notify(new ConfirmationSouscription($souscription));

            $adminWA = config('services.twilio.admin_whatsapp');
            if ($adminWA) {
                $wa = app(WhatsAppService::class);
                $wa->envoyer($adminWA, $wa->messageNouvelleSouscription($souscription));
            }
        }

        return response('OK');
    }
}
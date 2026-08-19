<?php

namespace App\Services;

use App\Models\Subscription;
use Illuminate\Support\Facades\Http;

class WhatsAppService
{
    private string $accountSid;
    private string $authToken;
    private string $from;

    public function __construct()
    {
        $this->accountSid = config('services.twilio.sid', '');
        $this->authToken  = config('services.twilio.token', '');
        $this->from       = 'whatsapp:' . config('services.twilio.whatsapp_from', '+14155238886');
    }

    /**
     * Envoyer un message WhatsApp texte
     */
    public function envoyer(string $telephone, string $message): bool
    {
        if (empty($this->accountSid) || empty($this->authToken)) {
            \Log::info("WhatsApp (Mock) à {$telephone} : {$message}");
            return true;
        }

        $to = 'whatsapp:' . $this->normaliserTelephone($telephone);

        try {
            $response = Http::withBasicAuth($this->accountSid, $this->authToken)
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$this->accountSid}/Messages.json", [
                    'From' => $this->from,
                    'To'   => $to,
                    'Body' => $message,
                ]);

            return $response->successful();
        } catch (\Exception $e) {
            \Log::error("Erreur envoi WhatsApp : " . $e->getMessage());
            return false;
        }
    }

    /**
     * Envoyer un fichier (livrable) via WhatsApp
     */
    public function envoyerFichier(string $telephone, string $fileUrl, string $caption = ''): bool
    {
        if (empty($this->accountSid) || empty($this->authToken)) {
            \Log::info("WhatsApp Fichier (Mock) à {$telephone} : {$fileUrl} (Caption: {$caption})");
            return true;
        }

        $to = 'whatsapp:' . $this->normaliserTelephone($telephone);

        try {
            $response = Http::withBasicAuth($this->accountSid, $this->authToken)
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$this->accountSid}/Messages.json", [
                    'From'    => $this->from,
                    'To'      => $to,
                    'Body'    => $caption,
                    'MediaUrl'=> $fileUrl,
                ]);

            return $response->successful();
        } catch (\Exception $e) {
            \Log::error("Erreur envoi fichier WhatsApp : " . $e->getMessage());
            return false;
        }
    }

    /**
     * Normaliser le numéro (ajouter +237 si camerounais sans indicatif)
     */
    private function normaliserTelephone(string $tel): string
    {
        $tel = preg_replace('/\D/', '', $tel);
        if (strlen($tel) === 9) $tel = '237' . $tel;
        if (!str_starts_with($tel, '+')) $tel = '+' . $tel;
        return $tel;
    }

    // ── Messages prédéfinis ───────────────────────────────────

    public function messageNouvelleSouscription(Subscription $s): string
    {
        $itemTitre = $s->servicePackage ? $s->servicePackage->titre : ($s->service ? $s->service->titre : 'Prestation');
        return "🎨 *Nouvelle souscription reçue !*\n\n"
            . "📋 Référence : *{$s->reference}*\n"
            . "📦 Prestation : *{$itemTitre}*\n"
            . "👤 Client : *{$s->client_nom}*\n"
            . "📧 Email : {$s->client_email}\n"
            . "📱 Tél : {$s->client_telephone}\n"
            . "💰 Montant : *{$s->montant_formate}*\n"
            . "🕐 Date : " . now()->format('d/m/Y à H:i') . "\n\n"
            . ($s->besoins ? "💬 Besoins :\n_{$s->besoins}_\n\n" : '')
            . "👉 Gérer depuis le dashboard admin.";
    }

    public function messageLivraisonClient(Subscription $s, string $nomFichier): string
    {
        return "🎉 *Votre livrable est prêt !*\n\n"
            . "Bonjour *{$s->client_nom}*,\n\n"
            . "Votre commande *{$s->reference}* a un nouveau livrable disponible ✅\n"
            . "📎 Fichier : *{$nomFichier}*\n\n"
            . "Vous pouvez le télécharger directement dans votre espace client.\n\n"
            . "Merci de votre confiance 🙏\n"
            . "_Dim's Creative Academy_";
    }

    public function messageConfirmationPaiement(Subscription $s): string
    {
        $itemTitre = $s->servicePackage ? $s->servicePackage->titre : ($s->service ? $s->service->titre : 'Prestation');
        return "✅ *Paiement confirmé !*\n\n"
            . "Bonjour *{$s->client_nom}*,\n\n"
            . "Votre paiement de *{$s->montant_formate}* a été validé avec succès.\n"
            . "📋 Réf. : *{$s->reference}*\n"
            . "📦 Prestation : *{$itemTitre}*\n\n"
            . "Nous commençons la production sous 24h ouvrées.\n"
            . "Vous serez notifié dès la livraison. 🚀\n\n"
            . "_Dim's Creative Academy_";
    }
}

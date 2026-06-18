<?php

// ══════════════════════════════════════════════════════════════
// app/Services/WhatsAppService.php  (Twilio)
// ══════════════════════════════════════════════════════════════
namespace App\Services;

use Illuminate\Support\Facades\Http;

class WhatsAppService
{
    private string $accountSid;
    private string $authToken;
    private string $from; // 'whatsapp:+14155238886'

    public function __construct()
    {
        $this->accountSid = config('services.twilio.sid');
        $this->authToken  = config('services.twilio.token');
        $this->from       = 'whatsapp:' . config('services.twilio.whatsapp_from');
    }

    /**
     * Envoyer un message WhatsApp texte
     */
    public function envoyer(string $telephone, string $message): bool
    {
        $to = 'whatsapp:' . $this->normaliserTelephone($telephone);

        $response = Http::withBasicAuth($this->accountSid, $this->authToken)
            ->post("https://api.twilio.com/2010-04-01/Accounts/{$this->accountSid}/Messages.json", [
                'From' => $this->from,
                'To'   => $to,
                'Body' => $message,
            ]);

        return $response->successful();
    }

    /**
     * Envoyer un fichier (livrable) via WhatsApp
     */
    public function envoyerFichier(string $telephone, string $fileUrl, string $caption = ''): bool
    {
        $to = 'whatsapp:' . $this->normaliserTelephone($telephone);

        $response = Http::withBasicAuth($this->accountSid, $this->authToken)
            ->post("https://api.twilio.com/2010-04-01/Accounts/{$this->accountSid}/Messages.json", [
                'From'    => $this->from,
                'To'      => $to,
                'Body'    => $caption,
                'MediaUrl'=> $fileUrl,
            ]);

        return $response->successful();
    }

    /**
     * Normaliser le numéro (ajouter +237 si camerounais sans indicatif)
     */
    private function normaliserTelephone(string $tel): string
    {
        $tel = preg_replace('/\D/', '', $tel);
        if (strlen($tel) === 9) $tel = '237' . $tel;  // Cameroun
        if (!str_starts_with($tel, '+')) $tel = '+' . $tel;
        return $tel;
    }

    // ── Messages prédéfinis ───────────────────────────────────

    public function messageNouvelleSouscription(\App\Models\Souscription $s): string
    {
        return "🎨 *Nouvelle souscription reçue !*\n\n"
            . "📋 Référence : *{$s->reference}*\n"
            . "📦 Pack : *{$s->servicePackage->titre}*\n"
            . "👤 Client : *{$s->client_nom}*\n"
            . "📧 Email : {$s->client_email}\n"
            . "📱 Tél : {$s->client_telephone}\n"
            . "💰 Montant : *{$s->montant_formate}*\n"
            . "🕐 Date : " . now()->format('d/m/Y à H:i') . "\n\n"
            . ($s->besoins ? "💬 Besoins :\n_{$s->besoins}_\n\n" : '')
            . "👉 Gérer depuis le dashboard admin.";
    }

    public function messageLivraisonClient(\App\Models\Souscription $s, string $nomFichier): string
    {
        return "🎉 *Votre livrable est prêt !*\n\n"
            . "Bonjour *{$s->client_nom}*,\n\n"
            . "Votre commande *{$s->reference}* est livrée ✅\n"
            . "📎 Fichier : *{$nomFichier}*\n\n"
            . "Vous pouvez aussi le retrouver dans votre espace client.\n\n"
            . "Merci de votre confiance 🙏\n"
            . "_Dim's Creative Academy_";
    }

    public function messageConfirmationPaiement(\App\Models\Souscription $s): string
    {
        return "✅ *Paiement confirmé !*\n\n"
            . "Bonjour *{$s->client_nom}*,\n\n"
            . "Votre paiement de *{$s->montant_formate}* a été reçu avec succès.\n"
            . "📋 Réf. : *{$s->reference}*\n"
            . "📦 Pack : *{$s->servicePackage->titre}*\n\n"
            . "Nous commençons la production sous 24h ouvrées.\n"
            . "Vous serez notifié dès la livraison. 🚀\n\n"
            . "_Dim's Creative Academy_";
    }
}
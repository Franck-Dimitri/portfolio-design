<?php

namespace App\Notifications;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ConfirmationSouscription extends Notification
{
    use Queueable;

    public function __construct(public Subscription $souscription) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $s = $this->souscription;
        $packTitle = $s->servicePackage ? $s->servicePackage->titre : ($s->service ? $s->service->titre : 'Prestation de Design');

        return (new MailMessage)
            ->subject("✅ Confirmation de votre commande – #{$s->reference}")
            ->greeting("Bonjour {$s->client_nom} !")
            ->line("Nous vous confirmons la bonne réception de votre commande et de votre paiement de **{$s->montant_formate}**.")
            ->line("**Prestation :** {$packTitle}")
            ->line("**Référence de commande :** #{$s->reference}")
            ->line("Notre équipe créative a pris en charge votre projet et démarre la production sous 24h ouvrées.")
            ->action("Consulter votre espace & Facture", route('client.souscriptions.show', $s->id))
            ->line("Vous recevrez vos livrables par email, WhatsApp et directement dans votre espace client.")
            ->line("Merci de votre confiance — *Dim's Creative Academy*");
    }
}

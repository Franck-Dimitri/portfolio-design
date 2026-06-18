<?php
// ══════════════════════════════════════════════════════════════
// app/Notifications/ConfirmationSouscription.php
// ══════════════════════════════════════════════════════════════
namespace App\Notifications;

use App\Models\Souscription;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ConfirmationSouscription extends Notification
{
    use Queueable;

    public function __construct(public Souscription $souscription) {}

    public function via($notifiable): array { return ['mail']; }

    public function toMail($notifiable): MailMessage
    {
        $s = $this->souscription;

        return (new MailMessage)
            ->subject("✅ Confirmation de votre commande – {$s->reference}")
            ->greeting("Bonjour {$s->client_nom} !")
            ->line("Votre paiement de **{$s->montant_formate}** a été reçu avec succès.")
            ->line("**Pack souscrit :** {$s->servicePackage->titre}")
            ->line("**Référence :** {$s->reference}")
            ->line("Nous commençons la production sous **24h ouvrées**.")
            ->line("Vous recevrez vos livrables par email et WhatsApp dès qu'ils sont prêts.")
            ->action("Suivre ma commande", route('client.commandes.show', $s->id))
            ->line("Merci de votre confiance — *Dim's Creative Academy*");
    }
}



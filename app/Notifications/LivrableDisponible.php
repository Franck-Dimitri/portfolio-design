<?php

namespace App\Notifications;

use App\Models\Subscription;
use App\Models\Livrable;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class LivrableDisponible extends Notification
{
    use Queueable;

    public function __construct(
        public Subscription $souscription,
        public Livrable $livrable
    ) {}

    public function via($notifiable): array { return ['mail']; }

    public function toMail($notifiable): MailMessage
    {
        $s = $this->souscription;
        $l = $this->livrable;
        $itemTitle = $s->servicePackage ? $s->servicePackage->titre : ($s->service ? $s->service->titre : 'Prestation');

        $mail = (new MailMessage)
            ->subject("🎉 Votre livrable est prêt – {$s->reference}")
            ->greeting("Bonjour {$s->client_nom} !")
            ->line("Votre livrable **{$l->nom}** est disponible au téléchargement.")
            ->line("**Commande :** {$s->reference} — {$itemTitle}");

        if ($l->message) {
            $mail->line("**Message de l'agence :** {$l->message}");
        }

        return $mail
            ->line("Merci de votre confiance — *Dim's Creative Academy*");
    }
}
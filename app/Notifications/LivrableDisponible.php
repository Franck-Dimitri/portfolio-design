<?php

// ══════════════════════════════════════════════════════════════
// app/Notifications/LivrableDisponible.php
// ══════════════════════════════════════════════════════════════
namespace App\Notifications;

use App\Models\Souscription;
use App\Models\Livrable;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Storage;

class LivrableDisponible extends Notification
{
    use Queueable;

    public function __construct(
        public Souscription $souscription,
        public Livrable $livrable
    ) {}

    public function via($notifiable): array { return ['mail']; }

    public function toMail($notifiable): MailMessage
    {
        $s = $this->souscription;
        $l = $this->livrable;

        $mail = (new MailMessage)
            ->subject("🎉 Votre livrable est prêt – {$s->reference}")
            ->greeting("Bonjour {$s->client_nom} !")
            ->line("Votre livrable **{$l->nom}** est disponible.")
            ->line("**Commande :** {$s->reference} — {$s->servicePackage->titre}");

        if ($l->message) {
            $mail->line("**Message :** {$l->message}");
        }

        return $mail
            ->action("Télécharger mon livrable", route('client.commandes.show', $s->id))
            ->line("Merci de votre confiance — *Dim's Creative Academy*");
    }
}
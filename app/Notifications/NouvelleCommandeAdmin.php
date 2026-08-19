<?php

namespace App\Notifications;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NouvelleCommandeAdmin extends Notification
{
    use Queueable;

    public function __construct(public Subscription $souscription) {}

    public function via($notifiable): array { return ['mail']; }

    public function toMail($notifiable): MailMessage
    {
        $s = $this->souscription;
        $itemTitle = $s->servicePackage ? $s->servicePackage->titre : ($s->service ? $s->service->titre : 'Prestation');

        return (new MailMessage)
            ->subject("🎨 Nouvelle commande – {$s->reference} – {$s->montant_formate}")
            ->greeting("Nouvelle souscription reçue !")
            ->line("**Référence :** {$s->reference}")
            ->line("**Prestation :** {$itemTitle}")
            ->line("**Client :** {$s->client_nom} ({$s->client_email})")
            ->line("**Téléphone :** {$s->client_telephone}")
            ->when($s->client_whatsapp, fn($m) => $m->line("**WhatsApp :** {$s->client_whatsapp}"))
            ->line("**Montant payé :** {$s->montant_formate}")
            ->when($s->besoins, fn($m) => $m->line("**Besoins exprimés :** {$s->besoins}"))
            ->action("Gérer la commande", route('admin.souscriptions.show', $s->id))
            ->salutation("— Système de notification automatique");
    }
}

<?php


// ══════════════════════════════════════════════════════════════
// app/Notifications/NouvelleCommandeAdmin.php
// ══════════════════════════════════════════════════════════════
namespace App\Notifications;

use App\Models\Souscription;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NouvelleCommandeAdmin extends Notification
{
    use Queueable;

    public function __construct(public Souscription $souscription) {}

    public function via($notifiable): array { return ['mail']; }

    public function toMail($notifiable): MailMessage
    {
        $s = $this->souscription;

        return (new MailMessage)
            ->subject("🎨 Nouvelle commande – {$s->reference} – {$s->montant_formate}")
            ->greeting("Nouvelle souscription reçue !")
            ->line("**Référence :** {$s->reference}")
            ->line("**Pack :** {$s->servicePackage->titre}")
            ->line("**Client :** {$s->client_nom} ({$s->client_email})")
            ->line("**Téléphone :** {$s->client_telephone}")
            ->line("**WhatsApp :** {$s->client_whatsapp}")
            ->when($s->client_entreprise, fn($m) => $m->line("**Entreprise :** {$s->client_entreprise}"))
            ->line("**Montant payé :** {$s->montant_formate}")
            ->when($s->besoins, fn($m) => $m->line("**Besoins exprimés :** {$s->besoins}"))
            ->action("Gérer la commande", route('admin.souscriptions.show', $s->id))
            ->salutation("— Système de notification automatique");
    }
}

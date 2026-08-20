<?php

namespace App\Notifications;

use App\Models\Subscription;
use App\Models\SubscriptionMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NouveauMessageSouscription extends Notification
{
    use Queueable;

    public function __construct(
        public Subscription $souscription,
        public SubscriptionMessage $subscriptionMessage
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $s = $this->souscription;
        $m = $this->subscriptionMessage;
        $isClientRecipient = ($m->sender_type === 'admin');

        $senderName = $isClientRecipient ? "L'équipe DCA" : $s->client_nom;
        $targetUrl = $isClientRecipient
            ? route('client.souscriptions.show', $s->id)
            : route('admin.souscriptions.show', $s->id);

        $mail = (new MailMessage)
            ->subject("💬 Nouveau message sur la commande #{$s->reference}")
            ->greeting("Bonjour " . ($isClientRecipient ? $s->client_nom : "Franck") . " !")
            ->line("**{$senderName}** vous a envoyé un nouveau message concernant la commande **#{$s->reference}** :")
            ->line("> *\"{$m->message}\"*");

        if ($m->attachment_name) {
            $mail->line("📎 **Fichier joint :** {$m->attachment_name}");
        }

        return $mail
            ->action("Accéder à la discussion", $targetUrl)
            ->line("Dim's Creative Academy — Design Studio");
    }
}

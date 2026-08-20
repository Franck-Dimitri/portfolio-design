<?php

namespace App\Notifications;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NouveauMessageContact extends Notification
{
    use Queueable;

    public function __construct(public Contact $contact) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $c = $this->contact;

        return (new MailMessage)
            ->subject("📩 Nouveau message de contact : {$c->subject}")
            ->greeting("Bonjour Franck !")
            ->line("Vous avez reçu un nouveau message depuis le formulaire de contact de votre portfolio.")
            ->line("**De :** {$c->name} ({$c->email})")
            ->when($c->phone, fn($m) => $m->line("**Téléphone :** {$c->phone}"))
            ->line("**Sujet :** {$c->subject}")
            ->line("**Message :**")
            ->line("> " . nl2br(e($c->message)))
            ->action("Voir dans l'administration", route('admin.contacts.index'))
            ->line("Système de notification automatique — Dim's Creative Academy");
    }
}

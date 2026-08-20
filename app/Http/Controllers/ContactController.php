<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\Setting;
use App\Notifications\NouveauMessageContact;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        try {
            // Validation
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'subject' => 'required|string|max:255',
                'service' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:255',
                'message' => 'required|string|max:5000',
            ]);

            // Sauvegarder en base de données
            $contact = Contact::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'subject' => $validated['subject'],
                'service' => $validated['service'] ?? null,
                'message' => $validated['message'],
                'is_read' => false,
            ]);

            // Journaliser l'activité
            ActivityLogger::system("Nouveau message de contact reçu de {$contact->name} ({$contact->email})", 'info');

            // Envoyer la notification email à l'admin
            $adminEmail = Setting::get('notification_email_admin', Setting::get('contact_email', config('mail.from.address', 'admin@dimscreative.com')));
            
            try {
                Notification::route('mail', $adminEmail)->notify(new NouveauMessageContact($contact));
            } catch (\Exception $mailEx) {
                Log::warning("Échec envoi email notification contact: " . $mailEx->getMessage());
            }

            return redirect()->back()->with('success', 'Votre message a été transmis avec succès. Nous vous répondrons dans les plus brefs délais.');

        } catch (\Exception $e) {
            Log::error('Erreur envoi message contact: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Erreur lors de l\'envoi du message. Veuillez réessayer ou nous contacter via WhatsApp.']);
        }
    }
}
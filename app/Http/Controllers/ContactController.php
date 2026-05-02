<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactMail;
use App\Models\Contact;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        try {
            Log::info('Début envoi message contact', $request->all());

            // Validation
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'subject' => 'required|string|max:255',
                'service' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:255',
                'message' => 'required|string',
            ]);

            Log::info('Validation passée');

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

            Log::info('Contact sauvegardé ID: ' . $contact->id);

            // Envoyer l'email
            Mail::to(env('MAIL_TO_ME', 'dims.creative.academy@gmail.com'))
                ->send(new ContactMail($validated));

            Log::info('Email envoyé avec succès');

            return redirect()->back()->with('success', 'Message envoyé avec succès !');

        } catch (\Exception $e) {
            Log::error('Erreur envoi message: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return redirect()->back()->withErrors(['error' => 'Erreur lors de l\'envoi: ' . $e->getMessage()]);
        }
    }
}
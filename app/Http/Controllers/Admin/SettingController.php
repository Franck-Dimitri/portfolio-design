<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Afficher le panneau de configuration des paramètres
     */
    public function index()
    {
        $settings = Setting::all()->groupBy('group');

        // Formater les settings par clé
        $formatted = [];
        foreach (Setting::all() as $s) {
            $formatted[$s->key] = $s->type === 'boolean' ? ($s->value === '1' || $s->value === 'true') : $s->value;
        }

        return Inertia::render('Admin/pages/Param', [
            'settings' => $formatted,
            'grouped' => $settings,
        ]);
    }

    /**
     * Mettre à jour les paramètres
     */
    public function update(Request $request)
    {
        $data = $request->all();

        // Définition des métadonnées des paramètres supportés
        $definitions = [
            // Général & Identité
            'agency_name'        => ['group' => 'general', 'type' => 'text', 'label' => 'Nom de l\'agence', 'description' => 'Nom officiel affiché sur le site et les factures'],
            'agency_tagline'     => ['group' => 'general', 'type' => 'text', 'label' => 'Slogan de l\'agence', 'description' => 'Slogan affiché dans le footer et les emails'],
            'contact_email'      => ['group' => 'general', 'type' => 'text', 'label' => 'Email public de contact', 'description' => 'Email affiché sur le site pour les demandes générales'],
            'contact_phone'      => ['group' => 'general', 'type' => 'text', 'label' => 'Téléphone de contact', 'description' => 'Numéro de téléphone principal'],
            'office_address'     => ['group' => 'general', 'type' => 'text', 'label' => 'Adresse physique', 'description' => 'Localisation ou ville de l\'agence'],

            // Communication & WhatsApp
            'whatsapp_number'    => ['group' => 'contact', 'type' => 'text', 'label' => 'Numéro WhatsApp officiel', 'description' => 'Numéro au format international (ex: 237690112233)'],
            'whatsapp_auto_msg'  => ['group' => 'contact', 'type' => 'textarea', 'label' => 'Message WhatsApp pré-rempli', 'description' => 'Message par défaut lors d\'un clic sur le bouton WhatsApp'],
            'notification_email_admin' => ['group' => 'contact', 'type' => 'text', 'label' => 'Email de notification admin', 'description' => 'Adresse recevant les alertes de commandes et formulaires'],

            // Finance & Facturation
            'default_currency'   => ['group' => 'financial', 'type' => 'text', 'label' => 'Devise principale', 'description' => 'Devise d\'affichage (ex: FCFA, EUR, USD)'],
            'tax_rate'           => ['group' => 'financial', 'type' => 'number', 'label' => 'Taux de TVA (%)', 'description' => 'Taux de taxe applicable sur les factures'],
            'invoice_prefix'     => ['group' => 'financial', 'type' => 'text', 'label' => 'Préfixe des factures', 'description' => 'Ex: DCA-FAC-'],
            'bank_info'          => ['group' => 'financial', 'type' => 'textarea', 'label' => 'Mentions bancaires / RIB', 'description' => 'Informations de virement affichées en pied de facture'],

            // Réseaux sociaux
            'social_behance'     => ['group' => 'social', 'type' => 'text', 'label' => 'Profil Behance', 'description' => 'URL complète de votre portfolio Behance'],
            'social_dribbble'    => ['group' => 'social', 'type' => 'text', 'label' => 'Profil Dribbble', 'description' => 'URL complète de votre profil Dribbble'],
            'social_linkedin'    => ['group' => 'social', 'type' => 'text', 'label' => 'Page / Profil LinkedIn', 'description' => 'URL complète de votre profil LinkedIn'],
            'social_instagram'   => ['group' => 'social', 'type' => 'text', 'label' => 'Compte Instagram', 'description' => 'URL de votre compte Instagram'],
            'social_github'      => ['group' => 'social', 'type' => 'text', 'label' => 'Profil GitHub', 'description' => 'URL de votre profil GitHub'],

            // SEO & Système
            'meta_default_title' => ['group' => 'seo', 'type' => 'text', 'label' => 'Méta Titre SEO par défaut', 'description' => 'Titre de la balise title si non spécifié'],
            'meta_default_desc'  => ['group' => 'seo', 'type' => 'textarea', 'label' => 'Méta Description SEO par défaut', 'description' => 'Description dans les résultats de recherche Google'],
            'maintenance_mode'   => ['group' => 'seo', 'type' => 'boolean', 'label' => 'Mode Maintenance', 'description' => 'Activer un bandeau ou écran de maintenance'],
        ];

        foreach ($definitions as $key => $meta) {
            if (array_key_exists($key, $data)) {
                $val = $data[$key];
                Setting::set(
                    $key,
                    $val,
                    $meta['group'],
                    $meta['type'],
                    $meta['label'],
                    $meta['description']
                );
            }
        }

        ActivityLogger::system("Mise à jour des paramètres globaux du système", 'info');

        return back()->with('success', 'Paramètres enregistrés et appliqués avec succès.');
    }
}

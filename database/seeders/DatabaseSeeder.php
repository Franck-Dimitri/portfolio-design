<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\Livrable;
use App\Models\SubscriptionMessage;
use App\Models\Setting;
use App\Services\ActivityLogger;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ── 1. Administrateur Principal ──
        $admin = User::firstOrCreate(
            ['email' => 'admin@dimscreative.com'],
            [
                'name' => 'Franck Dimitri (Admin DCA)',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // ── 2. Clients de Démonstration ──
        $client1 = User::firstOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Alexandre Kamga',
                'password' => Hash::make('password'),
                'role' => 'client',
                'phone' => '+237690112233',
                'email_verified_at' => now(),
            ]
        );

        $client2 = User::firstOrCreate(
            ['email' => 'sarah.m@techcorp.cm'],
            [
                'name' => 'Sarah Mbarga',
                'password' => Hash::make('password'),
                'role' => 'client',
                'phone' => '+237677889900',
                'email_verified_at' => now(),
            ]
        );

        // ── 3. Services de Design ──
        $service1 = Service::firstOrCreate(
            ['slug' => 'identite-visuelle-branding'],
            [
                'titre' => 'Identité Visuelle & Branding',
                'description' => 'Conception complète de logo, charte graphique, typographies et déclinaisons de marque.',
                'cathegorie' => 'branding',
                'prix' => 150000,
                'starting_price' => 150000,
                'delaie_livraison' => '5 jours',
                'is_active' => true,
            ]
        );

        $service2 = Service::firstOrCreate(
            ['slug' => 'ui-ux-web-mobile-design'],
            [
                'titre' => 'UI/UX Web & Mobile Design',
                'description' => 'Design d interfaces utilisateur modernes, prototypes Figma interactifs et design systems.',
                'cathegorie' => 'ui/ux design',
                'prix' => 250000,
                'starting_price' => 250000,
                'delaie_livraison' => '7 jours',
                'is_active' => true,
            ]
        );

        // ── 4. Packs de Design Graphique ──
        $packStarter = ServicePackage::firstOrCreate(
            ['slug' => 'pack-starter-branding'],
            [
                'titre' => 'Pack Starter Branding',
                'description' => 'Idéal pour lancer votre marque avec une identité visuelle professionnelle.',
                'description_courte' => 'Logo, déclinaisons et kit réseaux sociaux.',
                'prix' => 100000,
                'nombre_design' => 5,
                'nombre_revision' => 3,
                'delai_livraison' => 3,
                'is_active' => true,
                'is_populaire' => false,
                'couleur_badge' => '#3b82f6',
            ]
        );

        $packPro = ServicePackage::firstOrCreate(
            ['slug' => 'pack-pro-growth'],
            [
                'titre' => 'Pack Pro Growth',
                'description' => 'La solution tout-en-un pour les entreprises exigeantes et startups en croissance.',
                'description_courte' => 'Design illimité, priorité absolue et support direct.',
                'prix' => 250000,
                'nombre_design' => 15,
                'nombre_revision' => 10,
                'delai_livraison' => 5,
                'is_active' => true,
                'is_populaire' => true,
                'couleur_badge' => '#f97316',
            ]
        );

        // ── 5. Commandes & Souscriptions ──
        $sub1 = Subscription::firstOrCreate(
            ['reference' => 'DCA-K9281A'],
            [
                'user_id' => $client1->id,
                'service_package_id' => $packPro->id,
                'duration_months' => 1,
                'status' => 'active',
                'statut_production' => 'en_cours',
                'client_nom' => $client1->name,
                'client_email' => $client1->email,
                'client_telephone' => '+237690112233',
                'client_whatsapp' => '+237690112233',
                'besoins' => 'Création complète de l identité visuelle pour notre nouvelle application SaaS financière.',
                'date_debut_production' => now()->subDays(2),
                'date_livraison_estimee' => now()->addDays(3),
            ]
        );

        Payment::firstOrCreate(
            ['subscription_id' => $sub1->id],
            [
                'user_id' => $client1->id,
                'amount' => 250000,
                'currency' => 'XAF',
                'payment_method' => 'momo',
                'transaction_reference' => 'TRX-' . strtoupper(Str::random(10)),
                'status' => 'success',
            ]
        );

        // Message dans le fil de discussion
        SubscriptionMessage::create([
            'subscription_id' => $sub1->id,
            'user_id' => $client1->id,
            'sender_type' => 'client',
            'message' => 'Bonjour Franck, nous avons bien renseigné le brief. Hâte de voir les premières propositions !',
            'is_read' => true,
        ]);

        SubscriptionMessage::create([
            'subscription_id' => $sub1->id,
            'user_id' => $admin->id,
            'sender_type' => 'admin',
            'message' => 'Bien reçu Alexandre ! Les recherches typographiques et moodboards sont lancés.',
            'is_read' => true,
        ]);

        $sub2 = Subscription::firstOrCreate(
            ['reference' => 'DCA-M4419B'],
            [
                'user_id' => $client2->id,
                'service_id' => $service1->id,
                'duration_months' => 1,
                'status' => 'active',
                'statut_production' => 'termine',
                'client_nom' => $client2->name,
                'client_email' => $client2->email,
                'client_telephone' => '+237677889900',
                'client_whatsapp' => '+237677889900',
                'besoins' => 'Refonte du logo d entreprise et déclinaison sur supports de communication.',
                'date_debut_production' => now()->subDays(6),
                'date_livraison_estimee' => now()->subDay(),
                'livre_le' => now()->subHours(5),
            ]
        );

        Payment::firstOrCreate(
            ['subscription_id' => $sub2->id],
            [
                'user_id' => $client2->id,
                'amount' => 150000,
                'currency' => 'XAF',
                'payment_method' => 'om',
                'transaction_reference' => 'TRX-' . strtoupper(Str::random(10)),
                'status' => 'success',
            ]
        );

        Livrable::create([
            'souscription_id' => $sub2->id,
            'nom' => 'Pack Identité Visuelle Finale HD',
            'fichier_path' => 'livrables/sample_identity_dca.zip',
            'fichier_nom_original' => 'Pack_Identite_Visuelle_Finale_HD.zip',
            'type' => 'livrable',
            'mime_type' => 'application/zip',
            'taille' => 18450000,
            'message' => 'Voici l ensemble des exports vectoriels (AI, SVG, PDF, PNG transparents).',
            'notifie_email' => true,
            'notifie_whatsapp' => true,
        ]);

        // ── 6. Activity Logs de Démonstration ──
        ActivityLogger::auth('auth.login', "Connexion réussie de l'administrateur Franck Dimitri", 'success');
        ActivityLogger::order('order.created', 'Commande #DCA-K9281A initiée par Alexandre Kamga', $sub1, 'success');
        ActivityLogger::payment('payment.success', 'Paiement de 250 000 FCFA validé (Réf: DCA-K9281A)', $sub1, 'success');
        ActivityLogger::order('deliverable.uploaded', 'Livrable final déposé pour la commande #DCA-M4419B', $sub2, 'info');

        // ── 7. Paramètres Globaux du Studio ──
        Setting::set('agency_name', "Dim's Creative Academy", 'general', 'text', 'Nom de l\'agence');
        Setting::set('agency_tagline', "Studio de Design Graphique, UI/UX & Identité de Marque", 'general', 'text', 'Slogan');
        Setting::set('contact_email', "contact@dimscreative.com", 'general', 'text', 'Email public');
        Setting::set('contact_phone', "+237 690 11 22 33", 'general', 'text', 'Téléphone');
        Setting::set('office_address', "Douala & Yaoundé, Cameroun", 'general', 'text', 'Adresse');

        Setting::set('whatsapp_number', "237690112233", 'contact', 'text', 'WhatsApp officiel');
        Setting::set('whatsapp_auto_msg', "Bonjour Franck, je vous contacte depuis votre portfolio Dim's Creative Academy.", 'contact', 'textarea', 'Message auto WhatsApp');
        Setting::set('notification_email_admin', "admin@dimscreative.com", 'contact', 'text', 'Email admin');

        Setting::set('default_currency', "FCFA", 'financial', 'text', 'Devise');
        Setting::set('tax_rate', 0, 'financial', 'number', 'TVA %');
        Setting::set('invoice_prefix', "DCA-FAC-", 'financial', 'text', 'Préfixe facture');

        Setting::set('social_behance', "https://behance.net/franckdimitri", 'social', 'text', 'Behance');
        Setting::set('social_dribbble', "https://dribbble.com/franckdimitri", 'social', 'text', 'Dribbble');
        Setting::set('social_linkedin', "https://linkedin.com/in/franckdimitri", 'social', 'text', 'LinkedIn');
        Setting::set('social_instagram', "https://instagram.com/dimscreative", 'social', 'text', 'Instagram');
        Setting::set('social_github', "https://github.com/mr-dims-tech", 'social', 'text', 'GitHub');

        Setting::set('meta_default_title', "Dim's Creative Academy — Design Graphique & Direction Artistique", 'seo', 'text', 'Méta Titre SEO');
        Setting::set('meta_default_desc', "Portfolio & Studio de Design spécialisé en UI/UX, identité visuelle, branding et accompagnement créatif sur mesure.", 'seo', 'textarea', 'Méta Description SEO');
        Setting::set('maintenance_mode', false, 'seo', 'boolean', 'Mode Maintenance');
    }
}

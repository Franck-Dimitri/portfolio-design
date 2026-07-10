<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\ServicePackage;

class DemoDataSeeder extends Seeder
{
    public function run()
    {
        // Nettoyage de la base de données
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Post::truncate();
        Project::truncate();
        Service::truncate();
        ServicePackage::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Création de 2 Blogs
        $blogs = [
            'L\'importance du White Space en UI',
            'Pourquoi utiliser le style Blueprint'
        ];

        foreach ($blogs as $i => $titre) {
            $post = new Post();
            $post->titre = $titre;
            $post->slug = Str::slug($titre) . '-' . uniqid();
            $post->sous_titre = 'Une analyse détaillée des meilleures pratiques.';
            $post->courte_description = 'Découvrez comment améliorer vos interfaces avec ces astuces simples mais puissantes.';
            $post->contenue = "### 1. Introduction\nVoici un article de démonstration généré automatiquement. Il s'agit d'un contenu structuré en **Markdown** pour tester le rendu.\n\n### 2. Le concept\nLe design est essentiel pour l'expérience utilisateur.\n\n> \"Un bon design est invisible.\"\n\n* Point 1\n* Point 2\n* Point 3\n\n### 3. Conclusion\nMerci d'avoir lu cet article !";
            $post->temps_lecture = rand(3, 10);
            $post->is_published = true;
            $post->published_at = now()->subDays(rand(1, 30));
            $post->cathegorie = ['Design', 'UI/UX']; // Casts to array
            $post->save();
        }

        // 2. Création de 10 Projets
        for ($i = 1; $i <= 10; $i++) {
            $project = new Project();
            $project->titre = "Projet Démo #$i - Identité Visuelle";
            $project->description = "Ceci est un projet généré automatiquement pour présenter une identité visuelle complète. Le client souhaitait un design minimaliste et moderne.";
            $project->slug = Str::slug($project->titre) . '-' . uniqid();
            $project->cathegorie = "branding";
            $project->outils = ["Figma", "Illustrator", "Photoshop"];
            $project->prix = rand(500, 5000);
            $project->is_featured = ($i <= 3);
            $project->is_published = true;
            $project->views = rand(50, 1000);
            $project->save();
        }

        // 3. Création de 6 Services
        $services = [
            ['titre' => 'Conception d\'Identité Visuelle', 'cat' => 'branding'],
            ['titre' => 'Design d\'Interface Web (UI/UX)', 'cat' => 'ui/ux design'],
            ['titre' => 'Création de Contenu Réseaux Sociaux', 'cat' => 'social media design'],
            ['titre' => 'Creation de logo professionnel', 'cat' => 'logo design'],
            ['titre' => 'Illustration Sur-mesure', 'cat' => 'illustration'],
            ['titre' => 'Conception de Flyers multi-format', 'cat' => 'flyer design']
        ];


        foreach ($services as $srv) {
            $service = new Service();
            $service->titre = $srv['titre'];
            $service->slug = Str::slug($srv['titre']);
            $service->description = "Description détaillée du service {$srv['titre']}. Ce service vous permet d'obtenir un résultat professionnel adapté à vos besoins spécifiques.";
            $service->cathegorie = strtolower($srv['cat']);
            $service->starting_price = rand(200, 800);
            $service->prix = rand(200, 800);
            $service->delaie_livraison = rand(3, 14) . " jours";
            $service->outils = ["Figma", "Creative Cloud"];
            $service->livrables = ["Fichiers sources", "Export HD", "Guide d'utilisation"];
            $service->features = ["Accompagnement personnalisé", "Support 30 jours", "2 Révisions incluses"];
            $service->is_featured = true;
            $service->is_active = true;
            $service->save();
        }

        // 4. Création de 10 Packs (ServicePackage)
        $packNames = ['Starter', 'Pro', 'Business', 'Entreprise', 'Elite', 'Premium', 'Basic', 'Ultimate', 'Standard', 'Custom'];
        foreach ($packNames as $idx => $name) {
            $pack = new ServicePackage();
            $pack->titre = "Pack $name";
            $pack->slug = Str::slug($pack->titre);
            $pack->description = "Le Pack idéal pour démarrer ou propulser votre entreprise avec un design professionnel et impactant.";
            $pack->description_courte = "L'essentiel pour votre marque.";
            $pack->prix = rand(100, 900) * 1000; // ex: 100 000 FCFA
            $pack->devise = "FCFA";
            $pack->nombre_design = rand(1, 5);
            $pack->delai_livraison = rand(2, 10);
            $pack->nombre_revision = rand(1, 3);
            $pack->features = ["Analyse des besoins", "Création sur-mesure", "Droits cédés"];
            $pack->livrables = ["PNG/JPG", "Vectoriel"];
            $pack->services = ["Logo", "Carte de visite"];
            $pack->non_inclus = ["Animation", "Impression"];
            $pack->is_populaire = ($idx == 1 || $idx == 4);
            $pack->is_active = true;
            $pack->ordre = $idx + 1;
            $pack->save();
        }
    }
}

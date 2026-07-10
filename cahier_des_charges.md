
# Cahier des Charges - Dims Creative Academy

## 1. Présentation du Projet

**Nom du Projet :** Plateforme Web Dims Creative Academy
**Description :** Une application web moderne de type "Portfolio & Agence" pour Dims Creative Academy. L'objectif principal est de présenter les services de design graphique, d'afficher un portfolio professionnel, de vendre des packages de services sous forme de souscriptions récurrentes ou ponctuelles, et d'animer une communauté via un blog technique spécialisé.

## 2. Objectifs de la Plateforme

* **Vitrine Professionnelle :** Mettre en avant le travail, l'expertise et la marque de Franck Dims (UI/UX, Branding, Graphic Design).
* **Vente de Services :** Permettre aux clients d'acheter des packages de design directement sur la plateforme avec une intégration de paiement sécurisée.
* **Gestion Clientèle :** Disposer d'un tableau de bord pour administrer les souscriptions, suivre l'état d'avancement des projets et gérer les livrables.
* **Partage de Connaissances :** Animer un blog technique au design "Blueprint" (architectural et structuré) pour partager des analyses et attirer du trafic organique.

## 3. Architecture Technique

* **Backend :** Laravel 11.x (Framework PHP).
* **Frontend public et Admin :** React.js propulsé par Inertia.js.
* **Stylisation :** Tailwind CSS (utilisation d'un thème sombre, esthétique Blueprint/Architecture avec polices monospace, grilles subtiles).
* **Base de données :** MySQL ou équivalent SQL géré via Eloquent ORM.
* **Paiement :** API CinetPay intégrée pour la gestion des transactions (Webhook, check status, etc.).
* **Gestion des médias :** Intervention Image (v4) pour le redimensionnement et le traitement automatique des images uploadées.
* **Rendu Markdown :** react-markdown avec remark-gfm pour l'affichage structuré des articles de blog.

## 4. Fonctionnalités Clés

### 4.1 Espace Public

* **Page d'Accueil :** Présentation globale de l'agence, mise en avant des meilleurs projets et services.
* **Portfolio (Projets) :** Galerie dynamique des réalisations avec fiches détaillées (description, images, client).
* **Services & Packages :** Catalogue des offres (ex: Branding, UI/UX). Possibilité de souscrire directement à un package via CinetPay.
* **Blog :** Liste des articles avec un design "Blueprint" (style technique et sombre). Page de lecture optimisée pour le Markdown (Sommaire automatique, mise en forme avancée).
* **Contact & À Propos :** Formulaire de contact et présentation du designer.

### 4.2 Espace Client / Paiement

* **Processus de Souscription :** Sélection d'un package, formulaire d'information, redirection vers CinetPay, retour et confirmation.
* **Suivi :** Suivi du statut de la commande via une référence de paiement.

### 4.3 Espace Administration (Dashboard)

Sécurisé par authentification Laravel Breeze.

* **Gestion des Projets :** CRUD (Création, Lecture, Mise à jour, Suppression) complet avec upload d'images.
* **Gestion des Services & Packages :** CRUD des offres commerciales, prix et descriptions.
* **Gestion des Blogs :** Editeur d'articles supportant le Markdown, upload de la couverture, gestion des catégories, toggle de publication (brouillon/publié).
* **Gestion des Souscriptions :** Suivi des commandes clients, mise à jour des statuts (En attente, En cours, Terminé), ajout de livrables.

## 5. Design & Ergonomie (UI/UX)

* **Thème :** "Blueprint Style Architecture" (Sombre, Professionnel, Technique).
* **Couleurs :** Fonds très sombres (`#0A0A0A`, `#111111`), accents Cyan/Bleu (`primary-500`) ou orange, textes gris clair pour un haut contraste.
* **Typographie :** Polices "Display" massives pour les titres, polices "Monospace" pour les métadonnées (Dates, Tags, ID), polices "Sans-serif" lisibles pour le contenu.
* **Composants visuels :** Utilisation de grilles de fond (grid-pattern), coins marqués (borders), boutons à fort contraste, hiérarchie visuelle stricte.

## 6. Hébergement et Déploiement

* **Serveur :** Serveur Linux (VPS ou mutualisé performant supportant PHP 8.2+ et Node.js pour le build de Vite).
* **Stockage :** Stockage local (dossier `storage/app/public`) mis en lien symbolique pour les assets (images).
* **Sécurité :** HTTPS requis, protection CSRF/XSS gérée par Laravel, validation stricte des webhooks de paiement.

---

*Généré par Antigravity AI pour Dims Creative Academy.*

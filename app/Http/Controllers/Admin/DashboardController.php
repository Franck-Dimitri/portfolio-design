<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\Post;
use App\Models\Contact;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // ── Statistiques Principales ──────────────────────────────
        $totalProjects = Project::count();
        $publishedProjects = Project::where('is_published', true)->count();
        $totalViews = Project::sum('views') + Post::sum('views');

        $totalServices = Service::count();
        $totalPackages = ServicePackage::count();

        $totalSubscriptions = Subscription::count();
        $payeesSubscriptions = Subscription::paye()->count();
        $enCoursSubscriptions = Subscription::whereIn('statut_production', ['en_cours', 'en_revision'])->count();
        $termineesSubscriptions = Subscription::where('statut_production', 'termine')->count();

        // Calcul du CA total (Paiements réussis)
        $caTotal = Payment::where('status', 'success')->sum('amount');
        if ($caTotal == 0) {
            // Fallback si pas encore de paiements directs
            $caTotal = Subscription::paye()->get()->sum(fn($s) => $s->montant);
        }

        $totalPosts = Post::count();
        $unreadContacts = Contact::where('is_read', false)->count();

        // ── Données Graphique Mensuel (6 derniers mois) ───────────
        $chartMonths = [];
        $chartRevenue = [];
        $chartOrders = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthLabel = $date->translatedFormat('M Y');
            $chartMonths[] = $monthLabel;

            $monthStart = $date->copy()->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();

            $monthRev = Payment::where('status', 'success')
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->sum('amount');
            $chartRevenue[] = (int) $monthRev;

            $monthOrd = Subscription::whereBetween('created_at', [$monthStart, $monthEnd])->count();
            $chartOrders[] = $monthOrd;
        }

        // ── Données Récentes ─────────────────────────────────────
        $recentSubscriptions = Subscription::with(['user', 'servicePackage', 'service', 'payment'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($sub) {
                return [
                    'id' => $sub->id,
                    'reference' => $sub->reference,
                    'client_nom' => $sub->client_nom ?: ($sub->user?->name ?? 'Client'),
                    'client_email' => $sub->client_email ?: ($sub->user?->email ?? '—'),
                    'type' => $sub->servicePackage ? 'Pack' : 'Service',
                    'titre' => $sub->servicePackage ? $sub->servicePackage->titre : ($sub->service ? $sub->service->titre : 'Sur-mesure'),
                    'montant' => $sub->montant,
                    'montant_formate' => $sub->montant_formate,
                    'statut_paiement' => $sub->statut_paiement,
                    'statut_production' => $sub->statut_production,
                    'created_at' => $sub->created_at->format('d M Y'),
                ];
            });

        $recentProjects = Project::with('images')
            ->latest()
            ->limit(5)
            ->get();

        $recentContacts = Contact::latest()
            ->limit(5)
            ->get();

        return Inertia::render('Admin/pages/Dashboard', [
            'stats' => [
                'total_projects' => $totalProjects,
                'published_projects' => $publishedProjects,
                'total_views' => $totalViews,
                'total_services' => $totalServices,
                'total_packages' => $totalPackages,
                'total_subscriptions' => $totalSubscriptions,
                'active_subscriptions' => $payeesSubscriptions,
                'in_progress_subscriptions' => $enCoursSubscriptions,
                'completed_subscriptions' => $termineesSubscriptions,
                'ca_total' => $caTotal,
                'ca_total_formate' => number_format($caTotal, 0, ',', ' ') . ' FCFA',
                'total_posts' => $totalPosts,
                'unread_contacts' => $unreadContacts,
            ],
            'chart' => [
                'labels' => $chartMonths,
                'revenue' => $chartRevenue,
                'orders' => $chartOrders,
            ],
            'recentSubscriptions' => $recentSubscriptions,
            'recentProjects' => $recentProjects,
            'recentContacts' => $recentContacts,
        ]);
    }
}

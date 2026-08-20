<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionMessage;
use App\Models\Livrable;
use App\Models\User;
use App\Models\Setting;
use App\Models\Payment;
use App\Notifications\NouveauMessageSouscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ClientDashboardController extends Controller
{
    /**
     * Onglet 1 : Tableau de bord (Vue d'ensemble)
     */
    public function index()
    {
        $user = Auth::user();

        $subscriptions = Subscription::where('user_id', $user->id)
            ->with(['servicePackage', 'service', 'livrables', 'payment'])
            ->latest()
            ->get();

        $activeOrders = $subscriptions->whereIn('statut_production', ['non_demarre', 'en_cours', 'en_revision']);
        $completedOrders = $subscriptions->where('statut_production', 'termine');

        $subIds = $subscriptions->pluck('id');
        $allDeliverables = Livrable::whereIn('souscription_id', $subIds)->latest()->get();

        // Commande prioritaire en cours
        $currentActiveOrder = $activeOrders->first() ?: $subscriptions->first();

        // Calcul du total investi
        $totalSpent = Payment::where('user_id', $user->id)
            ->where('status', 'success')
            ->sum('amount');

        return Inertia::render('Client/Dashboard', [
            'stats' => [
                'total_commandes'  => $subscriptions->count(),
                'en_cours'         => $activeOrders->count(),
                'livrees'          => $completedOrders->count(),
                'total_livrables'  => $allDeliverables->count(),
                'total_investi'    => $totalSpent,
            ],
            'currentOrder'       => $currentActiveOrder ? $currentActiveOrder->load(['servicePackage', 'service', 'livrables', 'payment', 'messages']) : null,
            'recentOrders'       => $subscriptions->take(4)->values(),
            'recentDeliverables' => $allDeliverables->take(6)->values(),
            'whatsappNumber'     => Setting::get('whatsapp_number', '237690112233'),
        ]);
    }

    /**
     * Onglet 2 : Mes Commandes & Projets
     */
    public function souscriptions(Request $request)
    {
        $user = Auth::user();

        $query = Subscription::where('user_id', $user->id)
            ->with(['servicePackage', 'service', 'livrables', 'payment', 'messages'])
            ->latest();

        if ($request->filled('statut')) {
            $query->where('statut_production', $request->statut);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('reference', 'like', "%{$s}%")
                  ->orWhereHas('servicePackage', fn($sq) => $sq->where('titre', 'like', "%{$s}%"))
                  ->orWhereHas('service', fn($sq) => $sq->where('titre', 'like', "%{$s}%"));
            });
        }

        $allUserSubs = Subscription::where('user_id', $user->id)->get();

        return Inertia::render('Client/Souscriptions/Index', [
            'souscriptions' => $query->paginate(8)->withQueryString(),
            'filters' => $request->only(['statut', 'search']),
            'counts' => [
                'all'        => $allUserSubs->count(),
                'en_cours'   => $allUserSubs->where('statut_production', 'en_cours')->count(),
                'en_revision'=> $allUserSubs->where('statut_production', 'en_revision')->count(),
                'termine'    => $allUserSubs->where('statut_production', 'termine')->count(),
                'non_demarre'=> $allUserSubs->where('statut_production', 'non_demarre')->count(),
            ],
            'whatsappNumber' => Setting::get('whatsapp_number', '237690112233'),
        ]);
    }

    /**
     * Suivi détaillé d'une commande
     */
    public function show(Subscription $subscription)
    {
        $user = Auth::user();

        if ($subscription->user_id !== $user->id && $user->role !== 'admin') {
            abort(403, 'Accès non autorisé.');
        }

        $subscription->load([
            'servicePackage',
            'service',
            'livrables',
            'payment',
            'messages.user',
            'activities'
        ]);

        return Inertia::render('Client/Souscriptions/Show', [
            'souscription'   => $subscription,
            'whatsappNumber' => Setting::get('whatsapp_number', '237690112233'),
        ]);
    }

    /**
     * Onglet 3 : Mes Livrables & Fichiers
     */
    public function livrables(Request $request)
    {
        $user = Auth::user();
        $subIds = Subscription::where('user_id', $user->id)->pluck('id');

        $query = Livrable::whereIn('souscription_id', $subIds)
            ->with(['souscription.servicePackage', 'souscription.service'])
            ->latest();

        if ($request->filled('type')) {
            $t = $request->type;
            if ($t === 'zip') {
                $query->where(fn($q) => $q->where('fichier_path', 'like', '%.zip')->orWhere('fichier_nom_original', 'like', '%.zip'));
            } elseif ($t === 'pdf') {
                $query->where(fn($q) => $q->where('fichier_path', 'like', '%.pdf')->orWhere('fichier_nom_original', 'like', '%.pdf'));
            } elseif ($t === 'image') {
                $query->where(fn($q) => $q->where('fichier_path', 'like', '%.png')
                    ->orWhere('fichier_path', 'like', '%.jpg')
                    ->orWhere('fichier_path', 'like', '%.svg')
                    ->orWhere('fichier_nom_original', 'like', '%.png')
                    ->orWhere('fichier_nom_original', 'like', '%.svg'));
            } elseif ($t === 'link') {
                $query->where('type', 'lien');
            }
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nom', 'like', "%{$s}%")
                  ->orWhere('fichier_nom_original', 'like', "%{$s}%")
                  ->orWhere('message', 'like', "%{$s}%");
            });
        }

        return Inertia::render('Client/Livrables/Index', [
            'livrables' => $query->paginate(12)->withQueryString(),
            'filters'   => $request->only(['type', 'search']),
            'stats'     => [
                'total'  => Livrable::whereIn('souscription_id', $subIds)->count(),
                'zips'   => Livrable::whereIn('souscription_id', $subIds)->where('fichier_path', 'like', '%.zip')->count(),
                'images' => Livrable::whereIn('souscription_id', $subIds)->where(fn($q) => $q->where('fichier_path', 'like', '%.png')->orWhere('fichier_path', 'like', '%.svg'))->count(),
            ],
            'whatsappNumber' => Setting::get('whatsapp_number', '237690112233'),
        ]);
    }

    /**
     * Onglet 4 : Messagerie & Support Studio
     */
    public function messages(Request $request)
    {
        $user = Auth::user();
        $subscriptions = Subscription::where('user_id', $user->id)
            ->with(['servicePackage', 'service', 'messages.user'])
            ->latest()
            ->get();

        $selectedSubId = $request->get('sub_id', $subscriptions->first()?->id);
        $selectedSubscription = $subscriptions->firstWhere('id', $selectedSubId) ?: $subscriptions->first();

        if ($selectedSubscription) {
            $selectedSubscription->load(['messages.user', 'servicePackage', 'service']);
        }

        return Inertia::render('Client/Messages/Index', [
            'subscriptions'        => $subscriptions,
            'selectedSubscription' => $selectedSubscription,
            'whatsappNumber'       => Setting::get('whatsapp_number', '237690112233'),
            'adminEmail'           => Setting::get('contact_email', 'contact@dimscreative.com'),
        ]);
    }

    /**
     * Onglet 5 : Mes Factures & Reçus
     */
    public function factures(Request $request)
    {
        $user = Auth::user();

        $subscriptions = Subscription::where('user_id', $user->id)
            ->with(['servicePackage', 'service', 'payment'])
            ->latest()
            ->get();

        $totalSpent = $subscriptions->where('payment.status', 'success')->sum(fn($s) => $s->payment->amount ?? $s->getTotalAmount());

        return Inertia::render('Client/Factures/Index', [
            'subscriptions'  => $subscriptions,
            'totalSpent'     => $totalSpent,
            'defaultCurrency'=> Setting::get('default_currency', 'FCFA'),
            'whatsappNumber' => Setting::get('whatsapp_number', '237690112233'),
        ]);
    }

    /**
     * Onglet 6 : Mon Profil & Préférences
     */
    public function profil()
    {
        $user = Auth::user();

        return Inertia::render('Client/Profil/Index', [
            'user' => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'phone'      => $user->phone,
                'whatsapp'   => $user->whatsapp ?? $user->phone,
                'created_at' => $user->created_at->format('d/m/Y'),
            ],
            'whatsappNumber' => Setting::get('whatsapp_number', '237690112233'),
        ]);
    }

    /**
     * Mise à jour du profil client
     */
    public function updateProfil(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone'    => 'nullable|string|max:30',
            'whatsapp' => 'nullable|string|max:30',
            'password' => ['nullable', Password::defaults(), 'confirmed'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? null;
        if (isset($validated['whatsapp'])) {
            $user->whatsapp = $validated['whatsapp'];
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return back()->with('success', 'Vos informations ont été mises à jour avec succès.');
    }

    /**
     * Envoi de message sur une commande
     */
    public function sendMessage(Request $request, Subscription $subscription)
    {
        $user = Auth::user();

        if ($subscription->user_id !== $user->id && $user->role !== 'admin') {
            abort(403, 'Accès non autorisé.');
        }

        $request->validate([
            'message'    => 'required|string|max:2000',
            'attachment' => 'nullable|file|max:20480', // 20 MB max
        ]);

        $path = null;
        $name = null;
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $name = $file->getClientOriginalName();
            $path = $file->store("messages/{$subscription->id}", 'public');
        }

        $message = SubscriptionMessage::create([
            'subscription_id' => $subscription->id,
            'user_id'         => $user->id,
            'sender_type'     => 'client',
            'message'         => $request->message,
            'attachment_path' => $path,
            'attachment_name' => $name,
            'is_read'         => false,
        ]);

        $subscription->logActivity('message_sent', "Message envoyé par le client ({$user->name})");

        // Notification de l'administration
        try {
            $adminEmail = Setting::get('notification_email_admin', Setting::get('contact_email', 'admin@dimscreative.com'));
            Notification::route('mail', $adminEmail)->notify(new NouveauMessageSouscription($subscription, $message));

            User::where('role', 'admin')->get()->each(function ($admin) use ($subscription, $message) {
                $admin->notify(new NouveauMessageSouscription($subscription, $message));
            });
        } catch (\Exception $e) {
            Log::warning("Échec notification admin nouveau message: " . $e->getMessage());
        }

        return back()->with('success', 'Message transmis au designer.');
    }
}

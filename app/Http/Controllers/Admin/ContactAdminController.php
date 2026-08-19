<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = Contact::latest();

        if ($request->filled('status')) {
            if ($request->status === 'unread') {
                $query->where('is_read', false);
            } elseif ($request->status === 'read') {
                $query->where('is_read', true);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $contacts = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/pages/Contacts/Index', [
            'contacts' => $contacts,
            'filters'  => $request->only(['status', 'search']),
            'stats'    => [
                'total'  => Contact::count(),
                'unread' => Contact::where('is_read', false)->count(),
                'read'   => Contact::where('is_read', true)->count(),
            ]
        ]);
    }

    public function toggleRead($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->update(['is_read' => !$contact->is_read]);

        return back()->with('success', 'Statut du message mis à jour.');
    }

    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return back()->with('success', 'Message supprimé avec succès.');
    }
}

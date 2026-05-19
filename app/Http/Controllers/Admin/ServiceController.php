<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::latest()->get();
        
        return inertia('Admin/pages/Services', [
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'cathegorie' => 'nullable|string|max:255',
                'prix' => 'nullable|numeric',
                'starting_price' => 'nullable|numeric',
                'delaie_livraison' => 'nullable|string|max:255',
                'outils' => 'nullable|string',  // Changé de json à string
                'livrables' => 'nullable|string', // Changé de json à string
                'features' => 'nullable|string', // Changé de json à string
                'is_featured' => 'boolean',
                'is_active' => 'boolean', // Changé de is_published à is_active
            ]);

            // Décoder les JSON (maintenant ce sont des strings)
            $outils = json_decode($request->outils, true) ?: [];
            $livrables = json_decode($request->livrables, true) ?: [];
            $features = json_decode($request->features, true) ?: [];

            // Filtrer les valeurs vides
            $outils = array_values(array_filter($outils, fn($item) => !empty(trim($item))));
            $livrables = array_values(array_filter($livrables, fn($item) => !empty(trim($item))));
            $features = array_values(array_filter($features, fn($item) => !empty(trim($item))));

            // Validation des minimums
            if (count($outils) < 3) {
                return back()->withErrors(['outils' => 'Veuillez ajouter au moins 3 outils/technologies'])->withInput();
            }
            if (count($livrables) < 2) {
                return back()->withErrors(['livrables' => 'Veuillez ajouter au moins 2 livrables'])->withInput();
            }
            if (count($features) < 3) {
                return back()->withErrors(['features' => 'Veuillez ajouter au moins 3 fonctionnalités'])->withInput();
            }

            // Créer le service
            $service = Service::create([
                'titre' => $request->titre,
                'description' => $request->description,
                'cathegorie' => $request->cathegorie,
                'prix' => $request->prix,
                'starting_price' => $request->starting_price,
                'delaie_livraison' => $request->delaie_livraison,
                'outils' => $outils,
                'livrables' => $livrables,
                'features' => $features,
                'is_featured' => (bool) $request->is_featured,
                'is_active' => (bool) $request->is_active,
                'slug' => Str::slug($request->titre) . '-' . uniqid(),
            ]);

            return redirect()->route('admin.services.index')
                ->with('success', 'Service créé avec succès !');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erreur : ' . $e->getMessage()])->withInput();
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $service = Service::findOrFail($id);

            $validated = $request->validate([
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'cathegorie' => 'nullable|string|max:255',
                'prix' => 'nullable|numeric',
                'starting_price' => 'nullable|numeric',
                'delaie_livraison' => 'nullable|string|max:255',
                'outils' => 'nullable|string', // Changé de json à string
                'livrables' => 'nullable|string', // Changé de json à string
                'features' => 'nullable|string', // Changé de json à string
                'is_featured' => 'boolean',
                'is_active' => 'boolean', // Changé de is_published à is_active
            ]);

            // Décoder les JSON
            $outils = json_decode($request->outils, true) ?: [];
            $livrables = json_decode($request->livrables, true) ?: [];
            $features = json_decode($request->features, true) ?: [];

            // Filtrer les valeurs vides
            $outils = array_values(array_filter($outils, fn($item) => !empty(trim($item))));
            $livrables = array_values(array_filter($livrables, fn($item) => !empty(trim($item))));
            $features = array_values(array_filter($features, fn($item) => !empty(trim($item))));

            if (count($outils) < 3) {
                return back()->withErrors(['outils' => 'Veuillez ajouter au moins 3 outils/technologies'])->withInput();
            }
            if (count($livrables) < 2) {
                return back()->withErrors(['livrables' => 'Veuillez ajouter au moins 2 livrables'])->withInput();
            }
            if (count($features) < 3) {
                return back()->withErrors(['features' => 'Veuillez ajouter au moins 3 fonctionnalités'])->withInput();
            }

            // Mettre à jour le service
            $service->update([
                'titre' => $request->titre,
                'description' => $request->description,
                'cathegorie' => $request->cathegorie,
                'prix' => $request->prix,
                'starting_price' => $request->starting_price,
                'delaie_livraison' => $request->delaie_livraison,
                'outils' => $outils,
                'livrables' => $livrables,
                'features' => $features,
                'is_featured' => (bool) $request->is_featured,
                'is_active' => (bool) $request->is_active,
            ]);

            return redirect()->route('admin.services.index')
                ->with('success', 'Service mis à jour avec succès !');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erreur : ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return back()->with('success', 'Service supprimé avec succès !');
    }
}
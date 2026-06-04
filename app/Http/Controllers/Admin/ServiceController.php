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
                'outils' => ['nullable', function ($attribute, $value, $fail) {
                    if (!is_string($value) && !is_array($value)) {
                        $fail('Le champ ' . $attribute . ' doit être une chaîne ou un tableau.');
                    }
                }],
                'outils.*' => 'string',
                'livrables' => ['nullable', function ($attribute, $value, $fail) {
                    if (!is_string($value) && !is_array($value)) {
                        $fail('Le champ ' . $attribute . ' doit être une chaîne ou un tableau.');
                    }
                }],
                'livrables.*' => 'string',
                'features' => ['nullable', function ($attribute, $value, $fail) {
                    if (!is_string($value) && !is_array($value)) {
                        $fail('Le champ ' . $attribute . ' doit être une chaîne ou un tableau.');
                    }
                }],
                'features.*' => 'string',
                'is_featured' => 'boolean',
                'is_active' => 'boolean', // Changé de is_published à is_active
            ]);

            $outils = $request->input('outils', []);
            if (is_string($outils)) {
                $outils = json_decode($outils, true) ?: [];
            }
            $outils = is_array($outils) ? $outils : [];

            $livrables = $request->input('livrables', []);
            if (is_string($livrables)) {
                $livrables = json_decode($livrables, true) ?: [];
            }
            $livrables = is_array($livrables) ? $livrables : [];

            $features = $request->input('features', []);
            if (is_string($features)) {
                $features = json_decode($features, true) ?: [];
            }
            $features = is_array($features) ? $features : [];

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
                'outils' => ['nullable', function ($attribute, $value, $fail) {
                    if (!is_string($value) && !is_array($value)) {
                        $fail('Le champ ' . $attribute . ' doit être une chaîne ou un tableau.');
                    }
                }],
                'outils.*' => 'string',
                'livrables' => ['nullable', function ($attribute, $value, $fail) {
                    if (!is_string($value) && !is_array($value)) {
                        $fail('Le champ ' . $attribute . ' doit être une chaîne ou un tableau.');
                    }
                }],
                'livrables.*' => 'string',
                'features' => ['nullable', function ($attribute, $value, $fail) {
                    if (!is_string($value) && !is_array($value)) {
                        $fail('Le champ ' . $attribute . ' doit être une chaîne ou un tableau.');
                    }
                }],
                'features.*' => 'string',
                'is_featured' => 'boolean',
                'is_active' => 'boolean', // Changé de is_published à is_active
            ]);

            $outils = $request->input('outils', []);
            if (is_string($outils)) {
                $outils = json_decode($outils, true) ?: [];
            }
            $outils = is_array($outils) ? $outils : [];

            $livrables = $request->input('livrables', []);
            if (is_string($livrables)) {
                $livrables = json_decode($livrables, true) ?: [];
            }
            $livrables = is_array($livrables) ? $livrables : [];

            $features = $request->input('features', []);
            if (is_string($features)) {
                $features = json_decode($features, true) ?: [];
            }
            $features = is_array($features) ? $features : [];

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
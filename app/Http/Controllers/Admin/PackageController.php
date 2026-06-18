<?php
// ══════════════════════════════════════════════════════════════
// app/Http/Controllers/Admin/PackageController.php
// ══════════════════════════════════════════════════════════════
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServicePackage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index()
    {
        $packages = ServicePackage::orderBy('ordre')->get();

        return Inertia::render('Admin/pages/Packages/Index', [
            'packages' => $packages,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'             => 'required|string|max:100',
            'description'       => 'nullable|string',
            'description_courte'=> 'nullable|string|max:200',
            'prix'              => 'required|integer|min:0',
            'prix_barre'        => 'nullable|integer|min:0',
            'nombre_design'     => 'nullable|integer|min:1',
            'delai_livraison'   => 'nullable|integer|min:1',
            'nombre_revision'   => 'required|integer|min:0',
            'features'          => 'nullable|array',
            'livrables'         => 'nullable|array',
            'services'          => 'nullable|array',
            'non_inclus'        => 'nullable|array',
            'couleur_badge'     => 'nullable|string',
            'icone'             => 'nullable|string',
            'is_populaire'      => 'boolean',
            'is_active'         => 'boolean',
            'ordre'             => 'nullable|integer',
        ]);

        $data['slug'] = Str::slug($data['titre']);

        ServicePackage::create($data);

        return back()->with('success', 'Pack créé avec succès.');
    }

    public function update(Request $request, ServicePackage $package)
    {
        $data = $request->validate([
            'titre'             => 'required|string|max:100',
            'description'       => 'nullable|string',
            'description_courte'=> 'nullable|string|max:200',
            'prix'              => 'required|integer|min:0',
            'prix_barre'        => 'nullable|integer|min:0',
            'nombre_design'     => 'nullable|integer|min:1',
            'delai_livraison'   => 'nullable|integer|min:1',
            'nombre_revision'   => 'required|integer|min:0',
            'features'          => 'nullable|array',
            'livrables'         => 'nullable|array',
            'services'          => 'nullable|array',
            'non_inclus'        => 'nullable|array',
            'couleur_badge'     => 'nullable|string',
            'icone'             => 'nullable|string',
            'is_populaire'      => 'boolean',
            'is_active'         => 'boolean',
            'ordre'             => 'nullable|integer',
        ]);

        if ($data['titre'] !== $package->titre) {
            $data['slug'] = Str::slug($data['titre']);
        }

        $package->update($data);

        return back()->with('success', 'Pack mis à jour.');
    }

    public function destroy(ServicePackage $package)
    {
        if ($package->souscriptions()->exists()) {
            return back()->withErrors(['delete' => 'Ce pack a des souscriptions actives.']);
        }
        $package->delete();
        return back()->with('success', 'Pack supprimé.');
    }

    public function toggleActif(ServicePackage $package)
    {
        $package->update(['is_active' => !$package->is_active]);
        return back()->with('success', 'Statut mis à jour.');
    }
}






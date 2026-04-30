<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('images')->latest()->get();
        
        $cathegories = [
            'logo design',
            'branding',
            'flyer design',
            'poster design',
            'social media design',
            'ui/ux design',
            'illustration',
            'autre'
        ];

        return inertia('Admin/pages/Projet', [
            'projects' => $projects,
            'cathegories' => $cathegories
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Validation des champs texte
            $validated = $request->validate([
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'cathegorie' => 'required|string',
                'prix' => 'nullable|numeric',
                'is_featured' => 'boolean',
                'is_published' => 'boolean',
            ]);

            // Vérifier les images
            if (!$request->hasFile('images')) {
                return back()->withErrors(['images' => 'Please select at least 4 images'])->withInput();
            }
            
            $images = $request->file('images');
            $imagesArray = is_array($images) ? $images : [$images];
            
            if (count($imagesArray) < 4) {
                return back()->withErrors(['images' => 'Minimum 4 images required'])->withInput();
            }

            // Traiter les outils
            $tools = [];
            if ($request->has('outils')) {
                $outilsInput = $request->input('outils');
                if (is_string($outilsInput)) {
                    $tools = json_decode($outilsInput, true) ?: [];
                } elseif (is_array($outilsInput)) {
                    $tools = $outilsInput;
                }
            }
            
            $tools = array_values(array_filter($tools, fn($tool) => !empty(trim($tool))));
            
            if (count($tools) < 3) {
                return back()->withErrors(['outils' => 'Please add at least 3 tools'])->withInput();
            }

            // Créer le slug
            $slug = Str::slug($request->titre);
            $originalSlug = $slug;
            $counter = 1;
            while (Project::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter++;
            }

            // Créer le projet
            $project = Project::create([
                'titre' => $request->titre,
                'description' => $request->description,
                'cathegorie' => $request->cathegorie,
                'prix' => $request->prix ?: null,
                'is_featured' => (bool) $request->is_featured,
                'is_published' => (bool) $request->is_published,
                'slug' => $slug,
                'outils' => $tools,
            ]);

            // Upload des images
            foreach ($imagesArray as $index => $image) {
                if ($image->isValid()) {
                    $filename = time() . '_' . $index . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('projects', $filename, 'public');
                    
                    $project->images()->create([
                        'path' => $path,
                        'type' => 'preview', // Utiliser 'preview' au lieu de 'image'
                        'position' => $index
                    ]);
                }
            }

            return redirect()->route('admin.projects.index')
                ->with('success', 'Project created successfully!');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function destroy(Project $project)
    {
        foreach ($project->images as $image) {
            Storage::disk('public')->delete($image->path);
        }
        
        $project->images()->delete();
        $project->delete();

        return back()->with('success', 'Project deleted');
    }
}
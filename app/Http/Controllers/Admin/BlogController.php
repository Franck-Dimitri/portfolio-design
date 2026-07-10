<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;

class BlogController extends Controller
{
    public function index()
    {
        $posts = Post::withCount('comments')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/pages/Blog/Index', [
            'posts' => $posts
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/pages/Blog/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'sous_titre' => 'nullable|string|max:255',
            'courte_description' => 'nullable|string',
            'contenue' => 'required|string',
            'image' => 'nullable|image|max:5120', // Max 5MB
            'cathegorie' => 'nullable|string',
            'temps_lecture' => 'nullable|integer',
            'is_published' => 'boolean',
        ]);

        $post = new Post();
        $post->titre = $validated['titre'];
        $post->slug = Str::slug($validated['titre']) . '-' . uniqid();
        $post->sous_titre = $validated['sous_titre'] ?? null;
        $post->courte_description = $validated['courte_description'] ?? null;
        $post->contenue = $validated['contenue'];
        $post->temps_lecture = $validated['temps_lecture'] ?? null;
        $post->is_published = $request->has('is_published') ? $request->boolean('is_published') : false;
        
        if ($post->is_published) {
            $post->published_at = now();
        }

        // Handle Categories as JSON array
        if (!empty($validated['cathegorie'])) {
            $cats = array_map('trim', explode(',', $validated['cathegorie']));
            $post->cathegorie = $cats;
        }

        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            $filename = 'posts/' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
            
            // Create image manager with desired driver
            $manager = new ImageManager(new Driver());
            
            // Read image from file system
            $image = $manager->decode($imageFile->getPathname());
            
            // Resize image proportionally to 1200px width max
            $image->scale(width: 1200);
            
            // Save to storage
            Storage::disk('public')->put($filename, $image->encode(new JpegEncoder(80))->toString());
            
            $post->image = $filename;
        }

        $post->save();

        return redirect()->route('admin.blogs.index')->with('success', 'Article créé avec succès.');
    }

    public function edit(Post $blog)
    {
        return Inertia::render('Admin/pages/Blog/Edit', [
            'post' => $blog
        ]);
    }

    public function update(Request $request, Post $blog)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'sous_titre' => 'nullable|string|max:255',
            'courte_description' => 'nullable|string',
            'contenue' => 'required|string',
            'image' => 'nullable|image|max:5120',
            'cathegorie' => 'nullable|string',
            'temps_lecture' => 'nullable|integer',
            'is_published' => 'boolean',
        ]);

        $blog->titre = $validated['titre'];
        // Update slug only if title changes significantly (optional, but let's keep original slug for SEO)
        $blog->sous_titre = $validated['sous_titre'] ?? null;
        $blog->courte_description = $validated['courte_description'] ?? null;
        $blog->contenue = $validated['contenue'];
        $blog->temps_lecture = $validated['temps_lecture'] ?? null;
        
        $wasPublished = $blog->is_published;
        $blog->is_published = $request->has('is_published') ? $request->boolean('is_published') : false;
        
        if (!$wasPublished && $blog->is_published) {
            $blog->published_at = now();
        }

        if (!empty($validated['cathegorie'])) {
            $cats = array_map('trim', explode(',', $validated['cathegorie']));
            $blog->cathegorie = $cats;
        }

        if ($request->hasFile('image')) {
            if ($blog->image) {
                Storage::disk('public')->delete($blog->image);
            }
            
            $imageFile = $request->file('image');
            $filename = 'posts/' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
            
            $manager = new ImageManager(new Driver());
            $image = $manager->decode($imageFile->getPathname());
            $image->scale(width: 1200);
            
            Storage::disk('public')->put($filename, $image->encode(new JpegEncoder(80))->toString());
            
            $blog->image = $filename;
        }

        $blog->save();

        return redirect()->route('admin.blogs.index')->with('success', 'Article mis à jour avec succès.');
    }

    public function destroy(Post $blog)
    {
        if ($blog->image) {
            Storage::disk('public')->delete($blog->image);
        }
        $blog->delete();

        return redirect()->route('admin.blogs.index')->with('success', 'Article supprimé avec succès.');
    }
}

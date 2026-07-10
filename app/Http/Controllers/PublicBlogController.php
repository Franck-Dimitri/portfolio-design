<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicBlogController extends Controller
{
    public function index()
    {
        $articles = Post::where('is_published', true)
            ->orderBy('published_at', 'desc')
            ->get();
            
        // Récupérer toutes les catégories uniques
        $categories = [];
        foreach ($articles as $article) {
            if ($article->cathegorie) {
                foreach ($article->cathegorie as $cat) {
                    if (!in_array($cat, $categories)) {
                        $categories[] = $cat;
                    }
                }
            }
        }

        return Inertia::render('blog/Blog', [
            'articles' => $articles,
            'categories' => $categories
        ]);
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)
            ->where('is_published', true)
            ->with(['comments' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])
            ->firstOrFail();

        // Increment views ? Mettre en place un système simple si nécessaire, 
        // ou utiliser les données mock pour les vues dans un premier temps.

        // Articles similaires
        $relatedPosts = Post::where('is_published', true)
            ->where('id', '!=', $post->id)
            ->inRandomOrder()
            ->limit(3)
            ->get();

        return Inertia::render('blog/BlogShow', [
            'post' => $post,
            'relatedPosts' => $relatedPosts
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
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

    public function show(Request $request, $slug)
    {
        $post = Post::where('slug', $slug)
            ->where('is_published', true)
            ->with(['comments' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])
            ->firstOrFail();

        // Increment views if not already viewed in this session
        $sessionKey = 'viewed_post_' . $post->id;
        if (!$request->session()->has($sessionKey)) {
            $post->increment('views');
            $request->session()->put($sessionKey, true);
        }

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

    public function like(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        
        $sessionKey = 'liked_post_' . $post->id;
        if (!$request->session()->has($sessionKey)) {
            $post->increment('likes');
            $request->session()->put($sessionKey, true);
        }

        return response()->json([
            'likes' => $post->likes,
            'has_liked' => true
        ]);
    }

    public function storeComment(Request $request, $id)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'commentaire' => 'required|string',
        ]);

        $post = Post::findOrFail($id);

        $comment = new Comment();
        $comment->post_id = $post->id;
        $comment->nom = $validated['nom'];
        $comment->email = $validated['email'];
        $comment->commentaire = $validated['commentaire'];
        $comment->save();

        return redirect()->back()->with('success', 'Votre commentaire a été ajouté avec succès.');
    }
}

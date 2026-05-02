<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class PublicProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('images')
            ->where('is_published', true)
            ->latest()
            ->get();
        
        return inertia('projects/Projet', [
            'projects' => $projects,
            'categories' => []
        ]);
    }

    public function show($slug)
    {
        $project = Project::with('images')
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();
        
        // Commentez ou supprimez cette ligne temporairement
        // $project->increment('views');
        
        // Projets similaires
        $relatedProjects = Project::with('images')
            ->where('cathegorie', $project->cathegorie)
            ->where('id', '!=', $project->id)
            ->where('is_published', true)
            ->limit(3)
            ->get();
        
        return inertia('projects/[slug]', [
            'project' => $project,
            'relatedProjects' => $relatedProjects
        ]);
    }
}
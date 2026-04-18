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
        $projects = Project::orderBy('created_at', 'desc')->get();
        return inertia('Admin/pages/Projet', [
            'projects' => $projects
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'cathegorie' => 'required|string',
            'outils' => 'nullable|json',
            'prix' => 'nullable|numeric',
            'image' => 'nullable|image|max:2048',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->titre);
        $data['outils'] = json_decode($request->outils, true) ?? [];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $data['image'] = $path;
        }

        Project::create($data);

        return redirect()->route('admin.projects.index')->with('success', 'Project created successfully');
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'cathegorie' => 'required|string',
            'outils' => 'nullable|json',
            'prix' => 'nullable|numeric',
            'image' => 'nullable|image|max:2048',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->titre);
        $data['outils'] = json_decode($request->outils, true) ?? [];

        if ($request->hasFile('image')) {
            if ($project->image) {
                Storage::disk('public')->delete($project->image);
            }
            $path = $request->file('image')->store('projects', 'public');
            $data['image'] = $path;
        }

        $project->update($data);

        return redirect()->route('admin.projects.index')->with('success', 'Project updated successfully');
    }

    public function destroy(Project $project)
    {
        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }
        
        $project->delete();
        
        return redirect()->route('admin.projects.index')->with('success', 'Project deleted successfully');
    }
}
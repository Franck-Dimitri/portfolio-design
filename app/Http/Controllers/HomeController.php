<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Service;

class HomeController extends Controller
{
    public function index()
    {
        $projects = Project::with('images')->latest()->get();
        $services = Service::where('is_active', true)->latest()->limit(6)->get();

        return inertia('Home', [
            'projects' => $projects,
            'services' => $services,
        ]);
    }
}

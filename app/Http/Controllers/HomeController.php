<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {


        $projects = Project::with('images')->latest()->get();
        // $services = Service::all();
        // $packages = Package::all();

        
        return inertia('Home', [
            'projects' => $projects,
            // 'services' => $services,
            // 'packages' => $packages
        ]);
    }
}

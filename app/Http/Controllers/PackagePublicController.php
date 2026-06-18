<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ServicePackage;
use Inertia\Inertia;

class PackagePublicController extends Controller
{
    public function index()
    {
        $packages = ServicePackage::actif()->get();
        
        return Inertia::render('packages/Package', [
            'packages' => $packages,
        ]);
    }

    public function show($slug)
    {
        $package = ServicePackage::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
        
        $relatedPackages = ServicePackage::where('is_active', true)
            ->where('id', '!=', $package->id)
            ->limit(3)
            ->get();
        
        return Inertia::render('packages/[slug]', [
            'package' => $package,
            'relatedPackages' => $relatedPackages,
        ]);
    }
}
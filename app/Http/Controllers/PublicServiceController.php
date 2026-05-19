<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class PublicServiceController extends Controller
{
    public function index()
    {
        $services = Service::where('is_active', true)->get();
        return inertia('services/Service', [
            'services' => $services,
            'categories' => []
        ]);
    }
    public function show($slug)
    {
        $service = Service::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $relatedServices = Service::where('cathegorie', $service->cathegorie)->where('id', '!=', $service->id)->where('is_active', true)->limit(3)->get();
        return inertia('services/[slug]', [
            'service' => $service,
            'relatedServices' => $relatedServices
        ]);
    }
}

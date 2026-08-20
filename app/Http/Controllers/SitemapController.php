<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\ServicePackage;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Génère un sitemap XML dynamique pour Google
     */
    public function sitemap(): Response
    {
        $baseUrl = url('/');

        // 1. Pages statiques
        $urls = [
            ['loc' => $baseUrl, 'lastmod' => now()->toAtomString(), 'changefreq' => 'weekly', 'priority' => '1.0'],
            ['loc' => "{$baseUrl}/projects", 'lastmod' => now()->toAtomString(), 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => "{$baseUrl}/services", 'lastmod' => now()->toAtomString(), 'changefreq' => 'monthly', 'priority' => '0.9'],
            ['loc' => "{$baseUrl}/packages", 'lastmod' => now()->toAtomString(), 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => "{$baseUrl}/blog", 'lastmod' => now()->toAtomString(), 'changefreq' => 'daily', 'priority' => '0.8'],
            ['loc' => "{$baseUrl}/a-propos", 'lastmod' => now()->toAtomString(), 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => "{$baseUrl}/contact", 'lastmod' => now()->toAtomString(), 'changefreq' => 'monthly', 'priority' => '0.7'],
        ];

        // 2. Projets du Portfolio
        $projects = Project::where('is_published', true)->orWhereNull('is_published')->get();
        foreach ($projects as $project) {
            $urls[] = [
                'loc' => "{$baseUrl}/projects/{$project->slug}",
                'lastmod' => $project->updated_at?->toAtomString() ?? now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ];
        }

        // 3. Services
        $services = Service::where('is_active', true)->get();
        foreach ($services as $service) {
            $urls[] = [
                'loc' => "{$baseUrl}/services/{$service->slug}",
                'lastmod' => $service->updated_at?->toAtomString() ?? now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ];
        }

        // 4. Packages
        $packages = ServicePackage::where('is_active', true)->get();
        foreach ($packages as $pkg) {
            $urls[] = [
                'loc' => "{$baseUrl}/packages/{$pkg->slug}",
                'lastmod' => $pkg->updated_at?->toAtomString() ?? now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ];
        }

        // 5. Articles de Blog publiés
        $posts = Post::where('is_published', true)->get();
        foreach ($posts as $post) {
            $urls[] = [
                'loc' => "{$baseUrl}/blog/{$post->slug}",
                'lastmod' => $post->updated_at?->toAtomString() ?? now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars($url['loc']) . "</loc>\n";
            $xml .= "    <lastmod>{$url['lastmod']}</lastmod>\n";
            $xml .= "    <changefreq>{$url['changefreq']}</changefreq>\n";
            $xml .= "    <priority>{$url['priority']}</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    /**
     * Génère un fichier robots.txt dynamique
     */
    public function robots(): Response
    {
        $baseUrl = url('/');

        $content = "User-agent: *\n";
        $content .= "Allow: /\n";
        $content .= "Disallow: /admin/\n";
        $content .= "Disallow: /client/\n";
        $content .= "Disallow: /payment/\n";
        $content .= "Disallow: /invoices/\n";
        $content .= "\n";
        $content .= "Sitemap: {$baseUrl}/sitemap.xml\n";

        return response($content, 200, [
            'Content-Type' => 'text/plain',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}

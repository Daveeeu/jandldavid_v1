<?php

use App\Http\Controllers\Admin\AnalyticsDashboardController;
use App\Http\Controllers\ProjectInquiryEmailOpenController;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;

Route::get('/email/project-inquiry/open/{projectInquiry}/{token}', ProjectInquiryEmailOpenController::class)
    ->name('project-inquiry.email-open');

Route::get('/robots.txt', function () {
    $baseUrl = rtrim(config('app.url'), '/');

    return response(
        "User-agent: *\nAllow: /\nSitemap: {$baseUrl}/sitemap.xml\n",
        200,
        ['Content-Type' => 'text/plain; charset=UTF-8']
    );
});

Route::get('/sitemap.xml', function () {
    $baseUrl = rtrim(config('app.url'), '/');
    $routeSources = [
        '/' => [
            base_path('src/app/App.tsx'),
            base_path('src/app/components/FAQSection.tsx'),
            base_path('src/app/seo.tsx'),
        ],
        '/about' => [
            base_path('src/app/pages/AboutPage.tsx'),
            base_path('src/app/seo.tsx'),
        ],
        '/projektek/performancevd' => [
            base_path('src/app/pages/PerformanceVDPage.tsx'),
            base_path('src/app/seo.tsx'),
        ],
        '/projektek/motocosmos' => [
            base_path('src/app/pages/MotoCosmoPage.tsx'),
            base_path('src/app/seo.tsx'),
        ],
        '/projektek/saas-dashboard-platform' => [
            base_path('src/app/pages/CaseStudyPage.tsx'),
            base_path('src/app/seo.tsx'),
        ],
        '/projektek/infrastructure-deployment-system' => [
            base_path('src/app/pages/CaseStudyPage.tsx'),
            base_path('src/app/seo.tsx'),
        ],
        '/projektek/security-first-platform' => [
            base_path('src/app/pages/CaseStudyPage.tsx'),
            base_path('src/app/seo.tsx'),
        ],
    ];

    $items = collect($routeSources)
        ->map(function (array $files, string $path) use ($baseUrl) {
            $location = e($baseUrl.($path === '/' ? '/' : $path));
            $latestTimestamp = collect($files)
                ->filter(fn (string $file) => file_exists($file))
                ->map(fn (string $file) => filemtime($file))
                ->max() ?: now()->timestamp;
            $lastModified = Carbon::createFromTimestamp($latestTimestamp)->toDateString();
            $priority = $path === '/' ? '1.0' : '0.8';

            return <<<XML
    <url>
        <loc>{$location}</loc>
        <lastmod>{$lastModified}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>{$priority}</priority>
    </url>
XML;
        })
        ->implode("\n");

    $xml = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{$items}
</urlset>
XML;

    return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
});

Route::get('/admin/analytics', AnalyticsDashboardController::class)
    ->middleware('admin.dashboard')
    ->name('admin.analytics');

Route::get('/{path?}', function (?string $path = null) {
    $normalizedPath = '/'.ltrim($path ?? '', '/');
    $normalizedPath = $normalizedPath === '/' ? '/' : rtrim($normalizedPath, '/');
    $siteContent = json_decode(file_get_contents(resource_path('seo/site-content.json')), true, flags: JSON_THROW_ON_ERROR);
    $knownPaths = array_keys($siteContent['pages'] ?? []);
    $status = in_array($normalizedPath, $knownPaths, true) ? 200 : 404;

    return response()->view('app', status: $status);
})->where('path', '^(?!api).*$');

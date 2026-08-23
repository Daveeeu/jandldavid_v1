<?php

namespace App\Support;

use App\Models\AnalyticsEvent;
use App\Models\ProjectInquiry;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class AnalyticsReportBuilder
{
    public function build(?Carbon $from = null, ?Carbon $to = null): array
    {
        $to ??= now();
        $from ??= (clone $to)->subDays(7);

        $events = AnalyticsEvent::query()
            ->whereBetween('occurred_at', [$from, $to])
            ->orderByDesc('occurred_at')
            ->get();

        $inquiries = ProjectInquiry::query()
            ->whereBetween('created_at', [$from, $to])
            ->get();

        $pageViews = $events->where('event_name', 'page_view');
        $formSubmissions = $events->where('event_name', 'form_submitted');

        $topPages = $pageViews
            ->groupBy('page_path')
            ->map(fn (Collection $group, $path) => ['path' => $path, 'views' => $group->count()])
            ->sortByDesc('views')
            ->take(10)
            ->values();

        $topEvents = $events
            ->groupBy('event_name')
            ->map(fn (Collection $group, $name) => ['name' => $name, 'count' => $group->count()])
            ->sortByDesc('count')
            ->take(10)
            ->values();

        $utmSources = $events
            ->map(fn (AnalyticsEvent $event) => data_get($event->payload, 'params.utm_source'))
            ->filter()
            ->countBy()
            ->map(fn ($count, $source) => ['source' => $source, 'count' => $count])
            ->values()
            ->sortByDesc('count')
            ->take(10)
            ->values();

        return [
            'range' => [
                'from' => $from,
                'to' => $to,
            ],
            'summary' => [
                'events' => $events->count(),
                'unique_visitors' => $events->pluck('client_id')->filter()->unique()->count(),
                'page_views' => $pageViews->count(),
                'form_submissions' => $formSubmissions->count(),
                'project_inquiries' => $inquiries->count(),
                'customer_email_opens' => $inquiries->sum('customer_confirmation_open_count'),
                'admin_notifications_sent' => $inquiries->whereNotNull('admin_notification_sent_at')->count(),
            ],
            'seo' => [
                'app_url' => rtrim((string) config('app.url'), '/'),
                'sitemap_url' => rtrim((string) config('app.url'), '/').'/sitemap.xml',
                'search_console_verification_configured' => (string) config('analytics.search_console.verification') !== '',
                'indexed_routes' => [
                    '/',
                    '/about',
                    '/projektek/performancevd',
                    '/projektek/motocosmos',
                    '/projektek/saas-dashboard-platform',
                    '/projektek/infrastructure-deployment-system',
                    '/projektek/security-first-platform',
                ],
            ],
            'top_pages' => $topPages,
            'top_events' => $topEvents,
            'utm_sources' => $utmSources,
            'latest_inquiries' => $inquiries->sortByDesc('created_at')->take(10)->values(),
        ];
    }
}

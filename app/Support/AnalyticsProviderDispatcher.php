<?php

namespace App\Support;

use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Throwable;

class AnalyticsProviderDispatcher
{
    public function dispatch(array $event): array
    {
        return [
            'ga4' => $this->sendToGa4($event),
            'posthog' => $this->sendToPosthog($event),
            'plausible' => $this->sendToPlausible($event),
        ];
    }

    private function sendToGa4(array $event): array
    {
        $measurementId = (string) config('analytics.ga4.measurement_id');
        $apiSecret = (string) config('analytics.ga4.api_secret');

        if ($measurementId === '' || $apiSecret === '') {
            return ['status' => 'skipped'];
        }

        try {
            $response = Http::timeout(5)
                ->post(
                    'https://www.google-analytics.com/mp/collect?measurement_id='.$measurementId.'&api_secret='.$apiSecret,
                    [
                        'client_id' => $event['client_id'],
                        'timestamp_micros' => ((int) $event['timestamp']) * 1000,
                        'events' => [[
                            'name' => $event['event_name'],
                            'params' => array_merge(
                                Arr::only($event['params'], array_keys($event['params'])),
                                ['engagement_time_msec' => max(1, (int) ($event['params']['time_on_page_ms'] ?? 1))]
                            ),
                        ]],
                    ]
                );

            return ['status' => $response->successful() ? 'sent' : 'failed', 'code' => $response->status()];
        } catch (Throwable $exception) {
            return ['status' => 'failed', 'message' => $exception->getMessage()];
        }
    }

    private function sendToPostHog(array $event): array
    {
        if (!config('analytics.posthog.enabled')) {
            return ['status' => 'skipped'];
        }

        $projectKey = (string) config('analytics.posthog.project_key');
        $host = rtrim((string) config('analytics.posthog.host'), '/');

        if ($projectKey === '' || $host === '') {
            return ['status' => 'skipped'];
        }

        try {
            $response = Http::timeout(5)->post($host.'/capture/', [
                'api_key' => $projectKey,
                'event' => $event['event_name'],
                'distinct_id' => $event['client_id'],
                'timestamp' => Carbon::createFromTimestampMs($event['timestamp'])->toIso8601String(),
                'properties' => $event['params'],
            ]);

            return ['status' => $response->successful() ? 'sent' : 'failed', 'code' => $response->status()];
        } catch (Throwable $exception) {
            return ['status' => 'failed', 'message' => $exception->getMessage()];
        }
    }

    private function sendToPlausible(array $event): array
    {
        if (!config('analytics.plausible.enabled')) {
            return ['status' => 'skipped'];
        }

        $domain = (string) config('analytics.plausible.domain');
        $host = rtrim((string) config('analytics.plausible.host'), '/');

        if ($domain === '' || $host === '') {
            return ['status' => 'skipped'];
        }

        try {
            $response = Http::timeout(5)
                ->withHeaders(['User-Agent' => 'JandlDavidAnalytics/1.0'])
                ->post($host.'/api/event', [
                    'name' => $event['event_name'],
                    'domain' => $domain,
                    'url' => rtrim((string) config('app.url'), '/').($event['params']['page_path'] ?? '/'),
                    'props' => Arr::only($event['params'], ['page_type', 'page_title', 'project_slug', 'cta_id', 'lead_source']),
                ]);

            return ['status' => $response->successful() ? 'sent' : 'failed', 'code' => $response->status()];
        } catch (Throwable $exception) {
            return ['status' => 'failed', 'message' => $exception->getMessage()];
        }
    }
}

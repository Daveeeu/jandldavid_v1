<?php

namespace App\Support;

use App\Models\AnalyticsEvent;
use Illuminate\Support\Carbon;

class AnalyticsIngestionService
{
    public function __construct(
        private readonly AnalyticsProviderDispatcher $dispatcher,
    ) {
    }

    public function ingest(array $events, array $context = []): array
    {
        if (($context['consent_analytics'] ?? false) !== true) {
            return ['stored' => 0, 'forwarded' => 0];
        }

        $stored = 0;
        $forwarded = 0;

        foreach ($events as $event) {
            $dispatches = $this->dispatcher->dispatch($event);

            AnalyticsEvent::query()->create([
                'event_name' => $event['event_name'],
                'client_id' => $event['client_id'],
                'page_path' => $event['params']['page_path'] ?? null,
                'page_title' => $event['params']['page_title'] ?? null,
                'page_type' => $event['params']['page_type'] ?? null,
                'occurred_at' => Carbon::createFromTimestampMs($event['timestamp']),
                'payload' => [
                    'params' => $event['params'],
                    'context' => $context,
                ],
                'provider_dispatches' => $dispatches,
            ]);

            $stored++;

            if (collect($dispatches)->contains(fn (array $status) => ($status['status'] ?? null) === 'sent')) {
                $forwarded++;
            }
        }

        return compact('stored', 'forwarded');
    }
}

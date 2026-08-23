<?php

namespace Tests\Feature;

use App\Models\AnalyticsEvent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class AnalyticsPlatformTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_analytics_events_are_ingested_when_consent_is_granted(): void
    {
        $response = $this->postJson('/api/analytics/events', [
            'events' => [
                [
                    'event_name' => 'page_view',
                    'client_id' => 'cid.123',
                    'timestamp' => now()->getTimestampMs(),
                    'params' => [
                        'page_path' => '/',
                        'page_title' => 'Jandl Dávid',
                        'page_type' => 'homepage',
                        'utm_source' => 'google',
                    ],
                ],
            ],
            'context' => [
                'consent_analytics' => true,
                'page_url' => 'https://jandldavid.hu/',
                'user_agent' => 'PHPUnit',
            ],
        ]);

        $response->assertStatus(202)->assertJson([
            'stored' => 1,
        ]);

        $this->assertDatabaseCount('analytics_events', 1);

        $event = AnalyticsEvent::query()->firstOrFail();

        $this->assertSame('page_view', $event->event_name);
        $this->assertSame('/', $event->page_path);
        $this->assertSame('homepage', $event->page_type);
        $this->assertSame('google', data_get($event->payload, 'params.utm_source'));
    }

    public function test_analytics_events_are_not_ingested_without_consent(): void
    {
        $response = $this->postJson('/api/analytics/events', [
            'events' => [
                [
                    'event_name' => 'page_view',
                    'client_id' => 'cid.123',
                    'timestamp' => now()->getTimestampMs(),
                    'params' => [
                        'page_path' => '/',
                        'page_title' => 'Jandl Dávid',
                        'page_type' => 'homepage',
                    ],
                ],
            ],
            'context' => [
                'consent_analytics' => false,
            ],
        ]);

        $response->assertStatus(202)->assertJson([
            'stored' => 0,
            'forwarded' => 0,
        ]);

        $this->assertDatabaseCount('analytics_events', 0);
    }

    public function test_admin_dashboard_requires_matching_token(): void
    {
        Config::set('analytics.dashboard.enabled', true);
        Config::set('analytics.dashboard.token', 'secret-token');

        $this->get('/admin/analytics')->assertForbidden();

        $this->get('/admin/analytics?token=secret-token')
            ->assertOk()
            ->assertSee('Analytics és SEO Dashboard');
    }
}

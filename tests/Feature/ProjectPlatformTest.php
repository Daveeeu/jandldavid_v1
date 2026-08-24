<?php

namespace Tests\Feature;

use App\Mail\ProjectInquiryAdminNotificationMail;
use App\Mail\ProjectInquiryCustomerConfirmationMail;
use App\Models\ProjectInquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ProjectPlatformTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_spa_routes_are_served_by_laravel(): void
    {
        $this->get('/')->assertOk()->assertSee('id="app"', false);
        $this->get('/about')->assertOk()->assertSee('id="app"', false);
        $this->get('/projektek/performancevd')->assertOk()->assertSee('id="app"', false);
    }

    public function test_project_assistant_returns_follow_up_question(): void
    {
        $response = $this->postJson('/api/ai/project-assistant', [
            'messages' => [
                [
                    'role' => 'assistant',
                    'content' => 'Szia!',
                ],
                [
                    'role' => 'user',
                    'content' => 'Egy új sportplatformot szeretnék építeni.',
                ],
            ],
            'project' => [
                'name' => 'Teszt Elek',
                'email' => 'teszt@openai.com',
                'description' => 'Egy új sportplatformot szeretnék építeni.',
                'aiAssist' => true,
                'consultation' => false,
                'existingSystem' => false,
                'existingSystemUrl' => '',
            ],
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'type' => 'message',
                'content' => 'Milyen célközönségnek készülne a rendszer?',
            ]);
    }

    public function test_project_inquiry_is_persisted(): void
    {
        Mail::fake();
        Config::set('mail.contact_recipient.address', 'owner@openai.com');
        Config::set('mail.contact_recipient.name', 'Jandl Dávid');

        $response = $this->postJson('/api/contact/project', [
            'form' => [
                'name' => 'Teszt Elek',
                'email' => 'teszt@openai.com',
                'description' => 'Egy AI támogatott edukációs platformot szeretnék.',
                'aiAssist' => true,
                'consultation' => true,
                'existingSystem' => true,
                'existingSystemUrl' => 'https://example.com',
            ],
            'conversation' => [
                [
                    'id' => 'msg_1',
                    'role' => 'user',
                    'content' => 'Leírtam a projektet.',
                    'timestamp' => now()->getTimestampMs(),
                    'status' => 'sent',
                    'type' => 'message',
                ],
            ],
            'summary' => [
                'goal' => 'Platform indítása',
                'audience' => 'Edzők',
                'features' => ['Kezdőlap', 'Fizetés'],
                'existingSystem' => 'Igen — https://example.com',
                'technical' => 'Webalkalmazás',
                'integrations' => 'Stripe',
                'deadline' => '2026 Q4',
                'notes' => 'Online konzultáció kért',
            ],
            'meta' => [
                'url' => 'https://jandldavid.hu/',
                'referrer' => 'https://google.com',
                'utmSource' => 'google',
                'utmMedium' => 'cpc',
                'utmCampaign' => 'brand',
            ],
        ]);

        $response->assertCreated()->assertJsonStructure(['id', 'message']);

        $this->assertDatabaseCount('project_inquiries', 1);

        $inquiry = ProjectInquiry::query()->firstOrFail();

        $this->assertSame('Teszt Elek', $inquiry->name);
        $this->assertTrue($inquiry->consultation);
        $this->assertTrue($inquiry->existing_system);
        $this->assertNotNull($inquiry->customer_confirmation_tracking_token);
        $this->assertNotNull($inquiry->customer_confirmation_sent_at);
        $this->assertNotNull($inquiry->admin_notification_sent_at);

        Mail::assertSent(ProjectInquiryCustomerConfirmationMail::class, function (ProjectInquiryCustomerConfirmationMail $mail) use ($inquiry) {
            return $mail->inquiry->is($inquiry);
        });

        Mail::assertSent(ProjectInquiryAdminNotificationMail::class, function (ProjectInquiryAdminNotificationMail $mail) use ($inquiry) {
            return $mail->inquiry->is($inquiry);
        });
    }

    public function test_simple_project_inquiry_without_ai_conversation_is_persisted(): void
    {
        Mail::fake();
        Config::set('mail.contact_recipient.address', 'owner@openai.com');
        Config::set('mail.contact_recipient.name', 'Jandl Dávid');

        $response = $this->postJson('/api/contact/project', [
            'form' => [
                'name' => 'Teszt Elek',
                'email' => 'teszt@openai.com',
                'description' => 'Szeretnék egy egyszerű bemutatkozó oldalt.',
                'aiAssist' => false,
                'consultation' => false,
                'existingSystem' => false,
                'existingSystemUrl' => '',
            ],
            'conversation' => [],
            'summary' => null,
            'meta' => [
                'url' => 'https://jandldavid.hu/',
                'referrer' => '',
                'utmSource' => null,
                'utmMedium' => null,
                'utmCampaign' => null,
            ],
        ]);

        $response->assertCreated()->assertJsonStructure(['id', 'message']);

        $this->assertDatabaseCount('project_inquiries', 1);

        $inquiry = ProjectInquiry::query()->firstOrFail();

        $this->assertSame('Teszt Elek', $inquiry->name);
        $this->assertFalse($inquiry->ai_assist);
        $this->assertSame([], $inquiry->conversation);
    }

    public function test_customer_confirmation_email_open_is_tracked(): void
    {
        $inquiry = ProjectInquiry::query()->create([
            'name' => 'Teszt Elek',
            'email' => 'teszt@openai.com',
            'description' => 'Teszt projekt',
            'ai_assist' => true,
            'consultation' => false,
            'existing_system' => false,
            'conversation' => [],
            'summary' => null,
            'meta' => ['url' => 'https://jandldavid.hu/'],
            'customer_confirmation_tracking_token' => 'tracking-token',
        ]);

        $this->get("/email/project-inquiry/open/{$inquiry->id}/tracking-token")
            ->assertOk()
            ->assertHeader('Content-Type', 'image/gif');

        $inquiry->refresh();

        $this->assertNotNull($inquiry->customer_confirmation_opened_at);
        $this->assertSame(1, $inquiry->customer_confirmation_open_count);
    }

    public function test_homepage_contains_server_rendered_structured_data_and_canonical_tags(): void
    {
        $response = $this->get('/');

        $response
            ->assertOk()
            ->assertSee('application/ld+json', false)
            ->assertSee('rel="canonical"', false)
            ->assertSee('hreflang="hu-HU"', false)
            ->assertSee('/og-image.png', false);
    }

    public function test_unknown_routes_return_404_and_noindex_meta(): void
    {
        $response = $this->get('/nincs-ilyen-oldal');

        $response
            ->assertNotFound()
            ->assertSee('content="noindex,follow"', false);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectInquiryRequest;
use App\Models\ProjectInquiry;
use App\Support\ProjectInquiryMailer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProjectInquiryController extends Controller
{
    public function __invoke(StoreProjectInquiryRequest $request, ProjectInquiryMailer $mailer): JsonResponse
    {
        $validated = $request->validated();
        $form = $validated['form'];

        $inquiry = DB::transaction(fn () => ProjectInquiry::query()->create([
            'name' => $form['name'],
            'email' => $form['email'],
            'description' => $form['description'],
            'ai_assist' => $form['aiAssist'],
            'consultation' => $form['consultation'],
            'existing_system' => $form['existingSystem'],
            'existing_system_url' => $form['existingSystemUrl'] ?? null,
            'conversation' => $validated['conversation'],
            'summary' => $validated['summary'] ?? null,
            'meta' => $validated['meta'],
            'customer_confirmation_tracking_token' => (string) Str::uuid(),
        ]));

        $mailer->send($inquiry);

        Log::info('New project inquiry received.', [
            'project_inquiry_id' => $inquiry->id,
            'email' => $inquiry->email,
            'consultation' => $inquiry->consultation,
            'ai_assist' => $inquiry->ai_assist,
            'customer_confirmation_sent' => $inquiry->customer_confirmation_sent_at !== null,
            'admin_notification_sent' => $inquiry->admin_notification_sent_at !== null,
        ]);

        return response()->json([
            'message' => 'A projektigény sikeresen beérkezett.',
            'id' => $inquiry->id,
        ], 201);
    }
}

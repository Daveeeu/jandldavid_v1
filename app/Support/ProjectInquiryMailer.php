<?php

namespace App\Support;

use App\Mail\ProjectInquiryAdminNotificationMail;
use App\Mail\ProjectInquiryCustomerConfirmationMail;
use App\Models\ProjectInquiry;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ProjectInquiryMailer
{
    public function send(ProjectInquiry $inquiry): void
    {
        $updates = [];

        $customerSentAt = $this->sendCustomerConfirmation($inquiry);
        if ($customerSentAt !== null) {
            $updates['customer_confirmation_sent_at'] = $customerSentAt;
        }

        $adminSentAt = $this->sendAdminNotification($inquiry);
        if ($adminSentAt !== null) {
            $updates['admin_notification_sent_at'] = $adminSentAt;
        }

        if ($updates !== []) {
            $inquiry->forceFill($updates)->save();
        }
    }

    private function sendCustomerConfirmation(ProjectInquiry $inquiry): ?Carbon
    {
        try {
            Mail::to($inquiry->email, $inquiry->name)
                ->send(new ProjectInquiryCustomerConfirmationMail($inquiry));

            return now();
        } catch (Throwable $exception) {
            Log::error('Failed to send project inquiry customer confirmation email.', [
                'project_inquiry_id' => $inquiry->id,
                'email' => $inquiry->email,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return null;
        }
    }

    private function sendAdminNotification(ProjectInquiry $inquiry): ?Carbon
    {
        $recipientAddress = (string) config('mail.contact_recipient.address');
        $recipientName = (string) config('mail.contact_recipient.name');

        if ($recipientAddress === '') {
            Log::warning('Project inquiry admin notification skipped because CONTACT_NOTIFICATION_EMAIL is missing.', [
                'project_inquiry_id' => $inquiry->id,
            ]);

            return null;
        }

        try {
            Mail::to($recipientAddress, $recipientName)
                ->send(new ProjectInquiryAdminNotificationMail($inquiry));

            return now();
        } catch (Throwable $exception) {
            Log::error('Failed to send project inquiry admin notification email.', [
                'project_inquiry_id' => $inquiry->id,
                'recipient' => $recipientAddress,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return null;
        }
    }
}

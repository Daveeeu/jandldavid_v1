<?php

namespace App\Support;

use App\Mail\WeeklyAnalyticsReportMail;
use Illuminate\Support\Facades\Mail;

class WeeklyAnalyticsReporter
{
    public function __construct(
        private readonly AnalyticsReportBuilder $reportBuilder,
    ) {
    }

    public function send(): bool
    {
        if (!config('analytics.reporting.enabled')) {
            return false;
        }

        $recipientEmail = (string) config('analytics.reporting.recipient_email');
        $recipientName = (string) config('analytics.reporting.recipient_name');

        if ($recipientEmail === '') {
            return false;
        }

        Mail::to($recipientEmail, $recipientName)
            ->send(new WeeklyAnalyticsReportMail($this->reportBuilder->build()));

        return true;
    }
}

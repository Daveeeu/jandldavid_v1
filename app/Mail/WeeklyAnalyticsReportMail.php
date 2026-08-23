<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WeeklyAnalyticsReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public array $report,
    ) {
    }

    public function build(): self
    {
        return $this
            ->subject('Heti SEO és analitika riport')
            ->view('emails.weekly-analytics-report');
    }
}

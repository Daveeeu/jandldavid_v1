<?php

namespace App\Mail;

use App\Models\ProjectInquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProjectInquiryAdminNotificationMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public ProjectInquiry $inquiry,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Új kapcsolatfelvételi igény érkezett',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.project-inquiry-admin-notification',
        );
    }
}

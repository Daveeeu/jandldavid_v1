<?php

namespace App\Mail;

use App\Models\ProjectInquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProjectInquiryCustomerConfirmationMail extends Mailable
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
            replyTo: [
                new Address(
                    (string) config('mail.contact_recipient.address'),
                    (string) config('mail.contact_recipient.name'),
                ),
            ],
            subject: 'Megkaptam az üzenetedet',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.project-inquiry-customer-confirmation',
        );
    }
}

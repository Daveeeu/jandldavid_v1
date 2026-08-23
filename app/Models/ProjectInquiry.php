<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectInquiry extends Model
{
    protected $fillable = [
        'name',
        'email',
        'description',
        'ai_assist',
        'consultation',
        'existing_system',
        'existing_system_url',
        'conversation',
        'summary',
        'meta',
        'customer_confirmation_tracking_token',
        'customer_confirmation_sent_at',
        'customer_confirmation_opened_at',
        'customer_confirmation_open_count',
        'admin_notification_sent_at',
    ];

    protected function casts(): array
    {
        return [
            'ai_assist' => 'boolean',
            'consultation' => 'boolean',
            'existing_system' => 'boolean',
            'conversation' => 'array',
            'summary' => 'array',
            'meta' => 'array',
            'customer_confirmation_sent_at' => 'datetime',
            'customer_confirmation_opened_at' => 'datetime',
            'customer_confirmation_open_count' => 'integer',
            'admin_notification_sent_at' => 'datetime',
        ];
    }
}

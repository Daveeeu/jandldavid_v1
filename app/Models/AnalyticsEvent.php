<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalyticsEvent extends Model
{
    protected $fillable = [
        'event_name',
        'client_id',
        'page_path',
        'page_title',
        'page_type',
        'occurred_at',
        'payload',
        'provider_dispatches',
    ];

    protected function casts(): array
    {
        return [
            'occurred_at' => 'datetime',
            'payload' => 'array',
            'provider_dispatches' => 'array',
        ];
    }
}

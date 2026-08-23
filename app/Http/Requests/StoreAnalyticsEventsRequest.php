<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnalyticsEventsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'events' => ['required', 'array', 'min:1', 'max:50'],
            'events.*.event_name' => ['required', 'string', 'max:100'],
            'events.*.params' => ['required', 'array'],
            'events.*.client_id' => ['required', 'string', 'max:191'],
            'events.*.timestamp' => ['required', 'integer', 'min:1'],
            'context' => ['sometimes', 'array'],
            'context.consent_analytics' => ['sometimes', 'boolean'],
            'context.page_url' => ['sometimes', 'string', 'max:2048'],
            'context.user_agent' => ['sometimes', 'string', 'max:1000'],
        ];
    }
}

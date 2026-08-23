<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'form' => ['required', 'array'],
            'form.name' => ['required', 'string', 'max:255'],
            'form.email' => ['required', 'email:rfc,dns', 'max:255'],
            'form.description' => ['required', 'string', 'max:5000'],
            'form.aiAssist' => ['required', 'boolean'],
            'form.consultation' => ['required', 'boolean'],
            'form.existingSystem' => ['required', 'boolean'],
            'form.existingSystemUrl' => ['nullable', 'url:http,https', 'max:2048'],
            'conversation' => ['required', 'array'],
            'conversation.*.id' => ['required', 'string', 'max:120'],
            'conversation.*.role' => ['required', 'string', 'in:user,assistant'],
            'conversation.*.content' => ['required', 'string', 'max:5000'],
            'conversation.*.timestamp' => ['required', 'integer'],
            'conversation.*.status' => ['required', 'string', 'in:sent,error'],
            'conversation.*.type' => ['nullable', 'string', 'in:message,project_summary'],
            'summary' => ['nullable', 'array'],
            'meta' => ['required', 'array'],
            'meta.url' => ['required', 'url:http,https', 'max:2048'],
            'meta.referrer' => ['nullable', 'string', 'max:2048'],
            'meta.utmSource' => ['nullable', 'string', 'max:255'],
            'meta.utmMedium' => ['nullable', 'string', 'max:255'],
            'meta.utmCampaign' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function after(): array
    {
        return [
            function () {
                $form = $this->validated('form', []);

                if (($form['existingSystem'] ?? false) && empty($form['existingSystemUrl'])) {
                    $this->validator->errors()->add('form.existingSystemUrl', 'A meglévő rendszer URL-je kötelező.');
                }
            },
        ];
    }
}

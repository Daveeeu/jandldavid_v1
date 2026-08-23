<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectAssistantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'messages' => ['required', 'array', 'min:1'],
            'messages.*.role' => ['required', 'string', 'in:user,assistant'],
            'messages.*.content' => ['required', 'string', 'max:3000'],
            'project' => ['required', 'array'],
            'project.name' => ['nullable', 'string', 'max:255'],
            'project.email' => ['nullable', 'email:rfc,dns', 'max:255'],
            'project.description' => ['required', 'string', 'max:5000'],
            'project.aiAssist' => ['nullable', 'boolean'],
            'project.consultation' => ['nullable', 'boolean'],
            'project.existingSystem' => ['nullable', 'boolean'],
            'project.existingSystemUrl' => ['nullable', 'url:http,https', 'max:2048'],
        ];
    }
}

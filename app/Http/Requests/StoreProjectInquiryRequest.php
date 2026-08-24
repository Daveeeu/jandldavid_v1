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
            'form.email' => ['required', 'email:rfc', 'max:255'],
            'form.description' => ['required', 'string', 'max:5000'],
            'form.aiAssist' => ['required', 'boolean'],
            'form.consultation' => ['required', 'boolean'],
            'form.existingSystem' => ['required', 'boolean'],
            'form.existingSystemUrl' => ['nullable', 'url:http,https', 'max:2048'],
            'conversation' => ['present', 'array'],
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

    public function messages(): array
    {
        return [
            'form.required' => 'Az űrlap adatai hiányoznak.',
            'form.array' => 'Az űrlap adatai hibás formátumúak.',
            'form.name.required' => 'A név megadása kötelező.',
            'form.name.max' => 'A név legfeljebb 255 karakter lehet.',
            'form.email.required' => 'Az e-mail-cím megadása kötelező.',
            'form.email.email' => 'Adj meg egy valós e-mail-címet.',
            'form.email.max' => 'Az e-mail-cím túl hosszú.',
            'form.description.required' => 'A projekt rövid leírása kötelező.',
            'form.description.max' => 'A projekt leírása legfeljebb 5000 karakter lehet.',
            'form.aiAssist.required' => 'Az AI asszisztens állapota hiányzik.',
            'form.aiAssist.boolean' => 'Az AI asszisztens mező hibás.',
            'form.consultation.required' => 'A konzultáció mező hiányzik.',
            'form.consultation.boolean' => 'A konzultáció mező hibás.',
            'form.existingSystem.required' => 'A meglévő rendszer mező hiányzik.',
            'form.existingSystem.boolean' => 'A meglévő rendszer mező hibás.',
            'form.existingSystemUrl.url' => 'A meglévő rendszer címe csak érvényes URL lehet.',
            'conversation.present' => 'A beszélgetés mező hiányzik.',
            'conversation.array' => 'A beszélgetés adatai hibás formátumúak.',
            'conversation.*.id.required' => 'A beszélgetés egyik azonosítója hiányzik.',
            'conversation.*.role.required' => 'A beszélgetés egyik szerepköre hiányzik.',
            'conversation.*.role.in' => 'A beszélgetés egyik szerepköre érvénytelen.',
            'conversation.*.content.required' => 'A beszélgetés egyik üzenete üres.',
            'conversation.*.timestamp.required' => 'A beszélgetés egyik időbélyege hiányzik.',
            'conversation.*.status.required' => 'A beszélgetés egyik állapota hiányzik.',
            'conversation.*.status.in' => 'A beszélgetés egyik állapota érvénytelen.',
            'summary.array' => 'Az összefoglaló adatai hibás formátumúak.',
            'meta.required' => 'A beküldés technikai adatai hiányoznak.',
            'meta.array' => 'A beküldés technikai adatai hibásak.',
            'meta.url.required' => 'A beküldés oldalcíme hiányzik.',
            'meta.url.url' => 'A beküldés oldalcíme nem érvényes URL.',
        ];
    }
}

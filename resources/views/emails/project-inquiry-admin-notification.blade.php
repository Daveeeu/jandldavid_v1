<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <title>Új kapcsolatfelvételi igény</title>
</head>
<body style="margin:0;padding:32px 16px;background:#f4f6f8;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:760px;margin:0 auto;">
        <div style="margin-bottom:16px;padding:18px 22px;background:linear-gradient(135deg,#0f1117 0%,#1a1d27 100%);border-radius:18px;color:#ffffff;">
            <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#86efac;font-weight:700;margin-bottom:10px;">Új lead</div>
            <div style="font-size:28px;line-height:1.15;font-weight:800;letter-spacing:-0.04em;margin-bottom:10px;">Új kapcsolatfelvételi igény érkezett</div>
            <div style="font-size:15px;line-height:1.7;color:rgba(255,255,255,0.78);">
                Friss érdeklődő a weboldalról. Az alapadatok és a projektösszefoglaló lent találhatók.
            </div>
        </div>

        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;padding:28px 26px;box-shadow:0 12px 30px rgba(15,17,23,0.06);">
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                <tr>
                    <td style="padding:10px 0;font-weight:700;width:180px;color:#6b7280;border-bottom:1px solid #eef2f7;">Név</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;">{{ $inquiry->name }}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;font-weight:700;color:#6b7280;border-bottom:1px solid #eef2f7;">Email</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;">{{ $inquiry->email }}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;font-weight:700;color:#6b7280;border-bottom:1px solid #eef2f7;">AI segítség</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;">{{ $inquiry->ai_assist ? 'Igen' : 'Nem' }}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;font-weight:700;color:#6b7280;border-bottom:1px solid #eef2f7;">Konzultáció</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;">{{ $inquiry->consultation ? 'Igen' : 'Nem' }}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;font-weight:700;color:#6b7280;border-bottom:1px solid #eef2f7;">Meglévő rendszer</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;">{{ $inquiry->existing_system ? 'Igen' : 'Nem' }}</td>
                </tr>
                @if($inquiry->existing_system_url)
                    <tr>
                        <td style="padding:10px 0;font-weight:700;color:#6b7280;">Rendszer URL</td>
                        <td style="padding:10px 0;color:#16a34a;">{{ $inquiry->existing_system_url }}</td>
                    </tr>
                @endif
            </table>

            <div style="margin-bottom:24px;padding:20px;background:#f9fafb;border-radius:14px;border:1px solid #e5e7eb;">
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#16a34a;font-weight:800;">Projektleírás</p>
                <p style="margin:0;line-height:1.8;white-space:pre-line;">{{ $inquiry->description }}</p>
            </div>

            @if(is_array($inquiry->summary) && $inquiry->summary !== [])
                <div style="margin-bottom:24px;padding:20px;background:#f0fdf4;border-radius:14px;border:1px solid #bbf7d0;">
                    <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#166534;font-weight:800;">AI összefoglaló</p>
                    @foreach($inquiry->summary as $label => $value)
                        <p style="margin:0 0 8px;line-height:1.6;">
                            <strong>{{ $label }}:</strong>
                            {{ is_array($value) ? implode(', ', $value) : $value }}
                        </p>
                    @endforeach
                </div>
            @endif

            <div style="display:flex;gap:12px;flex-wrap:wrap;">
                <div style="padding:10px 14px;border-radius:9999px;background:#f3f4f6;font-size:13px;color:#374151;">
                    Inquiry ID: #{{ $inquiry->id }}
                </div>
                <div style="padding:10px 14px;border-radius:9999px;background:#f3f4f6;font-size:13px;color:#374151;">
                    Visszaigazoló email megnyitva:
                    {{ $inquiry->customer_confirmation_opened_at ? $inquiry->customer_confirmation_opened_at->format('Y-m-d H:i') : 'még nem' }}
                </div>
            </div>
        </div>
    </div>
</body>
</html>

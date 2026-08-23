<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <title>Megkaptam az üzenetedet</title>
</head>
<body style="margin:0;padding:32px 16px;background:#f4f6f8;font-family:Arial,sans-serif;color:#0f1117;">
    <div style="max-width:680px;margin:0 auto;">
        <div style="margin-bottom:16px;padding:18px 22px;background:#0f1117;border-radius:18px;color:#ffffff;">
            <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#86efac;font-weight:700;margin-bottom:10px;">Jandl Dávid</div>
            <div style="font-size:28px;line-height:1.15;font-weight:800;letter-spacing:-0.04em;margin-bottom:12px;">
                Megkaptam az üzenetedet.
            </div>
            <div style="font-size:15px;line-height:1.7;color:rgba(255,255,255,0.78);max-width:520px;">
                Átnézem a projektigényedet, és általában 24 órán belül válaszolok. A cél, hogy már az első visszajelzés is konkrét és használható legyen.
            </div>
        </div>

        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;padding:28px 26px;box-shadow:0 12px 30px rgba(15,17,23,0.06);">
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Szia {{ $inquiry->name }},</p>
            <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#374151;">
                köszönöm, hogy elküldted a megkeresésedet. Az alábbi összefoglaló alapján fogom előkészíteni a válaszomat.
            </p>

            <div style="margin:0 0 18px;padding:18px 20px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;">
                <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#16a34a;font-weight:800;margin-bottom:10px;">Projektleírás</div>
                <div style="font-size:15px;line-height:1.8;color:#111827;white-space:pre-line;">{{ $inquiry->description }}</div>
            </div>

            <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
                <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;font-size:13px;font-weight:700;color:#6b7280;width:210px;">Kapcsolattartó email</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;font-size:14px;color:#111827;">{{ $inquiry->email }}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;font-size:13px;font-weight:700;color:#6b7280;">AI pontosítás</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;font-size:14px;color:#111827;">{{ $inquiry->ai_assist ? 'Igen' : 'Nem' }}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;font-size:13px;font-weight:700;color:#6b7280;">Konzultáció</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;font-size:14px;color:#111827;">{{ $inquiry->consultation ? 'Igen' : 'Nem' }}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;font-size:13px;font-weight:700;color:#6b7280;">Meglévő rendszer</td>
                    <td style="padding:10px 0;font-size:14px;color:#111827;">
                        {{ $inquiry->existing_system ? 'Igen' : 'Nem' }}
                        @if($inquiry->existing_system_url)
                            <span style="display:block;margin-top:6px;color:#16a34a;">{{ $inquiry->existing_system_url }}</span>
                        @endif
                    </td>
                </tr>
            </table>

            @if($inquiry->consultation)
                <div style="margin:0 0 18px;padding:16px 18px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;color:#166534;font-size:14px;line-height:1.7;">
                    Jelezted, hogy konzultációt is szeretnél. Ezt a visszajelzésemnél külön figyelembe veszem.
                </div>
            @endif

            <p style="margin:0;font-size:15px;line-height:1.8;color:#374151;">
                Udv,<br>
                <span style="font-weight:700;color:#0f1117;">Jandl Dávid</span><br>
                <span style="color:#16a34a;">Technikai partner</span>
            </p>
        </div>
    </div>
    <img
        src="{{ route('project-inquiry.email-open', ['projectInquiry' => $inquiry, 'token' => $inquiry->customer_confirmation_tracking_token]) }}"
        alt=""
        width="1"
        height="1"
        style="display:block;width:1px;height:1px;border:0;opacity:0;"
    >
</body>
</html>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <title>Heti SEO és analitika riport</title>
</head>
<body style="margin:0;padding:32px;background:#f3f6fb;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:20px;padding:32px;box-shadow:0 12px 32px rgba(15,23,42,.08);">
        <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#16a34a;margin-bottom:12px;">Heti riport</div>
        <h1 style="margin:0 0 8px;font-size:28px;line-height:1.2;">SEO és analitika összefoglaló</h1>
        <p style="margin:0 0 24px;color:#4b5563;line-height:1.7;">
            Időszak: {{ $report['range']['from']->format('Y-m-d H:i') }} - {{ $report['range']['to']->format('Y-m-d H:i') }}
        </p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
            <tr>
                @foreach ($report['summary'] as $label => $value)
                    <td style="width:50%;padding:8px;">
                        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;padding:16px;">
                            <div style="font-size:12px;color:#6b7280;">{{ \Illuminate\Support\Str::headline(str_replace('_', ' ', $label)) }}</div>
                            <div style="font-size:24px;font-weight:700;margin-top:6px;">{{ $value }}</div>
                        </div>
                    </td>
                @endforeach
            </tr>
        </table>

        <h2 style="font-size:18px;margin:0 0 12px;">Top oldalak</h2>
        <ul style="padding-left:20px;margin:0 0 24px;color:#374151;">
            @foreach ($report['top_pages'] as $row)
                <li style="margin-bottom:6px;">{{ $row['path'] }} - {{ $row['views'] }} megtekintés</li>
            @endforeach
        </ul>

        <h2 style="font-size:18px;margin:0 0 12px;">SEO állapot</h2>
        <ul style="padding-left:20px;margin:0;color:#374151;">
            <li style="margin-bottom:6px;">Sitemap: {{ $report['seo']['sitemap_url'] }}</li>
            <li style="margin-bottom:6px;">Search Console verification: {{ $report['seo']['search_console_verification_configured'] ? 'beállítva' : 'hiányzik' }}</li>
            <li>Indexelhető route-ok: {{ implode(', ', $report['seo']['indexed_routes']) }}</li>
        </ul>
    </div>
</body>
</html>

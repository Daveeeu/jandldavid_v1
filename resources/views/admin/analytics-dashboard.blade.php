<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Analytics Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; background:#f5f7fb; color:#111827; margin:0; padding:32px; }
        .wrap { max-width: 1100px; margin: 0 auto; }
        .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:16px; margin:24px 0 32px; }
        .card { background:#fff; border-radius:18px; padding:20px; box-shadow:0 10px 30px rgba(15,23,42,.06); }
        .metric { font-size:28px; font-weight:700; margin-top:8px; }
        table { width:100%; border-collapse: collapse; background:#fff; border-radius:18px; overflow:hidden; }
        th, td { text-align:left; padding:14px 16px; border-bottom:1px solid #e5e7eb; font-size:14px; }
        th { background:#f8fafc; }
        .section { margin-top: 24px; }
        .pill { display:inline-block; padding:6px 10px; background:#ecfdf5; color:#166534; border-radius:999px; font-size:12px; font-weight:700; }
    </style>
</head>
<body>
<div class="wrap">
    <h1>Analytics és SEO Dashboard</h1>
    <p>
        Időszak:
        <strong>{{ $report['range']['from']->format('Y-m-d H:i') }}</strong>
        -
        <strong>{{ $report['range']['to']->format('Y-m-d H:i') }}</strong>
    </p>

    <div class="grid">
        @foreach ($report['summary'] as $label => $value)
            <div class="card">
                <div>{{ \Illuminate\Support\Str::headline(str_replace('_', ' ', $label)) }}</div>
                <div class="metric">{{ $value }}</div>
            </div>
        @endforeach
    </div>

    <div class="card">
        <h2>SEO állapot</h2>
        <p><strong>App URL:</strong> {{ $report['seo']['app_url'] }}</p>
        <p><strong>Sitemap:</strong> <a href="{{ $report['seo']['sitemap_url'] }}">{{ $report['seo']['sitemap_url'] }}</a></p>
        <p>
            <strong>Search Console meta:</strong>
            @if ($report['seo']['search_console_verification_configured'])
                <span class="pill">Beállítva</span>
            @else
                <span style="color:#b91c1c;">Hiányzik</span>
            @endif
        </p>
        <p><strong>Indexelhető route-ok:</strong> {{ implode(', ', $report['seo']['indexed_routes']) }}</p>
    </div>

    <div class="section">
        <h2>Top oldalak</h2>
        <table>
            <thead><tr><th>Oldal</th><th>Megtekintés</th></tr></thead>
            <tbody>
            @foreach ($report['top_pages'] as $row)
                <tr><td>{{ $row['path'] }}</td><td>{{ $row['views'] }}</td></tr>
            @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Top események</h2>
        <table>
            <thead><tr><th>Esemény</th><th>Darab</th></tr></thead>
            <tbody>
            @foreach ($report['top_events'] as $row)
                <tr><td>{{ $row['name'] }}</td><td>{{ $row['count'] }}</td></tr>
            @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>UTM források</h2>
        <table>
            <thead><tr><th>Forrás</th><th>Darab</th></tr></thead>
            <tbody>
            @foreach ($report['utm_sources'] as $row)
                <tr><td>{{ $row['source'] }}</td><td>{{ $row['count'] }}</td></tr>
            @endforeach
            </tbody>
        </table>
    </div>
 </div>
</body>
</html>

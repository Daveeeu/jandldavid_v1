<!DOCTYPE html>
<html lang="hu">
    <head>
        @php
            $baseUrl = rtrim(config('app.url'), '/');
            $requestPath = '/'.ltrim(request()->path(), '/');
            $normalizedPath = $requestPath === '/'.trim(request()->root(), '/') ? '/' : $requestPath;

            if ($normalizedPath === '/index.php') {
                $normalizedPath = '/';
            }

            $pageMeta = \App\Support\SiteSeo::pages();
            $meta = \App\Support\SiteSeo::metaForPath($normalizedPath);
            $canonicalUrl = \App\Support\SiteSeo::buildUrl($baseUrl, $normalizedPath);
            $robots = $meta['robots'] ?? 'index,follow';
            $structuredData = \App\Support\SiteSeo::schemaForPath($normalizedPath, $baseUrl);
            $fallback = \App\Support\SiteSeo::fallbackContentForPath($normalizedPath);
        @endphp
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $meta['title'] }}</title>
        <meta name="description" content="{{ $meta['description'] }}">
        <meta name="robots" content="{{ $robots }}">
        <meta name="author" content="Jandl Dávid">
        <meta name="referrer" content="strict-origin-when-cross-origin">
        <meta name="theme-color" content="#0f1117">
        <meta name="app-url" content="{{ $baseUrl }}">
        <link rel="canonical" href="{{ $canonicalUrl }}">
        <link rel="sitemap" type="application/xml" title="Sitemap" href="{{ $baseUrl }}/sitemap.xml">
        <link rel="icon" href="/favicon.ico" sizes="any">
        <meta property="og:locale" content="hu_HU">
        <meta property="og:type" content="{{ $meta['type'] }}">
        <meta property="og:site_name" content="Jandl Dávid">
        <meta property="og:title" content="{{ $meta['title'] }}">
        <meta property="og:description" content="{{ $meta['description'] }}">
        <meta property="og:url" content="{{ $canonicalUrl }}">
        <meta property="og:image" content="{{ $baseUrl }}/og-image.png">
        <meta property="og:image:alt" content="{{ $meta['title'] }}">
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $meta['title'] }}">
        <meta name="twitter:description" content="{{ $meta['description'] }}">
        <meta name="twitter:image" content="{{ $baseUrl }}/og-image.png">
        <meta name="twitter:image:alt" content="{{ $meta['title'] }}">
        <link rel="alternate" hreflang="hu-HU" href="{{ $canonicalUrl }}">
        <link rel="alternate" hreflang="x-default" href="{{ $canonicalUrl }}">
        @if (config('analytics.search_console.verification'))
            <meta name="google-site-verification" content="{{ config('analytics.search_console.verification') }}">
        @endif
        @if (config('analytics.gtm.container_id') || config('analytics.ga4.measurement_id'))
            <link rel="preconnect" href="https://www.googletagmanager.com">
            <link rel="dns-prefetch" href="//www.googletagmanager.com">
            <link rel="preconnect" href="https://www.google-analytics.com">
            <link rel="dns-prefetch" href="//www.google-analytics.com">
        @endif
        <script id="seo-structured-data" type="application/ld+json">{!! json_encode($structuredData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}</script>
        <script>
            window.__APP_URL__ = @json($baseUrl);
            window.__SEO_PAGES__ = @json($pageMeta);
            window.__SEO_HOMEPAGE_FAQS__ = @json(\App\Support\SiteSeo::homepageFaqs());
            window.dataLayer = window.dataLayer || [];
            (function() {
                try {
                    const raw = localStorage.getItem("kt_consent_v2");
                    const stored = raw ? JSON.parse(raw) : null;
                    const analyticsGranted = stored?.analytics === true;
                    const marketingGranted = stored?.marketing === true;
                    const functionalityGranted = stored?.functionality === true;

                    window.dataLayer.push({
                        event: "consent",
                        consentDefaultSet: true,
                        analytics_storage: analyticsGranted ? "granted" : "denied",
                        ad_storage: marketingGranted ? "granted" : "denied",
                        ad_user_data: marketingGranted ? "granted" : "denied",
                        ad_personalization: marketingGranted ? "granted" : "denied",
                        functionality_storage: functionalityGranted ? "granted" : "denied",
                        personalization_storage: functionalityGranted ? "granted" : "denied",
                        security_storage: "granted",
                        wait_for_update: 500
                    });
                } catch (error) {
                    window.dataLayer.push({
                        event: "consent",
                        consentDefaultSet: true,
                        analytics_storage: "denied",
                        ad_storage: "denied",
                        ad_user_data: "denied",
                        ad_personalization: "denied",
                        functionality_storage: "denied",
                        personalization_storage: "denied",
                        security_storage: "granted",
                        wait_for_update: 500
                    });
                }
            })();
        </script>
        @if (config('analytics.gtm.container_id'))
            <script>
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','{{ config('analytics.gtm.container_id') }}');
            </script>
        @elseif (config('analytics.ga4.measurement_id'))
            <script async src="https://www.googletagmanager.com/gtag/js?id={{ config('analytics.ga4.measurement_id') }}"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '{{ config('analytics.ga4.measurement_id') }}', {
                    send_page_view: false,
                    anonymize_ip: true
                });
            </script>
        @endif
        @if (config('analytics.plausible.enabled') && config('analytics.plausible.script_src'))
            <script defer data-domain="{{ config('analytics.plausible.domain') }}" src="{{ config('analytics.plausible.script_src') }}"></script>
        @endif
        @vite('resources/js/app.tsx')
    </head>
    <body>
        @if (config('analytics.gtm.container_id'))
            <noscript>
                <iframe src="https://www.googletagmanager.com/ns.html?id={{ config('analytics.gtm.container_id') }}"
                        height="0"
                        width="0"
                        style="display:none;visibility:hidden"></iframe>
            </noscript>
        @endif
        <div id="app">
            <main id="server-content" style="min-height: 100vh; background: #ffffff; color: #0f1117; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                <section style="max-width: 72rem; margin: 0 auto; padding: 5rem 1.5rem 4rem;">
                    @if (!empty($fallback['eyebrow']))
                        <p style="margin: 0 0 1rem; color: #16a34a; font-size: 0.875rem; font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase;">
                            {{ $fallback['eyebrow'] }}
                        </p>
                    @endif
                    <h1 style="margin: 0; max-width: 14ch; font-size: clamp(2.25rem, 6vw, 4rem); line-height: 1.05; letter-spacing: -0.04em; font-weight: 800;">
                        {{ $fallback['headline'] }}
                    </h1>
                    @if (!empty($fallback['intro']))
                        <p style="margin: 1.5rem 0 0; max-width: 46rem; color: #4b5563; font-size: 1.0625rem; line-height: 1.75;">
                            {{ $fallback['intro'] }}
                        </p>
                    @endif
                    @if (!empty($fallback['items']))
                        <ul style="margin: 2rem 0 0; padding-left: 1.25rem; max-width: 46rem; color: #374151; line-height: 1.8;">
                            @foreach ($fallback['items'] as $item)
                                <li>{{ $item }}</li>
                            @endforeach
                        </ul>
                    @endif
                    @if (!empty($fallback['cta_href']) && !empty($fallback['cta_label']))
                        <p style="margin: 2rem 0 0;">
                            <a href="{{ $fallback['cta_href'] }}" style="display: inline-block; padding: 0.875rem 1.25rem; border-radius: 0.875rem; background: #0f1117; color: #ffffff; text-decoration: none; font-weight: 700;">
                                {{ $fallback['cta_label'] }}
                            </a>
                        </p>
                    @endif
                </section>
            </main>
        </div>
    </body>
</html>

<!DOCTYPE html>
<html lang="hu">
    <head>
        @php
            $baseUrl = rtrim(config('app.url'), '/');
            $requestPath = '/'.ltrim(request()->path(), '/');
            $normalizedPath = $requestPath === '/'.trim(request()->root(), '/') ? '/' : $requestPath;
            $siteContent = json_decode(file_get_contents(resource_path('seo/site-content.json')), true, flags: JSON_THROW_ON_ERROR);

            if ($normalizedPath === '/index.php') {
                $normalizedPath = '/';
            }

            $pageMeta = $siteContent['pages'] ?? [];
            $meta = $pageMeta[$normalizedPath] ?? [
                'title' => 'Az oldal nem található | Jandl Dávid',
                'description' => 'A keresett oldal nem érhető el. Térj vissza a főoldalra, és nézd meg az elérhető projekteket, szolgáltatásokat vagy a kapcsolatfelvételi lehetőségeket.',
                'type' => 'website',
                'robots' => 'noindex,follow',
            ];
            $canonicalUrl = $baseUrl.($normalizedPath === '/' ? '/' : $normalizedPath);
            $robots = $meta['robots'] ?? 'index,follow';
        @endphp
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $meta['title'] }}</title>
        <meta name="description" content="{{ $meta['description'] }}">
        <meta name="robots" content="{{ $robots }}">
        <meta name="author" content="Jandl Dávid">
        <meta name="theme-color" content="#0f1117">
        <meta name="app-url" content="{{ $baseUrl }}">
        <link rel="canonical" href="{{ $canonicalUrl }}">
        <link rel="icon" href="/favicon.ico" sizes="any">
        <meta property="og:locale" content="hu_HU">
        <meta property="og:type" content="{{ $meta['type'] }}">
        <meta property="og:site_name" content="Jandl Dávid">
        <meta property="og:title" content="{{ $meta['title'] }}">
        <meta property="og:description" content="{{ $meta['description'] }}">
        <meta property="og:url" content="{{ $canonicalUrl }}">
        <meta property="og:image" content="{{ $baseUrl }}/og-image.svg">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $meta['title'] }}">
        <meta name="twitter:description" content="{{ $meta['description'] }}">
        <meta name="twitter:image" content="{{ $baseUrl }}/og-image.svg">
        @if (config('analytics.search_console.verification'))
            <meta name="google-site-verification" content="{{ config('analytics.search_console.verification') }}">
        @endif
        <script>
            window.__APP_URL__ = @json($baseUrl);
            window.__SEO_PAGES__ = @json($pageMeta);
            window.__SEO_HOMEPAGE_FAQS__ = @json($siteContent['homepageFaqs'] ?? []);
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
        <div id="app"></div>
    </body>
</html>

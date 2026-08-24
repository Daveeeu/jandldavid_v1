<?php

namespace App\Support;

class SiteSeo
{
    public static function content(): array
    {
        static $content;

        return $content ??= json_decode(
            file_get_contents(resource_path('seo/site-content.json')),
            true,
            flags: JSON_THROW_ON_ERROR
        );
    }

    public static function pages(): array
    {
        return self::content()['pages'] ?? [];
    }

    public static function homepageFaqs(): array
    {
        return self::content()['homepageFaqs'] ?? [];
    }

    public static function indexedRoutes(): array
    {
        return array_keys(self::pages());
    }

    public static function metaForPath(string $path): array
    {
        return self::pages()[$path] ?? [
            'title' => 'Az oldal nem található | Jandl Dávid',
            'description' => 'A keresett oldal nem érhető el. Térj vissza a főoldalra, és nézd meg az elérhető projekteket, szolgáltatásokat vagy a kapcsolatfelvételi lehetőségeket.',
            'type' => 'website',
            'robots' => 'noindex,follow',
        ];
    }

    public static function schemaForPath(string $path, string $baseUrl): array
    {
        $baseUrl = rtrim($baseUrl, '/');
        $meta = self::metaForPath($path);

        if ($path === '/') {
            return [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'Person',
                    'name' => 'Jandl Dávid',
                    'jobTitle' => 'Full-stack webfejlesztő',
                    'url' => self::buildUrl($baseUrl, '/'),
                    'knowsAbout' => [
                        'Laravel',
                        'React',
                        'Webfejlesztés',
                        'Infrastruktúra',
                        'Biztonságközpontú fejlesztés',
                    ],
                ],
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'WebSite',
                    'name' => 'Jandl Dávid',
                    'url' => self::buildUrl($baseUrl, '/'),
                    'inLanguage' => 'hu-HU',
                ],
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'FAQPage',
                    'mainEntity' => array_map(
                        fn (array $item) => [
                            '@type' => 'Question',
                            'name' => $item['question'],
                            'acceptedAnswer' => [
                                '@type' => 'Answer',
                                'text' => $item['answer'],
                            ],
                        ],
                        self::homepageFaqs()
                    ),
                ],
            ];
        }

        if ($path === '/about') {
            return [
                '@context' => 'https://schema.org',
                '@type' => 'AboutPage',
                'name' => 'Rólam',
                'url' => self::buildUrl($baseUrl, '/about'),
                'inLanguage' => 'hu-HU',
            ];
        }

        if (($meta['template'] ?? null) === 'service') {
            $pageName = self::pageName($meta['title']);

            return [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'Service',
                    'name' => $pageName,
                    'description' => $meta['description'],
                    'serviceType' => $pageName,
                    'provider' => [
                        '@type' => 'Person',
                        'name' => 'Jandl Dávid',
                        'url' => self::buildUrl($baseUrl, '/'),
                    ],
                    'areaServed' => 'HU',
                    'url' => self::buildUrl($baseUrl, $path),
                    'inLanguage' => 'hu-HU',
                ],
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'BreadcrumbList',
                    'itemListElement' => [
                        [
                            '@type' => 'ListItem',
                            'position' => 1,
                            'name' => 'Főoldal',
                            'item' => self::buildUrl($baseUrl, '/'),
                        ],
                        [
                            '@type' => 'ListItem',
                            'position' => 2,
                            'name' => $pageName,
                            'item' => self::buildUrl($baseUrl, $path),
                        ],
                    ],
                ],
            ];
        }

        if ($path === '/adatvedelem' || $path === '/sutik') {
            $pageName = self::pageName($meta['title']);

            return [
                '@context' => 'https://schema.org',
                '@type' => 'WebPage',
                'name' => $pageName,
                'description' => $meta['description'],
                'url' => self::buildUrl($baseUrl, $path),
                'inLanguage' => 'hu-HU',
            ];
        }

        if (array_key_exists($path, self::pages())) {
            $pageName = self::pageName($meta['title']);

            return [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'Article',
                    'name' => $pageName,
                    'description' => $meta['description'],
                    'url' => self::buildUrl($baseUrl, $path),
                    'inLanguage' => 'hu-HU',
                    'author' => [
                        '@type' => 'Person',
                        'name' => 'Jandl Dávid',
                    ],
                ],
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'BreadcrumbList',
                    'itemListElement' => [
                        [
                            '@type' => 'ListItem',
                            'position' => 1,
                            'name' => 'Főoldal',
                            'item' => self::buildUrl($baseUrl, '/'),
                        ],
                        [
                            '@type' => 'ListItem',
                            'position' => 2,
                            'name' => $pageName,
                            'item' => self::buildUrl($baseUrl, $path),
                        ],
                    ],
                ],
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebPage',
            'name' => '404',
            'url' => self::buildUrl($baseUrl, $path),
            'inLanguage' => 'hu-HU',
        ];
    }

    public static function routeSources(): array
    {
        return [
            '/' => [
                base_path('src/app/App.tsx'),
                base_path('src/app/components/FAQSection.tsx'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/about' => [
                base_path('src/app/pages/AboutPage.tsx'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/adatvedelem' => [
                base_path('src/app/pages/PrivacyPolicyPage.tsx'),
                base_path('src/app/components/LegalPageLayout.tsx'),
                base_path('src/app/components/CookieBanner.tsx'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/sutik' => [
                base_path('src/app/pages/CookiePolicyPage.tsx'),
                base_path('src/app/components/LegalPageLayout.tsx'),
                base_path('src/app/components/CookieBanner.tsx'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/szolgaltatasok/weboldal-keszites' => [
                base_path('src/app/pages/ServicePage.tsx'),
                base_path('src/app/servicePages.ts'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/szolgaltatasok/webshop-keszites' => [
                base_path('src/app/pages/ServicePage.tsx'),
                base_path('src/app/servicePages.ts'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/szolgaltatasok/automatizacio-rendszerintegracio' => [
                base_path('src/app/pages/ServicePage.tsx'),
                base_path('src/app/servicePages.ts'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/szolgaltatasok/mobilalkalmazas-fejlesztes' => [
                base_path('src/app/pages/ServicePage.tsx'),
                base_path('src/app/servicePages.ts'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/szolgaltatasok/egyedi-szoftverfejlesztes' => [
                base_path('src/app/pages/ServicePage.tsx'),
                base_path('src/app/servicePages.ts'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/szolgaltatasok/infrastruktura-deployment' => [
                base_path('src/app/pages/ServicePage.tsx'),
                base_path('src/app/servicePages.ts'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/projektek/performancevd' => [
                base_path('src/app/pages/PerformanceVDPage.tsx'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/projektek/motocosmos' => [
                base_path('src/app/pages/MotoCosmoPage.tsx'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/projektek/saas-dashboard-platform' => [
                base_path('src/app/pages/CaseStudyPage.tsx'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/projektek/infrastructure-deployment-system' => [
                base_path('src/app/pages/CaseStudyPage.tsx'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
            '/projektek/security-first-platform' => [
                base_path('src/app/pages/CaseStudyPage.tsx'),
                base_path('src/app/seo.tsx'),
                resource_path('seo/site-content.json'),
            ],
        ];
    }

    public static function buildUrl(string $baseUrl, string $path): string
    {
        return $baseUrl.($path === '/' ? '/' : $path);
    }

    public static function fallbackContentForPath(string $path): array
    {
        return match ($path) {
            '/' => [
                'eyebrow' => 'Technikai partner webes rendszerekhez',
                'headline' => 'Megbízható technikai háttér a vállalkozásod mögé.',
                'intro' => 'Weboldalkészítés, webfejlesztés, Laravel- és React-alapú rendszerek, üzleti automatizációk, n8n workflow-k, mobilalkalmazás-fejlesztés és stabil infrastruktúra egy kézben.',
                'items' => [
                    'Weboldalkészítés és egyedi webfejlesztés',
                    'Webshop- és webáruház-készítés',
                    'Laravel, React és backendfejlesztés',
                    'n8n automatizáció, rendszerintegráció és deployment',
                ],
                'cta_href' => '#section-contact',
                'cta_label' => 'Kapcsolatfelvétel',
            ],
            '/about' => [
                'eyebrow' => 'Rólam',
                'headline' => 'Technikai háttér a vállalkozásod mögé.',
                'intro' => 'Jandl Dávidként vállalkozásoknak segítek üzleti célokra optimalizált webes rendszerek, automatizációk és infrastruktúrák tervezésében, fejlesztésében és üzemeltetésében.',
                'items' => [
                    '8+ év technológiai tapasztalat',
                    'Laravel, React, API- és backendfejlesztés',
                    'Stabil, bővíthető és fenntartható rendszerépítés',
                ],
                'cta_href' => '/',
                'cta_label' => 'Vissza a főoldalra',
            ],
            '/adatvedelem' => [
                'eyebrow' => 'Jog és adatvédelem',
                'headline' => 'Adatkezelési tájékoztató',
                'intro' => 'Összefoglaló arról, hogy a jandldavid.hu oldalon milyen személyes és technikai adatok kezelése történik, milyen célból, és milyen jogok illetik meg a látogatókat.',
            ],
            '/sutik' => [
                'eyebrow' => 'Jog és adatvédelem',
                'headline' => 'Süti tájékoztató',
                'intro' => 'Összefoglaló a jandldavid.hu oldalon használt technikai, hozzájárulási és analitikai sütikről, valamint azok szerepéről.',
            ],
            '/szolgaltatasok/weboldal-keszites' => [
                'eyebrow' => 'Webes szolgáltatás',
                'headline' => 'Weboldal készítés és egyedi webfejlesztés',
                'intro' => 'Weboldal készítés, weboldal fejlesztés és weboldal-karbantartás üzleti célokra szabott, gyors és bővíthető rendszerekkel.',
                'items' => [
                    'céges weboldalak és landing oldalak',
                    'egyedi webfejlesztés Laravel- vagy React-alapon',
                    'technikai SEO alapok és karbantartható kód',
                    'weboldal-karbantartás és továbbfejlesztés',
                ],
                'cta_href' => '/#section-contact',
                'cta_label' => 'Kapcsolatfelvétel',
            ],
            '/szolgaltatasok/webshop-keszites' => [
                'eyebrow' => 'E-kereskedelmi szolgáltatás',
                'headline' => 'Webshop készítés és egyedi webáruház fejlesztés',
                'intro' => 'Webshop készítés és webáruház készítés olyan projektekhez, ahol fontos a gyors vásárlási folyamat, a rendszerintegráció és a stabil háttérrendszer.',
                'items' => [
                    'egyedi webshop fejlesztés üzleti logikára szabva',
                    'fizetési, számlázási vagy CRM integrációk',
                    'adminfelület és bővíthető termékkezelés',
                ],
                'cta_href' => '/#section-contact',
                'cta_label' => 'Kapcsolatfelvétel',
            ],
            '/szolgaltatasok/automatizacio-rendszerintegracio' => [
                'eyebrow' => 'Automatizáció',
                'headline' => 'n8n automatizáció és üzleti rendszerintegráció',
                'intro' => 'n8n automatizáció, üzleti automatizáció és rendszerintegráció a kézi folyamatok csökkentésére, átlátható technikai háttérrel.',
                'items' => [
                    'workflow-tervezés és kivitelezés n8n-nel',
                    'API-k, webhookok és külső rendszerek összekötése',
                    'monitorozható, hibabiztos automatizációs logika',
                ],
                'cta_href' => '/#section-contact',
                'cta_label' => 'Kapcsolatfelvétel',
            ],
            '/szolgaltatasok/mobilalkalmazas-fejlesztes' => [
                'eyebrow' => 'Mobilfejlesztés',
                'headline' => 'Mobilalkalmazás-fejlesztés és app készítés',
                'intro' => 'Mobilalkalmazás-fejlesztés és app készítés üzleti rendszerekhez, Flutter- vagy egyedi technikai háttérrel.',
                'items' => [
                    'üzleti alkalmazásfejlesztés iOS- és Android-fókuszú projektekhez',
                    'Flutter alapú app készítés',
                    'backend, API és admin oldali kapcsolódás',
                ],
                'cta_href' => '/#section-contact',
                'cta_label' => 'Kapcsolatfelvétel',
            ],
            '/szolgaltatasok/egyedi-szoftverfejlesztes' => [
                'eyebrow' => 'Egyedi rendszerek',
                'headline' => 'Egyedi szoftverfejlesztés és backendfejlesztés',
                'intro' => 'Egyedi szoftverfejlesztés, backendfejlesztés és Laravel-alapú üzleti rendszerek tervezése, fejlesztése és integrációja.',
                'items' => [
                    'egyedi admin rendszerek és belső workflow-k',
                    'Laravel fejlesztés és API-központú backendek',
                    'rendszerintegráció és hosszú távon bővíthető architektúra',
                ],
                'cta_href' => '/#section-contact',
                'cta_label' => 'Kapcsolatfelvétel',
            ],
            '/szolgaltatasok/infrastruktura-deployment' => [
                'eyebrow' => 'Technikai háttér',
                'headline' => 'Infrastruktúra és deployment üzleti rendszerekhez',
                'intro' => 'Infrastruktúra és deployment modern szerverüzemeltetéssel, rendszerfelügyelettel, monitorozással és stabil release folyamatokkal.',
                'items' => [
                    'Docker, Linux és reverse proxy alapok',
                    'CI/CD, backup és monitoring',
                    'kiszámítható szerverüzemeltetés és rendszerfelügyelet',
                ],
                'cta_href' => '/#section-contact',
                'cta_label' => 'Kapcsolatfelvétel',
            ],
            default => [
                'eyebrow' => str_starts_with($path, '/projektek/') ? 'Esettanulmány' : 'Jandldavid.hu',
                'headline' => self::pageName(self::metaForPath($path)['title']),
                'intro' => self::metaForPath($path)['description'],
            ],
        };
    }

    private static function pageName(string $title): string
    {
        return trim(str_replace(' | Jandl Dávid', '', $title));
    }
}

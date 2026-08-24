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

    private static function pageName(string $title): string
    {
        return trim(str_replace(' | Jandl Dávid', '', $title));
    }
}

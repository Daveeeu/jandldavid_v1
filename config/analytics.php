<?php

return [
    'dashboard' => [
        'token' => env('ADMIN_DASHBOARD_TOKEN'),
        'enabled' => env('ADMIN_DASHBOARD_ENABLED', true),
    ],

    'reporting' => [
        'recipient_email' => env('ANALYTICS_REPORT_EMAIL', env('CONTACT_NOTIFICATION_EMAIL', env('MAIL_FROM_ADDRESS'))),
        'recipient_name' => env('ANALYTICS_REPORT_NAME', env('CONTACT_NOTIFICATION_NAME', env('MAIL_FROM_NAME', env('APP_NAME', 'Laravel')))),
        'enabled' => env('ANALYTICS_REPORT_ENABLED', true),
    ],

    'gtm' => [
        'container_id' => env('VITE_GTM_CONTAINER_ID'),
    ],

    'ga4' => [
        'measurement_id' => env('VITE_GA4_MEASUREMENT_ID'),
        'api_secret' => env('GA4_API_SECRET'),
    ],

    'search_console' => [
        'verification' => env('SEARCH_CONSOLE_VERIFICATION'),
    ],

    'posthog' => [
        'enabled' => env('POSTHOG_ENABLED', false),
        'host' => env('POSTHOG_HOST', 'https://eu.i.posthog.com'),
        'project_key' => env('POSTHOG_PROJECT_KEY'),
    ],

    'plausible' => [
        'enabled' => env('PLAUSIBLE_ENABLED', false),
        'domain' => env('PLAUSIBLE_DOMAIN'),
        'host' => env('PLAUSIBLE_HOST', 'https://plausible.io'),
        'script_src' => env('PLAUSIBLE_SCRIPT_SRC'),
    ],
];

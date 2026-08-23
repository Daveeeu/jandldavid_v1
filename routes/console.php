<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('analytics:send-weekly-report', function (\App\Support\WeeklyAnalyticsReporter $reporter) {
    $sent = $reporter->send();

    $this->info($sent ? 'Weekly analytics report sent.' : 'Weekly analytics report skipped.');
})->purpose('Send the weekly analytics and SEO report email');

Schedule::command('analytics:send-weekly-report')->weeklyOn(1, '08:00');

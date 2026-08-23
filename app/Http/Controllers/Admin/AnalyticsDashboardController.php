<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\AnalyticsReportBuilder;
use Illuminate\Contracts\View\View;

class AnalyticsDashboardController extends Controller
{
    public function __invoke(AnalyticsReportBuilder $reportBuilder): View
    {
        return view('admin.analytics-dashboard', [
            'report' => $reportBuilder->build(),
        ]);
    }
}

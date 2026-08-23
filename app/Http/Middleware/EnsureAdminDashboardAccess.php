<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminDashboardAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!config('analytics.dashboard.enabled')) {
            abort(404);
        }

        $expectedToken = (string) config('analytics.dashboard.token');

        if ($expectedToken === '') {
            abort(403, 'Admin dashboard token is not configured.');
        }

        $providedToken = (string) ($request->header('X-Admin-Token') ?: $request->query('token', ''));

        if (!hash_equals($expectedToken, $providedToken)) {
            abort(403);
        }

        return $next($request);
    }
}

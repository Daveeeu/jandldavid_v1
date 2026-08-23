<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAnalyticsEventsRequest;
use App\Support\AnalyticsIngestionService;
use Illuminate\Http\JsonResponse;

class AnalyticsEventController extends Controller
{
    public function __invoke(StoreAnalyticsEventsRequest $request, AnalyticsIngestionService $ingestion): JsonResponse
    {
        $result = $ingestion->ingest(
            $request->validated('events'),
            $request->validated('context', [])
        );

        return response()->json([
            'stored' => $result['stored'],
            'forwarded' => $result['forwarded'],
        ], 202);
    }
}

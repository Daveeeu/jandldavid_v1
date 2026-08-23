<?php

use App\Http\Controllers\Api\AnalyticsEventController;
use App\Http\Controllers\Api\ProjectAssistantController;
use App\Http\Controllers\Api\ProjectInquiryController;
use Illuminate\Support\Facades\Route;

Route::post('/analytics/events', AnalyticsEventController::class);
Route::post('/ai/project-assistant', ProjectAssistantController::class);
Route::post('/contact/project', ProjectInquiryController::class);

<?php

namespace App\Http\Controllers;

use App\Models\ProjectInquiry;
use Illuminate\Http\Response;

class ProjectInquiryEmailOpenController extends Controller
{
    public function __invoke(ProjectInquiry $projectInquiry, string $token): Response
    {
        if ($projectInquiry->customer_confirmation_tracking_token === $token) {
            $projectInquiry->forceFill([
                'customer_confirmation_opened_at' => $projectInquiry->customer_confirmation_opened_at ?? now(),
                'customer_confirmation_open_count' => $projectInquiry->customer_confirmation_open_count + 1,
            ])->save();
        }

        $pixel = base64_decode('R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');

        return response($pixel, 200, [
            'Content-Type' => 'image/gif',
            'Cache-Control' => 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}

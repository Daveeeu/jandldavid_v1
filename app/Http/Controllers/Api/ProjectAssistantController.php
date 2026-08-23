<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectAssistantRequest;
use App\Support\ProjectAssistant;
use Illuminate\Http\JsonResponse;

class ProjectAssistantController extends Controller
{
    public function __invoke(ProjectAssistantRequest $request, ProjectAssistant $assistant): JsonResponse
    {
        $validated = $request->validated();

        return response()->json(
            $assistant->reply($validated['messages'], $validated['project'])
        );
    }
}

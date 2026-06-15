<?php

namespace App\Http\Controllers;

use App\Models\ApiKey;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApiKeyController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/ApiKeys', [
            'apiKeys' => auth()->user()->apiKeys()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'exchange' => 'required|string',
            'label' => 'nullable|string|max:50',
            'api_key' => 'required|string',
            'api_secret' => 'required|string',
        ]);

        auth()->user()->apiKeys()->create($validated);

        return back()->with('status', 'API Key added successfully!');
    }

    public function destroy(ApiKey $apiKey)
    {
        if ($apiKey->user_id !== auth()->id()) {
            abort(403);
        }

        $apiKey->delete();

        return back()->with('status', 'API Key removed.');
    }
}

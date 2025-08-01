<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Badge;
use App\Models\BadgeAssignment;

class BadgeController extends Controller
{
    public function index()
    {
        return Badge::latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|string',
            'condition' => 'required|string',
        ]);
        $badge = Badge::create($data);
        return response()->json($badge, 201);
    }

    public function show(Badge $badge)
    {
        return $badge;
    }

    public function update(Request $request, Badge $badge)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'icon' => 'sometimes|required|string',
            'condition' => 'sometimes|required|string',
            'is_active' => 'sometimes|required|boolean',
        ]);
        $badge->update($data);
        return response()->json($badge);
    }

    public function destroy(Badge $badge)
    {
        $badge->delete();
        return response()->noContent();
    }
    
    public function grant($id)
    {
        $user = auth()->user();

        $assignment = BadgeAssignment::where('user_id', $user->id)
            ->where('badge_id', $id)
            ->where('status', 'pending')
            ->firstOrFail();

        $assignment->status = 'granted';
        $assignment->assigned_at = now();
        $assignment->save();

        return response()->json($assignment);
    }

}

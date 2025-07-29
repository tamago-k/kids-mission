<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BadgeAssignment;
use Illuminate\Support\Facades\Auth;

class BadgeAssignmentController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $assignments = BadgeAssignment::with('badge')
            ->where('user_id', $user->id)
            ->get();

        return response()->json($assignments);
    }
    public function receive($id)
    {
        $user = auth()->user();

        $assignment = BadgeAssignment::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        if ($assignment->received_at !== null) {
            return response()->json(['message' => 'すでに受け取っています'], 400);
        }

        $assignment->received_at = now();
        $assignment->status = 'received';
        $assignment->save();

        return response()->json($assignment);
    }
}
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
}
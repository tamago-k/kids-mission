<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\RewardBalance;

class RewardBalanceController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $balance = RewardBalance::where('user_id', $user->id)->first();
        return response()->json([
            'balance' => $balance?->balance ?? 0,
        ]);
    }
}
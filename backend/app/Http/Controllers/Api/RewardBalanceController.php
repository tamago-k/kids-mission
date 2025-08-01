<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RewardBalance;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
    public function listAll()
    {
        $childrenWithBalances = DB::table('users')
            ->leftJoin('reward_balances', 'users.id', '=', 'reward_balances.user_id')
            ->where('users.role', 'child')
            ->select(
                'users.id as user_id',
                'users.name',
                DB::raw('COALESCE(reward_balances.balance, 0) as balance')
            )
            ->get();

        return response()->json(['balances' => $childrenWithBalances]);
    }
}
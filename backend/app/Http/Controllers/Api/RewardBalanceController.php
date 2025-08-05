<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RewardBalance;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RewardBalanceController extends Controller
{
    // 現在のポイントを取得（子ども）
    public function index()
    {
        // 現在のログインユーザーを取得
        $user = Auth::user();

        // reward_balances テーブルから、ログインユーザーのポイント残高のレコードを1件取得
        $balance = RewardBalance::where('user_id', $user->id)->first();

        // jsonレスポンスでbalanceを返す
        return response()->json(['balance' => $balance?->balance ?? 0,]);
    }

    //　現在のポイントを取得（親）
    public function listAll()
    {
        // roleがchildのユーザーに対して、reward_balancesテーブルの残高を左結合し、残高がない場合は0を返す
        $childrenWithBalances = DB::table('users')
            ->leftJoin('reward_balances', 'users.id', '=', 'reward_balances.user_id')
            ->where('users.role', 'child')
            ->select(
                'users.id as user_id',
                'users.name',
                DB::raw('COALESCE(reward_balances.balance, 0) as balance')
            )
            ->get();

        // jsonレスポンスでbalanceを返す
        return response()->json(['balances' => $childrenWithBalances]);
    }
}
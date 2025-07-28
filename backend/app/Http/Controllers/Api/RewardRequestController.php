<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RewardRequest;
use App\Models\RewardRequestHistory;
use App\Models\RewardBalance;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class RewardRequestController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $requests = RewardRequest::with('reward')
            ->where('user_id', $user->id)
            ->orderByDesc('requested_at')
            ->get();
        return response()->json($requests);
    }

    // 申請作成
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'reward_id' => 'required|exists:rewards,id',
        ]);

        // まず報酬のポイント数を取得
        $reward = \App\Models\Reward::find($request->reward_id);

        // 現在のポイント残高を取得
        $balance = RewardBalance::where('user_id', $user->id)->first();

        if (!$balance || $balance->balance < $reward->need_reward) {
            return response()->json(['message' => 'ポイントが不足しています'], 422);
        }

        // 申請作成
        $rewardRequest = RewardRequest::create([
            'user_id' => $user->id,
            'reward_id' => $reward->id,
            'status' => 'submitted',
            'requested_at' => Carbon::now(),
        ]);

        // 履歴作成
        RewardRequestHistory::create([
            'reward_request_id' => $rewardRequest->id,
            'status' => 'submitted',
            'changed_by' => $user->id,
            'changed_at' => Carbon::now(),
        ]);

        return response()->json($rewardRequest, 201);
    }

    // 承認処理（親権限で呼ぶ想定）
    public function approve($id)
    {
        $rewardRequest = RewardRequest::findOrFail($id);

        if ($rewardRequest->status !== 'pending') {
            return response()->json(['message' => '既に処理済みです'], 422);
        }

        $balance = RewardBalance::where('user_id', $rewardRequest->user_id)->first();

        $needPoints = $rewardRequest->reward->need_reward;

        if (!$balance || $balance->balance < $needPoints) {
            return response()->json(['message' => 'ポイント不足で承認できません'], 422);
        }

        // ポイント減算
        $balance->balance -= $needPoints;
        $balance->save();

        // 申請ステータス更新
        $rewardRequest->status = 'approved';
        $rewardRequest->save();

        // 履歴追加
        RewardRequestHistory::create([
            'reward_request_id' => $rewardRequest->id,
            'status' => 'approved',
            'changed_by' => Auth::id(),
            'changed_at' => Carbon::now(),
        ]);

        return response()->json($rewardRequest);
    }

    // 却下処理
    public function reject($id)
    {
        $rewardRequest = RewardRequest::findOrFail($id);

        if ($rewardRequest->status !== 'pending') {
            return response()->json(['message' => '既に処理済みです'], 422);
        }

        $rewardRequest->status = 'rejected';
        $rewardRequest->save();

        RewardRequestHistory::create([
            'reward_request_id' => $rewardRequest->id,
            'status' => 'rejected',
            'changed_by' => Auth::id(),
            'changed_at' => Carbon::now(),
        ]);

        return response()->json($rewardRequest);
    }
}

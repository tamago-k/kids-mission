<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reward;
use App\Models\RewardRequest;
use App\Models\RewardRequestHistory;
use App\Models\RewardBalance;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class RewardRequestController extends Controller
{
    // 申請一覧を取得
    public function index(Request $request)
    {
        // 現在のログインユーザーの取得
        $user = Auth::user();

        // 報酬申請の情報を、関連するreward、userを一緒に取得するクエリ。requested_atの順でソート
        $query = RewardRequest::with(['reward', 'user'])->orderByDesc('requested_at');

        // roleがchildは自分の申請のみ取得
        if ($user->role === 'child') {
            $query->where('user_id', $user->id);
        }

        // ステータス絞り込み
        if ($request->has('status')) {
            $status = $request->input('status');
            $query->where('status', $status);
        }

        // 条件にあった申請一覧をDBから取得
        $requests = $query->get();

        // jsonレスポンスでrequestsを返す
        return response()->json(['requests' => $requests]);
    }

    // 報酬申請を新規作成
    public function store(Request $request)
    {
        // 現在のログインユーザーの取得
        $user = Auth::user();

        // requestのバリデーションチェック。必須や型など
        $request->validate([
            'reward_id' => 'required|exists:rewards,id',
        ]);

        // 報酬のポイント数を取得
        $reward = Reward::find($request->reward_id);

        // 現在のポイント数を取得
        $balance = RewardBalance::where('user_id', $user->id)->first();

        // ポイントが足りていなければjsonレスポンスでmessageを返す
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

        // jsonレスポンスでreward_requestを返す
        return response()->json($rewardRequest, 201);
    }

    // 報酬申請の承認処理
    public function approve($id)
    {
        // requestのidの申請を取得
        $rewardRequest = RewardRequest::findOrFail($id);

        // すでに申請済みかチェック
        if ($rewardRequest->status !== 'submitted') {
            return response()->json(['message' => '既に処理済みです'], 422);
        }

        // 申請者の報酬ポイント残高を取得
        $balance = RewardBalance::where('user_id', $rewardRequest->user_id)->first();

        // 申請に必要なポイント数を取得
        $needPoints = $rewardRequest->reward->need_reward;

        // 申請にポイントが足らなかった場合はjsonレスポンスでmessageを返す
        if (!$balance || $balance->balance < $needPoints) {
            return response()->json(['message' => 'ポイント不足で承認できません'], 422);
        }

        // ポイント減算
        $balance->balance -= $needPoints;
        
        // reward_balanceテーブルに保存
        $balance->save();

        // 申請ステータスをapprovedに更新
        $rewardRequest->status = 'approved';

        // reward_requestテーブルに保存
        $rewardRequest->save();

        // 履歴追加
        RewardRequestHistory::create([
            'reward_request_id' => $rewardRequest->id,
            'status' => 'approved',
            'changed_by' => Auth::id(),
            'changed_at' => Carbon::now(),
        ]);

        // jsonレスポンスでreward_requestを返す
        return response()->json($rewardRequest);
    }

    // 報酬申請の却下処理
    public function reject($id)
    {
        // requestのidの申請を取得
        $rewardRequest = RewardRequest::findOrFail($id);

        // すでに処理済みかチェック
        if ($rewardRequest->status !== 'submitted') {
            return response()->json(['message' => '既に処理済みです'], 422);
        }

        // 申請ステータスをrejectedに更新
        $rewardRequest->status = 'rejected';

        // reward_requestテーブルに保存
        $rewardRequest->save();

        // 却下の履歴を作成
        RewardRequestHistory::create([
            'reward_request_id' => $rewardRequest->id,
            'status' => 'rejected',
            'changed_by' => Auth::id(),
            'changed_at' => Carbon::now(),
        ]);

        // jsonレスポンスでreward_requestを返す
        return response()->json($rewardRequest);
    }


    // 報酬申請の履歴処理
    public function histories()
    {
        // 現在のログインユーザーの取得
        $user = Auth::user();

        // レコードを作成
        $rewardRequests = RewardRequest::with('reward')
            ->where('user_id', $user->id)
            ->orderBy('requested_at', 'desc')
            ->get();

        // jsonレスポンスでreward_requestを返す
        return response()->json($rewardRequests);
    }
}

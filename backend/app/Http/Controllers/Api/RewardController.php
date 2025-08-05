<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reward;

class RewardController extends Controller
{
    // 報酬一覧を取得
    public function index()
    {
        // created_atの順番で、rewardテーブルから全件取得
        return Reward::latest()->get();
    }

    // 特定の報酬1件を取得
    public function show(Reward $reward)
    {
        return $reward;
    }

    // 報酬の新規作成
    public function store(Request $request)
    {
        // requestのバリデーションチェック。必須や型など
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|string',
            'need_reward' => 'required|integer|min:0',
        ]);

        // rewardテーブルにレコード追加
        $reward = Reward::create($validated);

        // jsonレスポンスでrewardを返す
        return response()->json($reward, 201);
    }

    public function update(Request $request, Reward $reward)
    {
        // requestのバリデーションチェック。必須や型など
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'icon' => 'sometimes|required|string',
            'need_reward' => 'sometimes|required|integer|min:0',
        ]);

        // rewardテーブルのレコードを更新
        $reward->update($validated);

        // jsonレスポンスでrewardを返す
        return response()->json($reward);
    }

    // 報酬削除
    public function destroy(Reward $reward)
    {
        // 削除
        $reward->delete();
        
        // messageをjsonレスポンスで返す
        return response()->json(['message' => '削除しました']);
    }
}

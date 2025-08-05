<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Badge;
use App\Models\BadgeAssignment;

class BadgeController extends Controller
{
    // バッジ一覧取得
    public function index()
    {
        // created_at順に全件取得
        return Badge::latest()->get();
    }

    // バッジを新規追加
    public function store(Request $request)
    {
        // requestのバリデーションチェック。必須や型など
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|string',
            'condition' => 'required|string',
        ]);

        // バッジのレコード追加
        $badge = Badge::create($validated);

        // jsonレスポンスでbadgeを返す
        return response()->json($badge, 201);
    }

    // バッジ1件だけ取得
    public function show(Badge $badge)
    {
        return $badge;
    }

    //　バッジを更新
    public function update(Request $request, Badge $badge)
    {
        // requestのバリデーションチェック。必須や型など
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'icon' => 'sometimes|required|string',
            'condition' => 'sometimes|required|string',
            'is_active' => 'sometimes|required|boolean',
        ]);

        // バッジのレコード更新
        $badge->update($validated);

        // jsonレスポンスでbadgeを返す
        return response()->json($badge);
    }

    // バッジの削除
    public function destroy(Badge $badge)
    {
        // 削除
        $badge->delete();

        // messageをjsonレスポンスで返す
        return response()->json(['message' => '削除しました']);
    }
    
    // バッチが付与できる状態になって、受け取り済みにするの処理
    public function grant($id)
    {
        // 現在のログインユーザーを取得
        $user = Auth::user();

        // BadgeAssignment（バッジ付与申請）テーブルから、ログインユーザーに紐づいているbadge_idのうちpendingのものを取得
        $assignment = BadgeAssignment::where('user_id', $user->id)
            ->where('badge_id', $id)
            ->where('status', 'pending')
            ->firstOrFail();

        // ステータスをgrantedに更新
        $assignment->status = 'granted';

        // 付与日時を現在日時にセット
        $assignment->assigned_at = now();

        // DBに保存
        $assignment->save();

        // jsonレスポンスでassignmentを返す
        return response()->json($assignment);
    }

}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BadgeAssignment;
use Illuminate\Support\Facades\Auth;

class BadgeAssignmentController extends Controller
{
    // 取得済みバッチ一覧
    public function index()
    {
        // 現在のログインユーザーを取得
        $user = Auth::user();

        // ログインユーザーに紐づくバッジを取得
        $assignments = BadgeAssignment::with('badge')
            ->where('user_id', $user->id)
            ->get();

        // jsonレスポンスでassignmentsを返す
        return response()->json($assignments);
    }
    
    //　バッチの受け取り処置
    public function receive($id)
    {
        // 現在のログインユーザーを取得
        $user = Auth::user();

        // 受け取れるバッチ一覧を取得
        $assignment = BadgeAssignment::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        // received_atがあれば受け取り済みなので、400を返す
        if ($assignment->received_at !== null) {
            return response()->json(['message' => 'すでに受け取っています'], 400);
        }

        // received_atに現在の時刻をセット
        $assignment->received_at = now();

        // statusをreceivedにセット
        $assignment->status = 'received';

        // DBに保存
        $assignment->save();

        // jsonレスポンスでassignmentを返す
        return response()->json($assignment);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TaskComment;
use Illuminate\Support\Facades\Auth;

class TaskCommentController extends Controller
{
    // タスクに紐づくコメント一覧取得
    public function index($taskId)
    {
        $comments = TaskComment::with('user:id,name')->where('task_id', $taskId)->orderBy('created_at')->get();

        // コメントのやり取りは親対子のみなので、自分でなければ反対のroleの人になるのでcomment者の名前等は不要
        // 1DB,1家族構成のため問題ない
        $result = $comments->map(function ($comment) {
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at,
                'user_id' => $comment->user_id,
            ];
        });

        // jsonレスポンスでcommentを返す
        return response()->json($result);
    }

    // コメントを新規作成
    public function store(Request $request, $taskId)
    {
        // 現在のログインユーザーを取得
        $user = Auth::user();

        // requestのバリデーションチェック。必須や型など
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        // コメントをレコードに保存
        $comment = TaskComment::create([
            'task_id' => $taskId,
            'user_id' => $user->id,
            'content' => $request->content,
        ]);
        
        // jsonレスポンスでcommentを返す
        return response()->json($comment, 201);
    }
}
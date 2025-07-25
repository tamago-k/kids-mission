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

        // userのnameだけ取り出して返す例
        $result = $comments->map(function ($comment) {
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at,
                'author_name' => $comment->user->name ?? '不明',
                'author_initial' => mb_substr($comment->user->name ?? '', 0, 1),
                'user_id' => $comment->user_id,
            ];
        });

        return response()->json($result);
    }

    // コメント作成
    public function store(Request $request, $taskId)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        $comment = TaskComment::create([
            'task_id' => $taskId,
            'user_id' => $user->id,
            'content' => $request->content,
        ]);

        return response()->json($comment, 201);
    }

    // コメント編集（必要なら）
    public function update(Request $request, $id)
    {
        $comment = TaskComment::findOrFail($id);
        $user = Auth::user();

        // 自分のコメントのみ編集可能
        if ($comment->user_id !== $user->id) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment->content = $request->content;
        $comment->save();

        return response()->json($comment);
    }

    // コメント削除（必要なら）
    public function destroy($id)
    {
        $comment = TaskComment::findOrFail($id);
        $user = Auth::user();

        if ($comment->user_id !== $user->id) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $comment->delete();

        return response()->noContent();
    }
}
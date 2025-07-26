<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Task;
use App\Http\Controllers\Controller;
use App\Models\TaskWeeklyRecurrence;

class TaskController extends Controller
{
    // 一覧取得
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'parent') {
            $tasks = Task::with('child', 'task_category')
                ->where('parent_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        } elseif ($user->role === 'child') {
            $tasks = Task::with('child', 'task_category')
                ->where('child_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            return response()->json(['message' => '不正なユーザー'], 403);
        }

        return response()->json($tasks);
    }

    // 作成
    public function store(Request $request)
        {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'due_date' => 'nullable|date',
                'recurrence' => 'nullable|in:daily,weekly,monthly,weekdays,weekends',
                'reward_amount' => 'required|integer|min:0',
                'child_id' => 'required|exists:users,id',
                'task_category_id' => 'required|exists:task_categories,id',
            ]);

            $task = Task::create([
                'title' => $request->title,
                'description' => $request->description,
                'due_date' => $request->due_date,
                'recurrence' => $request->recurrence,
                'reward_amount' => $request->reward_amount,
                'child_id' => $request->child_id,
                'parent_id' => auth()->id(),
                'task_category_id' => $request->task_category_id,
            ]);

            // 毎週の曜日指定がある場合は保存
            if ($request->recurrence === 'weekly' && is_array($request->weekdays)) {
                foreach ($request->weekdays as $weekday) {
                    TaskWeeklyRecurrence::create([
                        'task_id' => $task->id,
                        'weekday' => $weekday,
                    ]);
                }
            }
            $task = Task::with('child')->find($task->id);
            return response()->json($task, 201);
        }

    // 更新
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $task = Task::find($id);

        if (!$task || $task->parent_id !== $user->id) {
            return response()->json(['message' => '更新できません'], 403);
        }

        $task->update($request->only([
            'title', 'description', 'due_date', 'recurrence', 'child_id', 'task_category_id', 'reward_amount'
        ]));

        $task = Task::with('child')->find($task->id);
        return response()->json($task);
    }

    // 削除
    public function destroy($id)
    {
        $user = Auth::user();
        $task = Task::find($id);

        if (!$task || $task->parent_id !== $user->id) {
            return response()->json(['message' => '削除できません'], 403);
        }

        $task->delete();
        return response()->json(['message' => '削除しました']);
    }
}

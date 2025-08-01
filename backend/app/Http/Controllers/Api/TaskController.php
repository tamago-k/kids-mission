<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Task;
use App\Http\Controllers\Controller;
use App\Models\TaskWeeklyRecurrence;

class TaskController extends Controller
{
    // 一覧取得
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Task::with(['child', 'task_category', 'latestSubmission']);

        // ユーザーの権限に応じて絞り込み
        if ($user->role === 'child') {
            $query->where('child_id', $user->id);
        } elseif ($user->role !== 'parent') {
            return response()->json(['message' => '不正なユーザー'], 403);
        }

        // status フィルター
        if ($request->has('status')) {
            $status = $request->input('status');
            $query->whereHas('latestSubmission', function ($q) use ($status) {
                $q->where('status', $status);
            });
        }

        $tasks = $query->orderBy('created_at', 'desc')->get();

        // latestSubmissionのstatusをcompletion_statusにセット
        $tasks->transform(function ($task) {
            $task->completion_status = $task->latestSubmission ? $task->latestSubmission->status : null;
            return $task;
        });

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
                'reward_amount' => 'nullable|integer|min:0',
                'child_id' => 'nullable|exists:users,id',
                'task_category_id' => 'nullable|exists:task_categories,id',
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

    public function todayTasks(Request $request)
    {
        
        $user = $request->user();
        $tasks = Task::with('submission')
            ->where('child_id', $user->id)
            ->whereDate('due_date', now())
            ->get();

        return response()->json($tasks);
    }

    public function weekdayTasks(Request $request)
    {
        $user = $request->user();
        $completedTasks = Task::where('child_id', $user->id)
            ->whereHas('submission', function (Builder $query) {
                $query->where('status', 'approved');
            })
            ->whereBetween('updated_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->count();

        $points = Task::where('child_id', $user->id)
            ->whereHas('submission', function (Builder $query) {
                $query->where('status', 'approved');
            })
            ->whereBetween('updated_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->sum('reward_amount');

        return response()->json([
            'task_completed' => $completedTasks,
            'points_earned' => $points,
        ]);
    }
}

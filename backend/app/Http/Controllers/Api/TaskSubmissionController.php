<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskSubmission;
use App\Models\RewardBalance;
use App\Models\RewardBalanceHistory;
use App\Services\BadgeService;

class TaskSubmissionController extends Controller
{
    public function store(Request $request, Task $task)
    {
        $user = Auth::user();

        if ($user->role !== 'child' || $task->child_id !== $user->id) {
            return response()->json(['message' => '許可されていません'], 403);
        }

        $alreadyPending = TaskSubmission::where('task_id', $task->id)
            ->where('user_id', $user->id)
            ->where('status', 'submitted')
            ->exists();

        if ($alreadyPending) {
            return response()->json(['message' => 'すでに申請中です'], 422);
        }

        $submission = TaskSubmission::create([
            'task_id' => $task->id,
            'user_id' => $user->id,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        return response()->json($submission, 201);
    }

    public function approve($taskId)
    {
        // そのtask_idの中で status='submitted' の最新の申請を取得
        $submission = TaskSubmission::where('task_id', $taskId)
            ->where('status', 'submitted')
            ->latest('submitted_at')
            ->first();

        if (!$submission) {
            return response()->json(['message' => '申請が見つかりません'], 404);
        }

        $task = $submission->task;
        // 繰り返し設定がある場合、次回のタスクを自動作成
        if ($task->recurrence) {
            $nextDate = $this->calculateNextDueDate($task);

            if ($nextDate) {
                Task::create([
                    'title' => $task->title,
                    'description' => $task->description,
                    'child_id' => $task->child_id,
                    'reward_amount' => $task->reward_amount,
                    'task_category_id' => $task->task_category_id,
                    'parent_id' => $task->parent_id,
                    'due_date' => $nextDate,
                    'recurrence' => $task->recurrence,
                ]);
            }
        }

        $submission->status = 'approved';
        $submission->save();

        $childId = $task->child_id;
        $rewardAmount = $task->reward_amount ?? 0;

        $balance = RewardBalance::firstOrCreate(
            ['user_id' => $childId],
            ['balance' => 0]
        );
        // RewardBalance を更新（または新規作成）
        $balance = RewardBalance::firstOrCreate(
            ['user_id' => $childId],
            ['balance' => 0]
        );

        $balance->balance += $rewardAmount;
        $balance->save();

        // RewardBalanceHistory に履歴追加
        RewardBalanceHistory::create([
            'user_id'     => $childId,
            'change_type' => 'add',
            'amount'      => $rewardAmount,
            'related_id'  => $submission->id,
            'changed_at'  => now(),
        ]);

        // バッジ判定
        $badgeService = new BadgeService();
        $badgeService->checkAndAssignBadges($submission->user_id);


        return response()->json($submission);
    }

    public function reject($taskId)
    {
        $submission = TaskSubmission::where('task_id', $taskId)
            ->where('status', 'submitted')
            ->latest('submitted_at')
            ->first();

        if (!$submission) {
            return response()->json(['message' => '申請が見つかりません'], 404);
        }

        $submission->status = 'rejected';
        $submission->save();

        return response()->json($submission);
    }

    private function calculateNextDueDate(Task $task): ?Carbon
    {
        $current = Carbon::parse($task->due_date);

        return match ($task->recurrence) {
            'daily' => $current->addDay(),
            'weekly' => $current->addWeek(),
            'monthly' => $current->addMonthNoOverflow(), 
            'weekdays' => $current->nextWeekday(),
            'weekends' => $current->dayOfWeek === 6 ? $current->addDay() : $current->next(Carbon::SATURDAY),
            default => null,
        };
    }
}
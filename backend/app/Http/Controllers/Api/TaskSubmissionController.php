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
    // タスクの申請新規作成
    public function store(Request $request, Task $task)
    {
        //　現在のログインしているユーザーを取得
        $user = Auth::user();

        // 現在のログインユーザーのタスクでない、またはroleがchildでない場合は403を返す
        if ($user->role !== 'child' || $task->child_id !== $user->id) {
            return response()->json(['message' => '許可されていません'], 403);
        }

        // すでに申請済みかチェック
        $alreadyPending = TaskSubmission::where('task_id', $task->id)
            ->where('user_id', $user->id)
            ->where('status', 'submitted')
            ->exists();

        // 申請済みだったら、jsonレスポンスでmessageを返す
        if ($alreadyPending) {
            return response()->json(['message' => 'すでにかくにん中です'], 422);
        }

        // 新しい申請のレコードを追加
        $submission = TaskSubmission::create([
            'task_id' => $task->id,
            'user_id' => $user->id,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        // jsonレスポンスでsubmissionを返す
        return response()->json($submission, 201);
    }

    // タスクの申請許可
    public function approve($taskId)
    {
        // requestのタスクIDに紐づく、最新のsubmitted状態の申請を取得
        $submission = TaskSubmission::where('task_id', $taskId)
            ->where('status', 'submitted')
            ->latest('submitted_at')
            ->first();

        // 申請があるか確認し、なければjsonレスポンスでmessageを返す
        if (!$submission) {
            return response()->json(['message' => '申請が見つかりません'], 404);
        }

        // 申請に紐づくタスクを取得
        $task = $submission->task;

        // もし繰り返し設定があれば
        if ($task->recurrences) {

            //次のタスクの期日を計算
            $nextDate = $this->calculateNextDueDate($task);

            // 計算後、次のタスクを作成（期日以外は複製）
            if ($nextDate) {
                $newTask = Task::create([
                    'title' => $task->title,
                    'description' => $task->description,
                    'child_id' => $task->child_id,
                    'reward_amount' => $task->reward_amount,
                    'task_category_id' => $task->task_category_id,
                    'parent_id' => $task->parent_id,
                    'due_date' => $nextDate,
                    'recurrence' => $task->recurrence,
                ]);

                // 繰り返し設定も複製
                foreach ($task->recurrences as $recurrence) {
                    \App\Models\TaskRecurrence::create([
                        'task_id' => $newTask->id,
                        'recurrence_type' => $recurrence->recurrence_type,
                        'day_of_week' => $recurrence->day_of_week,
                        'day_of_month' => $recurrence->day_of_month,
                    ]);
                }
            }
        }

        // statusをapprovedに変更
        $submission->status = 'approved';

        // DBに保存
        $submission->save();

        // タスクの担当child idを取得
        $childId = $task->child_id;

        //　タスクの報酬を取得
        $rewardAmount = $task->reward_amount ?? 0;

        // reward_balanceのレコードを作成または取得
        $balance = RewardBalance::firstOrCreate(
            ['user_id' => $childId],
            ['balance' => 0]
        );

        // 報酬残高に報酬額を足す
        $balance->balance += $rewardAmount;

        // reward_balanceのレコードを保存または更新
        $balance->save();

        // historyに履歴を追加
        RewardBalanceHistory::create([
            'user_id'     => $childId,
            'change_type' => 'add',
            'amount'      => $rewardAmount,
            'related_id'  => $submission->id,
            'changed_at'  => now(),
        ]);

        // BadgeServiceを呼び出す
        $badgeService = new BadgeService();

        // バッジの取得条件に当てはまっているかチェックし、あれば割り当てる
        $badgeService->checkAndAssignBadges($submission->user_id);

        // jsonレスポンスでsubmissionを返す
        return response()->json($submission);
    }

    // タスクの申請却下
    public function reject($taskId)
    {
        // requestのタスクIDに紐づく、最新のsubmitted状態の申請を取得
        $submission = TaskSubmission::where('task_id', $taskId)
            ->where('status', 'submitted')
            ->latest('submitted_at')
            ->first();

        // 申請があるか確認し、なければjsonレスポンスでmessageを返す
        if (!$submission) {
            return response()->json(['message' => '申請が見つかりません'], 404);
        }

        // statusをrejectedに変更
        $submission->status = 'rejected';

        // DBに保存
        $submission->save();

        // jsonレスポンスでsubmissionを返す
        return response()->json($submission);
    }

    // タスクの完了して、繰り返しタスクだったら次の期日を計算
    private function calculateNextDueDate(Task $task): ?Carbon
    {
        // 現在の期限日をCarbon（日付操作ライブラリ）で扱いやすく変換
        $current = Carbon::parse($task->due_date);

        // 繰り返しが「週単位」または「月単位」の場合の処理。
        if (in_array($task->recurrence, ['weekly', 'monthly'])) {
            $recurrences = $task->recurrences;

            // 繰り返し設定がなければ、次の期限日が計算できないのでnull
            if (!$recurrences || $recurrences->isEmpty()) {
                return null;
            }

            // 週単位の場合、指定された曜日を配列で取得。
            if ($task->recurrence === 'weekly') {
                $daysOfWeek = $recurrences->pluck('day_of_week')->filter()->map('intval')->toArray();

                // 曜日が指定されていなければnull
                if (empty($daysOfWeek)) {
                    return null;
                }

                // 今日から7日間を順に調べ、繰り返し曜日に合致する最初の日を返す
                for ($i = 1; $i <= 7; $i++) {
                    $candidate = $current->copy()->addDays($i);
                    if (in_array($candidate->dayOfWeek, $daysOfWeek, true)) {
                        return $candidate;
                    }
                }

                // 見つからなければnull
                return null;
            }

            // 月単位の場合、指定された日を配列で取得
            if ($task->recurrence === 'monthly') {
                $daysOfMonth = $recurrences->pluck('day_of_month')->filter()->map('intval')->toArray();

                // 日付指定がなければnull
                if (empty($daysOfMonth)) {
                    return null;
                }

                // 今日から31日間を調べて、指定日と合致する最初の日を返す
                for ($i = 1; $i <= 31; $i++) {
                    $candidate = $current->copy()->addDays($i);
                    if (in_array($candidate->day, $daysOfMonth, true)) {
                        return $candidate;
                    }
                }

                // 見つからなければnull
                return null;
            }
        }

        // daily / weekdays / weekends は recurrences に依存せず計算
        return match ($task->recurrence) {
            'daily'    => $current->addDay(),
            'weekdays' => $current->nextWeekday(),
            'weekends' => $current->isSaturday()
                ? $current->addDay()
                : $current->next(Carbon::SATURDAY),
            default    => null,
        };
    }
}
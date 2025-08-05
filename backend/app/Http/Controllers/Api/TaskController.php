<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Task;
use App\Http\Controllers\Controller;
use App\Models\TaskRecurrence;

class TaskController extends Controller
{
    // タスク一覧取得
    public function index(Request $request)
    {
        // 現在のログインユーザーの取得
        $user = Auth::user();

        // Taskモデルをベースにクエリビルダーを用意。またコメント数もカウント
        $query = Task::with(['child', 'task_category', 'latestSubmission', 'recurrences'])
                    ->withCount('comments');

        // roleがchildの時自分のタスクだけを表示し、parentの時は全件表示。それ以外は403を返す。
        if ($user->role === 'child') {
            $query->where('child_id', $user->id);
        } elseif ($user->role !== 'parent') {
            return response()->json(['message' => '不正なユーザー'], 403);
        }

        // 過去の承認済みのタスクを除外（読み込むタスクの量を減らすため）
        if ($request->input('exclude_past_approved') === '1') {
            $query->where(function ($q) {
                $q->whereDoesntHave('latestSubmission')
                ->orWhereHas('latestSubmission', function ($sub) {
                    $sub->where('status', '!=', 'approved')
                        ->orWhereDate('created_at', '>=', now()->toDateString());
                });
            });
        }

        // requestにstatusが含まれているとき
        if ($request->has('status')) {
            $status = $request->input('status');

            // statusがactiveの時は、一度も提出のないタスクを、それ以外は最新の提出のタスクを取得
            if ($status === 'active') {
                $query->whereDoesntHave('latestSubmission');
            } else {
                $query->whereHas('latestSubmission', function ($q) use ($status) {
                    $q->where('status', $status);
                });
            }
        }

        // 1回の読み込みを5件に（読み込むタスクの量を減らすため）
        $perPage = 5;
        $page = $request->input('page', 1);

        // タスクの表示順をupdated_atが新しい順に
        $tasks = $query->orderBy('updated_at', 'desc')->paginate($perPage, ['*'], 'page', $page);

        // ページネーションごとのコレクションを取得
        $tasks->getCollection()->transform(function ($task) {

            // タスクの最新の提出データ（latestSubmission）を取得。なければnull
            $task->completion_status = $task->latestSubmission ? $task->latestSubmission->status : null;

            // タスクの繰り返し設定を取得
            $task->recurringDays = $task->recurrences->map(function ($recurrence) use ($task) {
                // 設定がmonthlyの時、day_of_monthで返す、それ以外はday_of_weekで返す
                if ($task->recurrence === 'monthly') {
                    return (string)$recurrence->day_of_month;
                } else {
                    return (string)$recurrence->day_of_week;
                }
            })->toArray();

            return $task;
        });

        // jsonレスポンスでtaskを返す
        return response()->json($tasks);
    }

    // タスクを新規作成
    public function store(Request $request)
    {
        // requestのバリデーションチェック。必須や型など
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'recurrence' => 'nullable|in:daily,weekly,monthly,weekdays,weekends',
            'reward_amount' => 'nullable|integer|min:0',
            'child_id' => 'nullable|exists:users,id',
            'task_category_id' => 'nullable|exists:task_categories,id',
            'weekdays' => 'nullable|array',
        ]);

        // tasksテーブルにレコード追加
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

        // 繰り返しの設定があり、weekdaysが配列ならweekdaysの値を一つずつ取り出して登録。
        if ($request->recurrence && is_array($request->weekdays)) {
            foreach ($request->weekdays as $value) {
                TaskRecurrence::create([
                    'task_id' => $task->id,
                    'recurrence_type' => $request->recurrence,
                    'day_of_week' => in_array($request->recurrence, ['weekly', 'weekdays', 'weekends']) ? $value : null,
                    'day_of_month' => $request->recurrence === 'monthly' ? $value : null,
                ]);
            }
        }

        // 繰り返しの配列を作成して、taskにセット
        $task->recurringDays = $task->recurrences->map(function ($recurrence) use ($task) {
            if ($task->recurrence === 'monthly') {
                return (string)$recurrence->day_of_month;
            } else {
                return (string)$recurrence->day_of_week;
            }
        })->toArray();

        // taskに関連する子モデル（child と recurrences）をまとめてデータベースから取得して、$taskオブジェクトにセット
        $task->recurringType = $task->recurrence;

        // task に紐づく関連データをまとめてロード（取得）
        $task->load(['child', 'recurrences']);

        // jsonレスポンスでtaskを返す
        return response()->json($task, 201);
    }

    // タスクを更新
    public function update(Request $request, $id)
    {
        // 現在のログインユーザーの取得
        $user = Auth::user();

        // requestのidのtaskがあるか探す
        $task = Task::find($id);

        // taskがない、またはroleが親ではない場合、403を返す
        // 1DB、1家族構成なので、親は全子供のtaskにアクセスで問題ない。
        if (!$task || $user->role !== 'parent') {
            return response()->json(['message' => '更新できません'], 403);
        }

        // requestのバリデーションチェック。必須や型など
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'recurrence' => 'nullable|in:daily,weekly,monthly,weekdays,weekends',
            'reward_amount' => 'nullable|integer|min:0',
            'child_id' => 'nullable|exists:users,id',
            'task_category_id' => 'nullable|exists:task_categories,id',
            'weekdays' => 'nullable|array',
        ]);

        // バリデーション済みデータでレコードを更新
        $task->update($validated);

        // 更新前の繰り返し設定を削除
        $task->recurrences()->delete();

        // 繰り返し設定を再登録
        if ($request->recurrence && is_array($request->weekdays)) {
            foreach ($request->weekdays as $value) {
                TaskRecurrence::create([
                    'task_id' => $task->id,
                    'recurrence_type' => $request->recurrence,
                    'day_of_week' => in_array($request->recurrence, ['weekly', 'weekdays', 'weekends']) ? $value : null,
                    'day_of_month' => $request->recurrence === 'monthly' ? $value : null,
                ]);
            }
        }

        // taskに関連する子モデル（child と recurrences）をまとめてデータベースから取得して、$taskオブジェクトにセット
        $task->load(['child', 'recurrences']);

        // jsonレスポンスでtaskを返す
        return response()->json($task);
    }

    // タスクを削除
    public function destroy($id)
    {
        // 現在のログインユーザーの取得
        $user = Auth::user();

        // requestのidのtaskがあるか探す
        $task = Task::find($id);

        // taskがない、またはroleが親ではない場合、403を返す
        // 1DB、1家族構成なので、親は全子供のtaskにアクセスで問題ない。
        if (!$task || $user->role !== 'parent') {
            return response()->json(['message' => '削除できません'], 403);
        }

        // taskの削除
        $task->delete();

        // messageをjsonレスポンスで返す
        return response()->json(['message' => '削除しました']);
    }

    // 今日のタスクを取得（子ども）
    public function todayTasks(Request $request)
    {
        // 現在のログインユーザーを取得
        $user = $request->user();

        // ログインユーザー（子ども）のタスクで、今日期限のものを取得。submission情報も取得
        $tasks = Task::with('submission')
            ->where('child_id', $user->id)
            ->whereDate('due_date', now())
            ->get();

        // jsonレスポンスでtaskを返す
        return response()->json($tasks);
    }

    // 今週の実績
    public function weekdayTasks(Request $request)
    {
        // 現在のログインユーザーを取得
        $user = $request->user();

        // ログインしたユーザーのタスクで完了したもの（submissionのstatusがapproved）を取得
        $completedTasks = Task::where('child_id', $user->id)
            ->whereHas('submission', function (Builder $query) {
                $query->where('status', 'approved');
            })
            ->whereBetween('updated_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->count();

        // ログインしたユーザーのタスクで完了したタスク（submissionのstatusがapproved）のpointを取得し合計する
        $points = Task::where('child_id', $user->id)
            ->whereHas('submission', function (Builder $query) {
                $query->where('status', 'approved');
            })
            ->whereBetween('updated_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->sum('reward_amount');

        // jsonレスポンスで完了タスク数と、取得ポイント数を返す
        return response()->json([
            'task_completed' => $completedTasks,
            'points_earned' => $points,
        ]);
    }
    
    // カレンダー
    public function calendarTasks(Request $request)
    {
        // 現在ログインしているユーザーを取得
        $user = Auth::user();

        // タスクを取得するクエリ
        $query = Task::with(['child', 'task_category', 'latestSubmission', 'recurrences'])
                    ->withCount('comments');

        // roleがchildの時はログインユーザーのタスクのみ、parentの時は全件、それ以外は403を返す
        if ($user->role === 'child') {
            $query->where('child_id', $user->id);
        } elseif ($user->role !== 'parent') {
            return response()->json(['message' => '不正なユーザー'], 403);
        }

        // requestにstatusが含まれているとき
        if ($request->has('status')) {
            // statusごとに最新のsubmissionを取得
            $status = $request->input('status');
            $query->whereHas('latestSubmission', function ($q) use ($status) {
                $q->where('status', $status);
            });
        }

        // taskの作成順に並べ一覧を取得
        $tasks = $query->orderBy('created_at', 'desc')->get();

        // 取得したタスクコレクションを変換
        $tasks->transform(function ($task) {
            // 各タスクに対して、最新提出のステータスを completion_statusにセット。最新提出がなければnull
            $task->completion_status = $task->latestSubmission ? $task->latestSubmission->status : null;

            // 繰り返し設定を曜日や日付の配列に変換
            $task->recurringDays = $task->recurrences->map(function ($recurrence) use ($task) {
                if ($task->recurrence === 'monthly') {
                    return (string)$recurrence->day_of_month;
                } else {
                    return (string)$recurrence->day_of_week;
                }
            })->toArray();

            return $task;
        });

        // jsonレスポンスでtaskを返す
        return response()->json($tasks);
    }

}

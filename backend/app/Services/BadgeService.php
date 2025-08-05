<?php
namespace App\Services;

use App\Models\Badge;
use App\Models\Task;
use App\Models\TaskSubmission;
use App\Models\BadgeAssignment;

class BadgeService
{

    // ユーザーの達成状況を元に「どのバッジを付与すべきか」を判定し、実際にバッジを付与するまで
    // バッジの条件を読み解き、複数の条件に対応して、付与済みかもチェック
    // 条件を満たしていれば、BadgeAssignmentテーブルに付与レコードを作成
    public function checkAndAssignBadges($childId)
    {

        // ユーザーが承認（approved）されたタスクをcount
        $completedTaskCount = TaskSubmission::where('user_id', $childId)
            ->where('status', 'approved')
            ->count();

        // ユーザーが現在持っているバッジの数をcount
        $ownedBadgeCount = BadgeAssignment::where('user_id', $childId)->count();

        // 有効（is_activeが真）のバッジを全件取得
        $badges = Badge::where('is_active', true)->get();

        // 取得したバッジを1つずつ順に処理
        foreach ($badges as $badge) {

            // バッジの条件（condition）がJSON文字列で保存されているため、配列に変換
            $condition = json_decode($badge->condition, true);

            $meetsCondition = false;

            // $condition 配列の中に task_approve キーがあり、その中に gte（以上の数値）が設定されているか確認
            if (isset($condition['task_approve']['gte'])) {

                // すでに計算済みの $completedTaskCount（ユーザーの承認済みタスク数）が、条件の gte（以上の数）と比べて条件を満たしているかチェック
                if ($completedTaskCount >= $condition['task_approve']['gte']) {
                    
                    // 条件に category 指定があれば、さらにカテゴリ別に条件を絞る処理
                    if (isset($condition['task_approve']['category'])) {
                    
                        // 指定されたカテゴリ（slugなど）を変数 $category に代入
                        $category = $condition['task_approve']['category'];
                    
                        // TaskSubmission モデルを使い、指定ユーザーの承認済みのタスク提出（サブミッション）だけを絞り込み
                        $countByCategory = TaskSubmission::where('user_id', $childId)
                            ->where('status', 'approved')
                            ->whereHas('task', function ($q) use ($category) {
                                $q->whereHas('task_category', function ($q2) use ($category) {
                                    $q2->where('slug', $category);
                                });
                            })->count();
                        // カテゴリ絞り込み後の承認済みタスク数が、条件の gte（以上の数）を満たすか判定
                        // 条件を満たしていれば、判定結果 $meetsCondition を true に設定
                        if ($countByCategory >= $condition['task_approve']['gte']) {
                            $meetsCondition = true;
                        }
                    } else {
                        $meetsCondition = true;
                    }
                }
            }

            // もしまだ条件を満たしていなければ（$meetsCondition が false のまま）、
            // $condition に badge_own_count（バッジ所持数）条件があれば判定に進む。
            if (!$meetsCondition && isset($condition['badge_own_count']['gte'])) {
                if ($ownedBadgeCount >= $condition['badge_own_count']['gte']) {
                    $meetsCondition = true;
                }
            }
            if ($meetsCondition) {

                // すでにそのバッジがユーザーに付与されているか確認
                $alreadyAssigned = BadgeAssignment::where('user_id', $childId)
                    ->where('badge_id', $badge->id)
                    ->exists();

                // 付与されていなければ、
                if (!$alreadyAssigned) {

                    // 新しくバッジを付与（BadgeAssignmentのレコードを作成）
                    BadgeAssignment::create([
                        'user_id' => $childId,
                        'badge_id' => $badge->id,
                        'assigned_at' => now(),
                        'received_at' => null,
                    ]);
                } else {
                }
            } else {
            }
        }
    }
}

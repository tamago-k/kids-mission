<?php
namespace App\Services;

use App\Models\Badge;
use App\Models\TaskSubmission;
use App\Models\BadgeAssignment;

class BadgeService
{
    public function checkAndAssignBadges($childId)
    {

        // 完了タスク数やバッジ所持数など、共通で使うユーザーデータを一括で取得
        $completedTaskCount = TaskSubmission::where('user_id', $childId)
            ->where('status', 'approved')
            ->count();

        $ownedBadgeCount = BadgeAssignment::where('user_id', $childId)->count();

        // 全バッジを取得（有効なものだけ）
        $badges = Badge::where('is_active', true)->get();

        foreach ($badges as $badge) {
            $condition = json_decode($badge->condition, true);
            $meetsCondition = false;

            // 例: task_approve条件判定
            if (isset($condition['task_approve']['gte'])) {
                if ($completedTaskCount >= $condition['task_approve']['gte']) {
                    // カテゴリ指定があれば追加チェック
                    if (isset($condition['task_approve']['category'])) {
                        $category = $condition['task_approve']['category'];
                        $countByCategory = TaskSubmission::where('user_id', $childId)
                            ->where('status', 'approved')
                            ->whereHas('task', function ($q) use ($category) {
                                $q->whereHas('task_category', function ($q2) use ($category) {
                                    $q2->where('slug', $category);
                                });
                            })->count();
                        if ($countByCategory >= $condition['task_approve']['gte']) {
                            $meetsCondition = true;
                        }
                    } else {
                        $meetsCondition = true;
                    }
                }
            }

            // 例: badge_own_count（バッジ所持数）条件判定
            if (!$meetsCondition && isset($condition['badge_own_count']['gte'])) {
                if ($ownedBadgeCount >= $condition['badge_own_count']['gte']) {
                    $meetsCondition = true;
                }
            }

            if ($meetsCondition) {
                $alreadyAssigned = BadgeAssignment::where('user_id', $childId)
                    ->where('badge_id', $badge->id)
                    ->exists();

                if (!$alreadyAssigned) {
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

    protected function checkCondition($userId, $condition)
    {
        if (isset($condition['task_approve'])) {
            $gte = $condition['task_approve']['gte'] ?? 0;
            $category = $condition['task_approve']['category'] ?? null;

            $query = \App\Models\Task::where('user_id', $userId)
                ->where('status', 'approved');

            if ($category) {
                $query->where('category', $category);
            }

            $count = $query->count();

            return $count >= $gte;
        }

        if (isset($condition['badge_count'])) {
            $gte = $condition['badge_count']['gte'] ?? 0;

            $count = BadgeAssignment::where('user_id', $userId)->count();

            return $count >= $gte;
        }

        return false;
    }
}

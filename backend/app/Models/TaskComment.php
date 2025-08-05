<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskComment extends Model
{
    // 一括代入で書き込み可能カラムの指定
    protected $fillable = ['task_id', 'user_id', 'content'];

    // TaskCommentからTaskへのリレーション 
    // TaskCommentインスタンスから、その元になっているTaskを取得できる。
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    // TaskCommentからUserへのリレーション 
    // TaskCommentインスタンスから、その元になっているUserを取得できる。
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
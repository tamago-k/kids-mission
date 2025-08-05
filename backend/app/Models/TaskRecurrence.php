<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskRecurrence extends Model
{
    // 一括代入で書き込み可能カラムの指定
    protected $fillable = ['task_id', 'recurrence_type', 'day_of_week', 'day_of_month'];

    // TaskRecurrenceからTaskへのリレーション 
    // TaskRecurrenceインスタンスから、その元になっているTaskを取得できる。
    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
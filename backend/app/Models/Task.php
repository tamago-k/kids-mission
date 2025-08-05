<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\TaskComment;
use App\Models\TaskWeeklyRecurrence;

class Task extends Model
{
    // 一括代入で書き込み可能カラムの指定
    protected $fillable = ['title','description', 'due_date','recurrence','parent_id','child_id','task_category_id','reward_amount','approved_at'];

    // モデルの属性として自動で日付・日時型に変換するカラムの指定
    protected $casts = [
        'due_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    // モデルのJSON化や配列変換時に、自動的にこれらのカスタム属性を追加する。
    protected $appends = ['isRecurring', 'recurringType'];

    // TaskからUser(Parent)へのリレーション 
    // Taskインスタンスから、その元になっているUser(Parent)を取得できる。
    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    // TaskからUser(Child)へのリレーション 
    // Taskインスタンスから、その元になっているUser(Child)を取得できる。
    public function child()
    {
        return $this->belongsTo(User::class, 'child_id');
    }

    // TaskからTaskWeeklyRecurrenceへのリレーション 
    // Taskインスタンスから、その元になっているTaskWeeklyRecurrenceを取得できる。
    // 一対多
    public function weeklyRecurrences()
    {
        return $this->hasMany(TaskWeeklyRecurrence::class);
    }
    
    // TaskからTaskCategoryへのリレーション 
    // Taskインスタンスから、その元になっているTaskCategoryを取得できる。
    public function task_category()
    {
        return $this->belongsTo(TaskCategory::class, 'task_category_id');
    }
    
    // TaskからTaskSubmissionへのリレーション 
    // Taskインスタンスから、その元になっているTaskSubmissionを取得できる。
    // 一対多
    public function submissions()
    {
        return $this->hasMany(TaskSubmission::class);
    }

    // TaskからTaskSubmissionへのリレーション 
    // Taskインスタンスから、その元になっているTaskSubmissionを取得できる。
    // 一対一
    public function submission()
    {
        return $this->hasOne(TaskSubmission::class);
    }

    // TaskからTaskSubmissionへのリレーション 
    // Taskインスタンスから、その元になっているTaskSubmissionを取得できる。
    // 最新の1件だけ
    public function latestSubmission()
    {
        return $this->hasOne(TaskSubmission::class)->latestOfMany();
    }

    // isRecurringという属性を取得するとき、recurrenceカラムが空じゃなければtrueを返す
    public function getIsRecurringAttribute()
    {
        return !empty($this->recurrence);
    }

    // recurringType属性は、そのままrecurrenceカラムの値を返す
    public function getRecurringTypeAttribute()
    {
        return $this->recurrence;
    }

    // TaskからTaskRecurrenceへのリレーション 
    // Taskインスタンスから、その元になっているTaskRecurrenceを取得できる。
    // 一対多
    public function recurrences()
    {
        return $this->hasMany(TaskRecurrence::class);
    }

    // recurringDays属性は、recurrencesリレーションがロード済みなら、
    // 繰り返しが「monthly」なら日付（例：15日）、
    // そうでなければ曜日（例：2＝火曜）を配列として返す。
    public function getRecurringDaysAttribute()
    {
        if (!$this->relationLoaded('recurrences')) return [];

        return $this->recurrences->map(function ($rec) {
            return $rec->recurrence_type === 'monthly'
                ? (string)$rec->day_of_month
                : (string)$rec->day_of_week;
        })->toArray();
    }

    // TaskからTaskCommentへのリレーション 
    // Taskインスタンスから、その元になっているTaskCommentを取得できる。
    // 一対多
    public function comments()
    {
        return $this->hasMany(TaskComment::class);
    }
}

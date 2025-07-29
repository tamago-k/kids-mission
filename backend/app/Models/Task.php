<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'due_date',
        'recurrence',
        'parent_id',
        'child_id',
        'task_category_id',
        'reward_amount',
        'approved_at',
    ];

    protected $casts = [
        'due_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function child()
    {
        return $this->belongsTo(User::class, 'child_id');
    }

    public function weeklyRecurrences()
    {
        return $this->hasMany(TaskWeeklyRecurrence::class);
    }
    
    public function task_category()
    {
        return $this->belongsTo(TaskCategory::class, 'task_category_id');
    }
    
    // 全件取得用
    public function submissions()
    {
        return $this->hasMany(TaskSubmission::class);
    }

    // ログインユーザー用
    public function submission()
    {
        return $this->hasOne(TaskSubmission::class);
    }

    public function latestSubmission()
    {
        return $this->hasOne(TaskSubmission::class)->latestOfMany();
    }

    protected $appends = ['isRecurring', 'recurringType'];

    public function getIsRecurringAttribute()
    {
        return !empty($this->recurrence);
    }

    public function getRecurringTypeAttribute()
    {
        return $this->recurrence;
    }
}

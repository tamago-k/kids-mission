<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskRecurrence extends Model
{
    protected $fillable = [
        'task_id',
        'recurrence_type',
        'day_of_week',
        'day_of_month',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
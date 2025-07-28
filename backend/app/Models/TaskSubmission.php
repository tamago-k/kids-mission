<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskSubmission extends Model
{
    protected $fillable = [
        'task_id',
        'user_id',
        'status',
        'submitted_at',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function child()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

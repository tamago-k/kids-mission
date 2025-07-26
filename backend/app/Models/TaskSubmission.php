<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskSubmission extends Model
{
    protected $fillable = [
        'task_id',
        'submitted_by',
        'status',
        'submitted_at',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function child()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }
}

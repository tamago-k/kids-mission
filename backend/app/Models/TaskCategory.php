<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Task;

class TaskCategory extends Model
{
    protected $fillable = ['name', 'slug'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
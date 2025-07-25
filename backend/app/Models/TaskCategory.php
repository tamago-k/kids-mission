<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaskCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
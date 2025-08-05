<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Task;

class TaskCategory extends Model
{
    // 一括代入で書き込み可能カラムの指定
    protected $fillable = ['name', 'slug'];

    // TaskCategoryからTaskへのリレーション 
    // TaskCategoryインスタンスから、その元になっているTaskを取得できる。
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
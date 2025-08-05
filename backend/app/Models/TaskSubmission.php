<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskSubmission extends Model
{
    // 一括代入で書き込み可能カラムの指定
    protected $fillable = ['task_id','user_id','status','submitted_at'];

    // TaskSubmissionからTaskへのリレーション 
    // TaskSubmissionインスタンスから、その元になっているTaskを取得できる。
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    // TaskSubmissionからUserへのリレーション 
    // TaskSubmissionインスタンスから、その元になっているUserを取得できる。
    public function child()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

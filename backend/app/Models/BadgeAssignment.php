<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BadgeAssignment extends Model
{
    // 一括代入で書き込み可能カラムの指定
    protected $fillable = ['user_id','badge_id','assigned_at',];

    // BadgeAssignmentからBadgeへのリレーション 
    // BadgeAssignmentインスタンスから、その元になっているBadgeを取得できる。
    public function badge()
    {
        return $this->belongsTo(Badge::class);
    }
}
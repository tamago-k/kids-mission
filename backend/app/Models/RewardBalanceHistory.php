<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class RewardBalanceHistory extends Model
{
    // 一括代入で書き込み可能カラムの指定
    protected $fillable = ['user_id', 'change_type', 'amount', 'related_id', 'changed_at'];

    //Laravelの自動で入るcreated_atとupdated_atのタイムスタンプ管理を無効
    public $timestamps = false;

    // RewardBalanceHistoryからUserへのリレーション 
    // RewardBalanceHistoryインスタンスから、その元になっているUserを取得できる。
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class RewardBalance extends Model
{
    // 一括代入で書き込み可能カラムの指定
    protected $fillable = ['user_id', 'balance'];

    //Laravelの自動で入るcreated_atとupdated_atのタイムスタンプ管理を無効
    public $timestamps = false;

    // RewardBalanceからUserへのリレーション 
    // RewardBalanceインスタンスから、その元になっているUserを取得できる。
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
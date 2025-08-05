<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RewardRequest extends Model
{
    // 一括代入で書き込み可能カラムの指定
    protected $fillable = ['user_id','reward_id','status','requested_at'];

    // updated_atはあるけど、requested_atは独自なのでここで扱う
    public $timestamps = true; 

    // RewardRequestからUserへのリレーション 
    // RewardRequestインスタンスから、その元になっているUserを取得できる。
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // RewardRequestからRewardへのリレーション 
    // RewardRequestインスタンスから、その元になっているRewardを取得できる。
    public function reward()
    {
        return $this->belongsTo(Reward::class);
    }
}

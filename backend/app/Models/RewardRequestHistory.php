<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RewardRequestHistory extends Model
{
    // 一括代入で書き込み可能カラムの指定
    protected $fillable = ['reward_request_id', 'status', 'changed_by','changed_at'];

    //Laravelの自動で入るcreated_atとupdated_atのタイムスタンプ管理を無効
    public $timestamps = false;

    // RewardRequestHistoryからRewardRequestへのリレーション 
    // RewardRequestHistoryインスタンスから、その元になっているRewardRequestを取得できる。
    public function rewardRequest()
    {
        return $this->belongsTo(RewardRequest::class);
    }

    // RewardRequestHistoryから変更者Userへのリレーション 
    // RewardRequestHistoryインスタンスから、その元になっている変更者Userを取得できる。
    public function changer()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}

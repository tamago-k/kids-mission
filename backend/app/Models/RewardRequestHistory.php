<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RewardRequestHistory extends Model
{
    protected $fillable = [
        'reward_request_id',
        'status',
        'changed_by',
        'changed_at',
    ];

    public $timestamps = false;

    // リレーション（RewardRequest）
    public function rewardRequest()
    {
        return $this->belongsTo(RewardRequest::class);
    }

    // リレーション（変更者ユーザー）
    public function changer()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}

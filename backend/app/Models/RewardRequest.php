<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RewardRequest extends Model
{
    protected $fillable = [
        'user_id',
        'reward_id',
        'status',
        'requested_at',
    ];

    public $timestamps = true; // updated_atはあるけど、requested_atは独自なのでここで扱う

    // リレーション（User）
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // リレーション（Reward）
    public function reward()
    {
        return $this->belongsTo(Reward::class);
    }

    // リレーション（履歴）
    public function histories()
    {
        $user = auth()->user();
        $rewardRequests = RewardRequest::with('reward')
            ->where('user_id', $user->id)
            ->orderBy('requested_at', 'desc')
            ->get();

        return response()->json($rewardRequests);
    }
}

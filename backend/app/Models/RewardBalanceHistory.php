<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class RewardBalanceHistory extends Model
{
    protected $fillable = [
        'user_id', 'change_type', 'amount', 'related_id', 'changed_at'
    ];

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

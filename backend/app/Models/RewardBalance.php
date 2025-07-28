<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class RewardBalance extends Model
{
    protected $fillable = ['user_id', 'balance'];

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
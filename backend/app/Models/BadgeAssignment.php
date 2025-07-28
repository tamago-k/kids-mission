<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BadgeAssignment extends Model
{
    protected $fillable = [
        'user_id',
        'badge_id',
        'assigned_at',
    ];

    public function badge()
    {
        return $this->belongsTo(Badge::class);
    }
}
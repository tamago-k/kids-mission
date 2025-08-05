<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    // 一括代入で書き込み可能カラムの指定
    protected $fillable = ['name', 'icon', 'condition','is_active'];
}

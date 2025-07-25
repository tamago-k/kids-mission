<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTaskStatusHistoriesTable extends Migration
{
    public function up()
    {
        Schema::create('task_status_histories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('task_id');
            $table->string('status');
            $table->unsignedBigInteger('changed_by');
            $table->timestamp('changed_at');
            
            // 外部キー制約（必要なら）
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->foreign('changed_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('task_status_histories');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reward_request_histories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('reward_request_id');
            $table->string('status');
            $table->unsignedBigInteger('changed_by');
            $table->timestamp('changed_at');

            $table->foreign('reward_request_id')->references('id')->on('reward_requests')->onDelete('cascade');
            $table->foreign('changed_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reward_request_histories');
    }
};

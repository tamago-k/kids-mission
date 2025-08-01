<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTaskRecurrencesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('task_recurrences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')
                  ->constrained('tasks')
                  ->onDelete('cascade');

            $table->string('recurrence_type');
            $table->unsignedTinyInteger('day_of_week')->nullable();   // 0〜6（週用）
            $table->unsignedTinyInteger('day_of_month')->nullable();  // 1〜31（月用）

            $table->timestamps();

            // Optional indexes
            $table->index('task_id');
            $table->index('recurrence_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_recurrences');
    }
}

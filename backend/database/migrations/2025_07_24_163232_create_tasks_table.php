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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title')->after('id');
            $table->text('description')->nullable()->after('title');
            $table->date('due_date')->nullable()->after('description');
            $table->enum('recurrence', ['daily', 'weekly', 'monthly', 'weekdays', 'weekends'])->nullable()->after('due_date');
            $table->foreignId('parent_id')->constrained('users')->onDelete('cascade')->after('recurrence');
            $table->foreignId('child_id')->constrained('users')->onDelete('cascade')->after('parent_id');
            $table->integer('reward_amount')->default(0)->after('child_id');
            $table->timestamp('completed_at')->nullable()->after('reward_amount');
            $table->foreignId('task_category_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['task_category_id']);
            $table->dropColumn('task_category_id');
        });
    }
};

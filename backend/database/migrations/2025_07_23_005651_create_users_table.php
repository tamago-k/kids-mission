<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('password')->nullable(); // 親のみ必須、子はnull可
            $table->unsignedBigInteger('parent_id')->nullable(); // 子のみ親ID参照
            $table->string('avatar')->nullable(); // 絵文字保存用
            $table->char('pin', 4)->nullable();
            $table->string('theme')->nullable();
            $table->string('age')->nullable();
            $table->enum('role', ['parent', 'child']);
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['parent_id', 'name']); // 親ごとに子の名前重複禁止
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}

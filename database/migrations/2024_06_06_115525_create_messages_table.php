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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->longText('message')->nullable();
            $table->foreignId('sender_id')->constrained('user');
            $table->foreignId('receiver_id')->nullable()->constrained('user');
            $table->foreignId('group_id')->nullable()->constrained('group');
            $table->foreignId('coversation_id')->nullable()->constrained('conversations');
            $table->timestamps();
        });
        Schema::table('groups',function (Blueprint $table){
            $table->foreignId('last_message_id')->nullable()->constrained('messages');
        });
        Schema::table('conversations',function (Blueprint $table){
            $table->foreignId('last_message_id')->nullable()->constrained('conversations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};

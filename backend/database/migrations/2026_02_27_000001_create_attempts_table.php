<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('attempts', function (Blueprint $table) {
            $table->id();
            $table->string('student_name');
            $table->foreignId('quiz_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('score')->default(0);
            $table->json('answers');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attempts');
    }
};

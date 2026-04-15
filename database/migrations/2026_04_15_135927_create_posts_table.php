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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();

            $table->string('titre');
            $table->string('slug')->unique();

            $table->string('sous_titre')->nullable();

            $table->text('courte_description')->nullable();

            $table->longText('contenue');

            $table->string('image')->nullable();
            $table->json('cathegorie')->nullable();

            $table->string('auteur')->default('Dims\' Design');

            $table->timestamp('published_at')->nullable();
            $table->boolean('is_published')->default(false);

            $table->integer('temps_lecture')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};

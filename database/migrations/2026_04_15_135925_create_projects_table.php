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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            $table->string('titre');
            $table->string('slug')->unique();
            $table->enum('cathegorie', [
                'logo design',
                'branding',
                'flyer design',
                'poster design',
                'social media design',
                'ui/ux design',
                'illustration',
                'autre'
            ]);


            $table->text('description')->nullable();
            $table->string('external_link')->nullable();
            $table->json('outils')->nullable();
            $table->decimal('prix', 10, 2)->nullable();
            $table->string('image')->nullable();
            
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);

            $table->timestamps();
        });
       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

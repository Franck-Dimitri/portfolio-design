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
        Schema::table('users', function (Blueprint $table) {
            // 1. Gestion des rôles et statuts
            $table->enum('role', ['admin', 'designer', 'client'])->default('client')->after('password');
            $table->string('status')->default('active')->after('role'); // active, suspended
            
            // 2. Informations de contact et localisation
            $table->string('phone')->nullable()->after('email');
            $table->string('city')->nullable()->after('phone');
            $table->string('country')->default('Cameroon')->after('city');
            
            // 3. Informations professionnelles (Optionnel pour les particuliers)
            $table->string('company_name')->nullable()->after('name');
            
            // 4. Interface et traçabilité
            $table->string('avatar')->nullable()->after('company_name');
            $table->timestamp('last_login_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role', 
                'status', 
                'phone', 
                'city', 
                'country', 
                'company_name', 
                'avatar', 
                'last_login_at'
            ]);
        });
    }
};
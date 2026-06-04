<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('services')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE services MODIFY delaie_livraison VARCHAR(255) NULL');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE services ALTER COLUMN delaie_livraison TYPE VARCHAR(255)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('services')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE services MODIFY delaie_livraison INT NULL');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE services ALTER COLUMN delaie_livraison TYPE INTEGER USING delaie_livraison::integer');
        }
    }
};

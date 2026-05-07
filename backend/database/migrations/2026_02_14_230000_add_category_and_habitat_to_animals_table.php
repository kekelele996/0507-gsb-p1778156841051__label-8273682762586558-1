<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('animals', function (Blueprint $table) {
            if (!Schema::hasColumn('animals', 'category')) {
                $table->string('category')->default('mammal')->after('status');
            }

            if (!Schema::hasColumn('animals', 'habitat')) {
                $table->string('habitat')->default('savanna')->after('category');
            }
        });
    }

    public function down(): void
    {
        Schema::table('animals', function (Blueprint $table) {
            if (Schema::hasColumn('animals', 'habitat')) {
                $table->dropColumn('habitat');
            }

            if (Schema::hasColumn('animals', 'category')) {
                $table->dropColumn('category');
            }
        });
    }
};

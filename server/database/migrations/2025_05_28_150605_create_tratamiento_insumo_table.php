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
        Schema::create('tratamiento_insumo', function (Blueprint $table) {
            $table->id('id');
            $table->foreignId('id_tratamiento')
                  ->constrained('tratamientos', 'id_tratamiento')
                  ->onDelete('cascade');
            $table->foreignId('id_insumo')
                  ->constrained('insumos', 'id_insumo')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tratamiento_insumo');
    }
};

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

            // FK al tratamiento (BIGINT unsigned)
            $table->unsignedBigInteger('id_tratamiento');
            $table->foreign('id_tratamiento')
                  ->references('id_tratamiento')
                  ->on('tratamientos')
                  ->onDelete('cascade');

            // FK al insumo (INT unsigned)
            $table->unsignedInteger('id_insumo');
            $table->foreign('id_insumo')
                  ->references('id_insumo')
                  ->on('insumos')
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

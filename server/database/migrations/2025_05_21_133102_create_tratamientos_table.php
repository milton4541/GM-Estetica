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
        Schema::create('tratamientos', function (Blueprint $table) {
            // PK autoincremental
            $table->id('id_tratamiento');

            // Descripción del tratamiento
            $table->string('descripcion');

            // Duración en minutos (entero)
            $table->integer('duracion');

            // Precio (decimal/floating)
            $table->float('precio');

            // created_at y updated_at
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tratamientos');
    }
};

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
   Schema::create('turnos', function (Blueprint $table) {
            // PK autoincremental
            $table->increments('id_turno');

            // Fecha en formato YYYY-MM-DD
            $table->date('fecha');

            // Hora en formato 24h (HH:MM:SS)
            $table->time('hora');

            // FK al tratamiento
            $table->unsignedInteger('id_tratamiento');
            $table->foreign('id_tratamiento')
                  ->references('id_tratamiento')
                  ->on('tratamientos')
                  ->onDelete('cascade');

            // FK al paciente
            $table->unsignedInteger('id_paciente');
            $table->foreign('id_paciente')
                  ->references('id_paciente')
                  ->on('pacientes')
                  ->onDelete('cascade');

            // created_at y updated_at
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('turnos');
    }
};

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
        Schema::create('historial', function (Blueprint $table) {
            // PK autoincremental
            $table->increments('id_historial');

            // FKs
            $table->unsignedInteger('id_paciente');
            $table->unsignedInteger('id_tratamiento');

            // Fecha de la consulta/registro
            $table->date('fecha');

            // Campo extra para notas, diagnóstico, recomendaciones…
            $table->text('observaciones')->nullable();

            // timestamps opcionales
            $table->timestamps();

            // Definición de foráneas
            $table->foreign('id_paciente')
                  ->references('id_paciente')
                  ->on('pacientes')
                  ->onDelete('cascade');

            $table->foreign('id_tratamiento')
                  ->references('id_tratamiento')
                  ->on('tratamientos')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial');
    }
};

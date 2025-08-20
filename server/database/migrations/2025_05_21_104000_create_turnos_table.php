<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('turnos', function (Blueprint $table) {
            // PK autoincremental como BIGINT
            $table->bigIncrements('id_turno');

            // Fecha y hora del turno
            $table->date('fecha');
            $table->time('hora');

            // FK al tratamiento
            $table->unsignedBigInteger('id_tratamiento');
            $table->foreign('id_tratamiento')
                  ->references('id_tratamiento')
                  ->on('tratamientos')
                  ->onDelete('cascade');

            // FK al paciente
            $table->unsignedBigInteger('id_paciente');
            $table->foreign('id_paciente')
                  ->references('id_paciente')
                  ->on('pacientes')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('turnos');
    }
};

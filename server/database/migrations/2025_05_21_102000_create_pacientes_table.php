<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pacientes', function (Blueprint $table) {
            // PK autoincremental como BIGINT
            $table->bigIncrements('id_paciente');

            // Datos del paciente
            $table->string('dni_paciente', 20)->unique();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('email')->unique();
            $table->string('telefono', 20);
            $table->string('obra_social', 100);

            // created_at y updated_at
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pacientes');
    }
};

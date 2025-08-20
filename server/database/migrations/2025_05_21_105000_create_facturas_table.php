<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facturas', function (Blueprint $table) {
            // PK autoincremental como BIGINT
            $table->bigIncrements('factura_id');

            // Datos monetarios
            $table->decimal('importe', 10, 2);
            $table->decimal('descuento_precio', 10, 2)->default(0);
            $table->decimal('descuento_porcentaje', 5, 2)->default(0);
            $table->decimal('importe_final', 10, 2);

            // FK al paciente
            $table->unsignedBigInteger('id_paciente');
            $table->foreign('id_paciente')
                  ->references('id_paciente')
                  ->on('pacientes')
                  ->onDelete('cascade');

            // FK al tratamiento
            $table->unsignedBigInteger('id_tratamiento');
            $table->foreign('id_tratamiento')
                  ->references('id_tratamiento')
                  ->on('tratamientos')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facturas');
    }
};

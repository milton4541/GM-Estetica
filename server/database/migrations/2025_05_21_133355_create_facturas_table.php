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
        Schema::create('facturas', function (Blueprint $table) {
            // PK autoincremental
            $table->increments('factura_id');

            // Usamos DECIMAL en lugar de FLOAT para valores monetarios
            $table->decimal('importe', 10, 2);
            $table->decimal('descuento_precio', 10, 2)->default(0);
            $table->decimal('descuento_porcentaje', 5, 2)->default(0);

            // Si decides almacenar importe_final:
            $table->decimal('importe_final', 10, 2);

            // FKs
            $table->unsignedInteger('id_paciente');
            $table->foreign('id_paciente')
                  ->references('id_paciente')
                  ->on('pacientes')
                  ->onDelete('cascade');

            $table->unsignedInteger('id_tratamiento');
            $table->foreign('id_tratamiento')
                  ->references('id_tratamiento')
                  ->on('tratamientos')
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
        Schema::dropIfExists('facturas');
    }
};

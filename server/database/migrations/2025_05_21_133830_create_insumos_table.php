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
        Schema::create('insumos', function (Blueprint $table) {
            // PK autoincremental
            $table->increments('id_insumo');

            // Campos solicitados
            $table->string('componentes');
            $table->float('precio_insumo');
            $table->integer('cantidad');
            $table->string('nombre', 100);
            $table->date('fecha_expiracion');

            // created_at y updated_at
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('insumos');
    }
};

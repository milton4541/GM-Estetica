<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tratamiento_insumo', function (Blueprint $table) {
            $table->id('id_tratamiento_insumo');
            $table->unsignedBigInteger('id_tratamiento');
            $table->unsignedBigInteger('id_insumo');
            $table->timestamps();

            $table->foreign('id_tratamiento')->references('id_tratamiento')->on('tratamiento')->onDelete('cascade');
            $table->foreign('id_insumo')->references('id_insumo')->on('insumo')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tratamiento_insumo');
    }
};

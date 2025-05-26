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
        Schema::create('users', function (Blueprint $table) {
            // PK autoincremental
            $table->increments('id_usuario');

            // Datos del usuario
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('email')->unique();
            $table->string('contrasena');
            $table->string('nombre_usuario', 50)->unique();

            // FK al rol
            $table->unsignedInteger('id_rol');
            $table->foreign('id_rol')
                  ->references('id')
                  ->on('rols')
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
        Schema::dropIfExists('users');
    }
};

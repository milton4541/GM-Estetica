<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('doc_trabajos', function (Blueprint $table) {
            $table->increments('doc_id');
            $table->string('nombre_doc');
            $table->string('url'); // e.g. "archivos/uuid.png"
            $table->unsignedInteger('historial_id'); 
            $table->uuid('doc_trabajo_guid')->unique();
            $table->boolean('eliminado')->default(false);
            $table->timestamps();

            $table->foreign('historial_id') // cambio aquí
                  ->references('id_historial')
                  ->on('historial') // tabla historial
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('doc_trabajos');
    }
};


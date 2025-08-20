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
    Schema::table('turnos', function (Blueprint $table) {
        $table->boolean('finalizado')->default(false)->after('fecha'); // o el campo que quieras
    });
}

public function down()
{
    Schema::table('turnos', function (Blueprint $table) {
        $table->dropColumn('finalizado');
    });
}

};

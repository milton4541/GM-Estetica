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
    Schema::table('insumos', function (Blueprint $table) {
        $table->integer('cantidad_min')->default(2)->after('cantidad');
    });
}

public function down()
{
    Schema::table('insumos', function (Blueprint $table) {
        $table->dropColumn('cantidad_min');
    });
}
};

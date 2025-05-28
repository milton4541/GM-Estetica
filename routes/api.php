<?php

use App\Http\Controllers\Api\FacturaController;
use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsUserAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PacienteController;
use App\Http\Controllers\Api\InsumoController;
use App\Http\Controllers\Api\TratamientoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TurnoController;

//rutas publicas
Route::post('register',[AuthController::class,'register']);
Route::post('login',[AuthController::class,'login']);

//rutas privadas (necesitas auth)
Route::middleware([IsUserAuth::class])->group(function () {
    Route::controller(PacienteController::class)->group(function () {
        Route::get('paciente','getPacientes');
        Route::post('paciente', 'createPaciente');
        Route::get('/paciente/{id}','getPacienteById');
        Route::patch('/paciente/{id}','updatePaciente');
        Route::delete('/paciente/{id}','deletePaciente');
    });

    Route::controller(TratamientoController::class)->group(function () {
        Route::get('tratamiento', 'getTratamientos');
        Route::post('tratamiento','createTratamiento');
        Route::get('/tratamiento/{id}','getTratamientoById');
        Route::patch('/tratamiento/{id}','updateTratamiento');
        Route::delete('/tratamiento/{id}','deleteTratamiento');
    });
    Route::controller(TurnoController::class)->group(function () {
        Route::get(   'turno',       'getTurnos'      );
        Route::post(  'turno',       'createTurno'    );
        Route::get(   'turno/{id}',  'getTurnoById'   );
        Route::patch( 'turno/{id}',  'updateTurno'    );
        Route::delete('turno/{id}',  'deleteTurno'    );
    });

    
    Route::controller(InsumoController::class)->group(function () {
        Route::get(   'insumo',         'getInsumos');
        Route::get(   'insumo/{id}',    'getInsumoById');
        Route::post(  'insumo',         'createInsumo');
        Route::patch( 'insumo/{id}',    'updateInsumo');
        Route::delete('insumo/{id}',    'deleteInsumo');
    });

    Route::controller(FacturaController::class)->group(function () {
        Route::get(    'facturas',        'getFacturas');
        Route::get(    'factura/{id}',    'getFacturaById');
        Route::post(   'factura',         'createFactura');
        Route::patch(  'factura/{id}',    'updateFactura');
        Route::delete( 'factura/{id}',    'deleteFactura');
    });
    //rutas que solo tiene acceso el admin y esta autenticado
    Route::middleware([IsAdmin::class])->group(function () { 

    });
});

<?php

use App\Http\Controllers\Api\DocumentoController;
use App\Http\Controllers\Api\FacturaController;
use App\Http\Controllers\Api\HistorialController;
use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsUserAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PacienteController;
use App\Http\Controllers\Api\InsumoController;
use App\Http\Controllers\Api\TratamientoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TurnoController;
use App\Http\Controllers\Api\TratamientoInsumoController;
use App\Http\Controllers\Api\ReporteAdministrativoController;

//rutas publicas
Route::post('register',[AuthController::class,'register']);
Route::post('login',[AuthController::class,'login']);

//rutas privadas (necesitas auth)
Route::middleware([IsUserAuth::class])->group(function () {
    Route::controller(PacienteController::class)->group(function () {
        Route::get('pacientes','getPacientes');
        Route::post('pacientes', 'createPaciente');
        Route::get('/pacientes/{id}','getPacienteById');
        Route::patch('/pacientes/{id}','updatePaciente');
        Route::delete('/pacientes/{id}','deletePaciente');
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
    
    Route::controller(HistorialController::class)->group(function(){
        Route::get('historial', 'getHistorial');
    });
    
    Route::controller(TratamientoInsumoController::class)->group(function () {
        Route::get(    'tratamientos-insumos',       'getRelaciones');
        Route::get(    'tratamiento-insumo/{id}',    'getRelacionById');
        Route::post(   'tratamiento-insumo',         'createRelacion');
        Route::patch(  'tratamiento-insumo/{id}',    'updateRelacion');
        Route::delete( 'tratamiento-insumo/{id}',    'deleteRelacion');
    });

    Route::controller(ReporteAdministrativoController::class)->group(function () {
    Route::get('reportes/ingresos-totales', 'ingresosTotales');
    Route::get('reportes/ingresos-mensuales', 'ingresosPorMes');
    Route::get('reportes/rendimiento-tratamientos', 'rendimientoPorTratamiento');
    });

    Route::controller(AuthController::class)->middleware('auth:api')->group(function () {
    Route::post('logout', 'logout');
    Route::get('user','getUser');
    });
    Route::controller(DocumentoController::class)->group(function(){
        Route::get('documento', 'getDoc');
        Route::post('documento', 'createDoc');
    });
});

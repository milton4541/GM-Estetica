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
use App\Http\Controllers\BackupController;



//rutas publicas
Route::post('register',[AuthController::class,'register']);
Route::post('login',[AuthController::class,'login']);
Route::post('rol',[AuthController::class,'createRol']);
Route::controller(BackupController::class)->group(function () {Route::get('backup/crear', 'createBackup');});

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
        Route::get('tratamientos', 'getTratamientos');
        Route::post('tratamientos','createTratamiento');
        Route::get('/tratamientos/{id}','getTratamientoById');
        Route::patch('/tratamientos/{id}','updateTratamiento');
        Route::delete('/tratamientos/{id}','deleteTratamiento');
    });
    
    Route::controller(TurnoController::class)->group(function () {
        Route::get(   'turnos',           'getTurnos'      );
        Route::post(  'turnos',           'createTurno'    );
        Route::get(   'turnos/{id}',      'getTurnoById'   );
        Route::patch( 'turnos/{id}',      'updateTurno'    );
        Route::delete('turnos/{id}',      'deleteTurno'    );
        Route::post(  'turnos/{id}/finalizar', 'finalizarTurno');
    });

    Route::controller(InsumoController::class)->group(function () {
        Route::get(   'insumos',            'getInsumos');
        Route::get(   'insumos/{id}',       'getInsumoById');
        Route::post(  'insumos',            'createInsumo');
        Route::patch( 'insumos/{id}',       'updateInsumo');
        Route::delete('insumos/{id}',       'deleteInsumo');
        Route::put(   'insumos/actualizar-stock', 'actualizarStock');
        Route::put(   'insumos/reestock',          'reestock');
    });

    Route::controller(FacturaController::class)->group(function () {
        Route::get(    'facturas',        'getFacturas');
        Route::get(    'facturas/{id}',    'getFacturaById');
        Route::post(   'facturas',         'createFactura');
        Route::patch(  'facturas/{id}',    'updateFactura');
        Route::delete( 'facturas/{id}',    'deleteFactura');
    });
    
    Route::controller(HistorialController::class)->group(function () {
        Route::get('historiales', 'getHistorial');
        Route::get('historiales/paciente/{id}', 'getHistorialPorPaciente');
        Route::get('historiales/tratamiento/{id}', 'getHistorialPorTratamiento');
    });
    
    Route::controller(TratamientoInsumoController::class)->group(function () {
        Route::get(    'tratamientos-insumos',       'getRelaciones');
        Route::get(    'tratamiento-insumo/{id}',    'getRelacionById');
        Route::post(   'tratamiento-insumo',         'createRelacion');
        Route::patch(  'tratamiento-insumo/{id}',    'updateRelacion');
        Route::delete( 'tratamiento-insumo/{id_tratamiento}',    'deleteRelacion');
    });

    Route::controller(ReporteAdministrativoController::class)->group(function () {
        Route::get('reportes/ingresos-totales', 'ingresosTotales');
        Route::get('reportes/ingresos-totales-pdf', 'exportarIngresosTotalesPdf');
        Route::get('reportes/ingresos-mensuales', 'ingresosPorMes');
        Route::get('reportes/ingresos-mensuales-pdf', 'exportarIngresosMensualesPdf');
        Route::get('reportes/rendimiento-tratamientos', 'rendimientoPorTratamiento');
        Route::get('reportes/rendimiento-tratamientos-pdf', 'exportarRendimientoTratamientosPdf');
        Route::get('reportes/tratamientos', 'listarTratamientos');
    });


    Route::get('/jwt-check', function () {
    return response()->json([
        'env' => env('JWT_SECRET'),
        'config' => config('jwt.secret')
    ]);
    });
    
    Route::controller(AuthController::class)->group(function () {
        Route::post('logout', 'logout');
        Route::get('user', 'getUser');
        Route::patch('users/{id}/eliminar', 'eliminarUsuario');
        Route::patch('users/{id}/toggle-bloqueado', 'toggleBloqueado');
        Route::get('getRol','getRoles');
        Route::get('getUsuarios','getUsuarios');
    });


    Route::controller(DocumentoController::class)->group(function(){
        Route::get('documentos', 'getDoc');
        Route::get('documentos/{id}', 'download');
        Route::post('documentos', 'createDoc');
        Route::delete('documentos/{id}', 'deleteFromBD'); 
    });
    

});

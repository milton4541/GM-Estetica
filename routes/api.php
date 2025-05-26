<?php

use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsUserAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PacienteController;
use App\Http\Controllers\Api\TratamientoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TurnoController;

//rutas publicas
Route::post('register',[AuthController::class,'register']);
Route::post('login',[AuthController::class,'login']);

//rutas privadas (necesitas auth)
Route::middleware([IsUserAuth::class])->group(function () {
    Route::controller(PacienteController::class)->group(function () {
        Route::get('pacientes','getPacientes');
        Route::post('paciente', 'createPaciente');
        Route::get('/paciente/{id}','getPacienteById');
        Route::patch('/paciente/{id}','updatePaciente');
        Route::delete('/paciente/{id}','deletePaciente');
        });
    //rutas que solo tiene acceso el admin y esta autenticado
    Route::middleware([IsAdmin::class])->group(function () { 

    });
});



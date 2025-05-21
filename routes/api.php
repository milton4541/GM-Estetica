<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PacienteController;
use App\Http\Controllers\Api\TratamientoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TurnoController;


Route::get('ping', function () {
    return response()->json(['message' => 'pong']);
});

Route::apiResource('consultas', TratamientoController::class);
Route::apiResource('pacientes', PacienteController::class);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('pacientes', PacienteController::class);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('consultas', TratamientoController::class);
});

Route::get('/pacientes/{pacienteId}/consultas', [TratamientoController::class, 'consultasPorPaciente'])
    ->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('turnos', TurnoController::class);
});
    
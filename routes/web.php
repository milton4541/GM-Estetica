<?php

use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return '¡La ruta funciona!';
});

/*
Route::get('/api/test', function () {
    return response()->json(['mensaje' => '¡Funciona desde web.php!']);
});
*/
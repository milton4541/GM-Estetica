<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Las rutas que deberían ser excluidas de la verificación CSRF.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Puedes agregar rutas si necesitás que no chequeen CSRF
    ];
}
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;


class IsUserAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // 1) ¿Tenemos token?
            $token = JWTAuth::getToken();
            if (! $token) {
                return response()->json(['message'=>'Token no proporcionado'], 401);
            }
        }
        catch (TokenExpiredException $e) {
            return response()->json(['message'=>'Token expirado'], 401);
        }
        catch (TokenInvalidException $e) {
            return response()->json(['message'=>'Token inválido'], 401);
        }
        catch (JWTException $e) {
            return response()->json(['message'=>'Error procesando token: '.$e->getMessage()], 401);
        }

        return $next($request);
    }
}
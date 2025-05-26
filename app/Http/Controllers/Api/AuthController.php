<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;


class AuthController extends Controller
{
    // Registrar usuario
public function register(Request $request)
{
    $validated = $request->validate([
        'nombre' => 'required|string|max:255',
        'apellido' => 'required|string|max:255',
        'nombre_usuario' => 'required|string|max:144|unique:users,nombre_usuario',
        'id_rol' => 'nullable|integer',
        'email' => 'required|string|email|max:255|unique:users,email',
        'password' => 'required|string|min:8|confirmed', 
        //al tener el confirmed en el password hay que pasarlo 2 veces
    ]);

    $user = User::create([
        'nombre'         => $validated['nombre'],
        'apellido'       => $validated['apellido'],
        'nombre_usuario' => $validated['nombre_usuario'],
        'id_rol'         => $validated['id_rol'] ?? null,
        'email'          => $validated['email'],
        'password'       => bcrypt($validated['password']),
    ]);

    return response()->json([
        'message' => 'Usuario registrado exitosamente',
        'user' => $user,
    ], 201);
}
    // Login de usuario
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre_usuario' => 'required|string',
            'password' => 'required|string',
        ]);
        if( $validator->fails() ) {
            return response()->json(['error' => $validator->errors()],422);
        }
        $credentials = $request->only(['email','password']);
        try {
            if(!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error'=> 'Credenciales Invalidas'],401);
            }
        }catch(JWTException $e){
            return response()->json(['error'=> 'No se creo el token', $e],500);
        }
    }

    public function getUser()
    {
        $user = Auth::user();
        return response()->json($user,200);
    }

    public function logout(){
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Sesión cerrada correctamente'],200);
    }
}

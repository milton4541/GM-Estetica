<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rol;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\JsonResponse;


class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/register",
     *     summary="Registrar un nuevo usuario",
     *     tags={"Autenticación"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nombre", "apellido", "nombre_usuario", "email", "password", "password_confirmation"},
     *             @OA\Property(property="nombre", type="string", example="Juan"),
     *             @OA\Property(property="apellido", type="string", example="Pérez"),
     *             @OA\Property(property="nombre_usuario", type="string", example="juan123"),
     *             @OA\Property(property="id_rol", type="integer", nullable=true, example=2),
     *             @OA\Property(property="email", type="string", format="email", example="juan@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Usuario registrado exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Usuario registrado exitosamente"),
     *             @OA\Property(property="user", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="nombre", type="string", example="Juan"),
     *                 @OA\Property(property="apellido", type="string", example="Pérez"),
     *                 @OA\Property(property="nombre_usuario", type="string", example="juan123"),
     *                 @OA\Property(property="id_rol", type="integer", example=2),
     *                 @OA\Property(property="email", type="string", example="juan@example.com"),
     *                 @OA\Property(property="created_at", type="string", example="2025-07-02T12:00:00.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", example="2025-07-02T12:00:00.000000Z")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación"
     *     )
     * )
     */
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
    /**
 * @OA\Post(
 *     path="/api/login",
 *     summary="Iniciar sesión y obtener token JWT",
 *     tags={"Autenticación"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"nombre_usuario", "password"},
 *             @OA\Property(property="nombre_usuario", type="string", example="juan123"),
 *             @OA\Property(property="password", type="string", format="password", example="password123")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Inicio de sesión exitoso",
 *         @OA\JsonContent(
 *             @OA\Property(property="access_token", type="string", example="eyJ0eXAiOiJKV1QiLCJh..."),
 *             @OA\Property(property="token_type", type="string", example="bearer"),
 *             @OA\Property(property="expires_in", type="integer", example=3600),
 *             @OA\Property(property="user", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="nombre", type="string", example="Juan"),
 *                 @OA\Property(property="apellido", type="string", example="Pérez"),
 *                 @OA\Property(property="email", type="string", example="juan@example.com"),
 *                 @OA\Property(property="nombre_usuario", type="string", example="juan123"),
 *                 @OA\Property(property="id_rol", type="integer", example=2),
 *                 @OA\Property(property="created_at", type="string", example="2025-07-01T12:00:00.000000Z"),
 *                 @OA\Property(property="updated_at", type="string", example="2025-07-01T12:00:00.000000Z")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Credenciales inválidas"
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Error de validación"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error al crear el token"
 *     )
 * )
 */
    public function login(Request $request)
{
    $validator = Validator::make($request->all(), [
        'nombre_usuario' => 'required|string',
        'password'       => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 422);
    }

    $credentials = $request->only('nombre_usuario', 'password');

    try {
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }
    } catch (JWTException $e) {
        return response()->json([
            'error'   => 'No se pudo crear el token',
            'message' => $e->getMessage(),
        ], 500);
    }

    // Usuario autenticado
    $user = JWTAuth::user() ?? JWTAuth::setToken($token)->toUser();

    // Cargar relación rol (usa rols.id)
    $user->loadMissing('rol'); // o: ->loadMissing('rol:id,nombre_rol');

    return response()->json([
        'access_token' => $token,
        'token_type'   => 'bearer',
        'expires_in'   => auth('api')->factory()->getTTL() * 60,
        'user'         => [
            'id_usuario'      => $user->id_usuario,                 // tu PK real
            'nombre'          => $user->nombre,
            'apellido'        => $user->apellido,
            'nombre_usuario'  => $user->nombre_usuario,
            'email'           => $user->email,
            'id_rol'          => $user->id_rol,                     // FK en users
            'rol'             => optional($user->rol)->nombre_rol,  // nombre legible
        ],
    ]);
}
/**
 * @OA\Get(
 *     path="/api/user",
 *     summary="Obtener el usuario autenticado",
 *     tags={"Autenticación"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Usuario autenticado",
 *         @OA\JsonContent(
 *             @OA\Property(property="id", type="integer", example=1),
 *             @OA\Property(property="nombre", type="string", example="Juan"),
 *             @OA\Property(property="apellido", type="string", example="Pérez"),
 *             @OA\Property(property="email", type="string", example="juan@example.com"),
 *             @OA\Property(property="nombre_usuario", type="string", example="juan123"),
 *             @OA\Property(property="id_rol", type="integer", example=2),
 *             @OA\Property(property="created_at", type="string", example="2025-07-01T12:00:00.000000Z"),
 *             @OA\Property(property="updated_at", type="string", example="2025-07-01T12:00:00.000000Z")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Token no válido o no proporcionado"
 *     )
 * )
 */
    public function getUser()
    {
        $user = Auth::user();
        return response()->json($user,200);
    }
/**
 * @OA\Post(
 *     path="/api/logout",
 *     summary="Cerrar sesión (invalidar token JWT)",
 *     tags={"Autenticación"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Sesión cerrada correctamente",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Sesión cerrada correctamente")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Token no válido o ya invalidado"
 *     )
 * )
 */

public function logout()
{
    try {
        if (! $token = JWTAuth::getToken()) {
            return response()->json(['message' => 'Token no encontrado.'], 401);
        }

        JWTAuth::invalidate($token); // agrega el token a la blacklist
        return response()->json(['message' => 'Sesión cerrada correctamente'], 200);

    } catch (JWTException $e) {
        // token inválido, expirado o ya invalidado
        return response()->json(['message' => 'Token inválido o expirado.'], 401);
    }
}
    
    public function createRol(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre_rol' => 'required|string|max:100|unique:rols,nombre_rol',
        ], [
            'nombre_rol.required' => 'El nombre del rol es obligatorio.',
            'nombre_rol.string'   => 'El nombre debe ser texto.',
            'nombre_rol.max'      => 'El nombre no puede superar los 100 caracteres.',
            'nombre_rol.unique'   => 'Ya existe un rol con ese nombre.',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
            ], 422);
        }
        
        $rol = Rol::create($validator->validated());
        
        return response()->json([
            'success' => true,
            'message' => 'Rol creado correctamente',
            'data'    => $rol,
        ], 201);
    }
}

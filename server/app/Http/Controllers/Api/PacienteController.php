<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Paciente;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Tag(
 *     name="Pacientes",
 *     description="Operaciones relacionadas con pacientes"
 * )
 */
class PacienteController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/pacientes",
     *     summary="Obtener todos los pacientes",
     *     tags={"Pacientes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Pacientes encontrados correctamente"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontraron tratamientos"
     *     )
     * )
     */
    public function getPacientes()
    {
        $pacientes = Paciente::all();

        if($pacientes->isEmpty()){
            return response()->json([
                'message'=>'No se encontraron tratamientos',
                'success' => false,
            ],404);
        }
        return response()->json([
            'message'  => 'Pacientes encontrados correctamente',
            'data' => $pacientes,
            'success' => true
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/api/pacientes",
     *     summary="Crear un nuevo paciente",
     *     tags={"Pacientes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"dni_paciente", "nombre", "apellido", "email", "telefono", "obra_social"},
     *             @OA\Property(property="dni_paciente", type="string", example="12345678"),
     *             @OA\Property(property="nombre", type="string", example="Juan"),
     *             @OA\Property(property="apellido", type="string", example="Pérez"),
     *             @OA\Property(property="email", type="string", format="email", example="juan@example.com"),
     *             @OA\Property(property="telefono", type="string", example="123456789"),
     *             @OA\Property(property="obra_social", type="string", example="OSDE")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Paciente creado correctamente"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error en la validación de datos"
     *     )
     * )
     */
    public function createPaciente(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'dni_paciente' => 'required|string|max:20|unique:pacientes,dni_paciente',
            'nombre'       => 'required|string|max:100',
            'apellido'     => 'required|string|max:100',
            'email'        => 'required|email|unique:pacientes,email',
            'telefono'     => 'required|string|max:20',
            'obra_social'  => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
                'success' => 'false',
            ], 422);
        }

        $paciente = Paciente::create($validator->validated());

        return response()->json([
            'message'  => 'Paciente creado correctamente',
            'data' => $paciente,
            'success' => true
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/pacientes/{id}",
     *     summary="Obtener un paciente por ID",
     *     tags={"Pacientes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del paciente",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Paciente encontrado correctamente"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Paciente no encontrado"
     *     )
     * )
     */
    public function getPacienteById($id)
    {
        $paciente = Paciente::find($id);

        if (!$paciente) {
            return response()->json(['message' => 'Paciente no encontrado','success' => 'false'], 404);
        }

        return response()->json([
            'message'  => 'Paciente encontrado correctamente',
            'data' => $paciente,
            'success' => true,
        ],200);
    }

    /**
     * @OA\Put(
     *     path="/api/pacientes/{id}",
     *     summary="Actualizar un paciente",
     *     tags={"Pacientes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del paciente",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="dni_paciente", type="string", example="12345678"),
     *             @OA\Property(property="nombre", type="string", example="Juan"),
     *             @OA\Property(property="apellido", type="string", example="Pérez"),
     *             @OA\Property(property="email", type="string", format="email", example="juan@example.com"),
     *             @OA\Property(property="telefono", type="string", example="123456789"),
     *             @OA\Property(property="obra_social", type="string", example="OSDE")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Paciente actualizado correctamente"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Paciente no encontrado"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error en la validación de datos"
     *     )
     * )
     */
    public function updatePaciente(Request $request, $id)
    {
        $paciente = Paciente::find($id);
        if (! $paciente) {
            return response()->json(['message' => 'Paciente no encontrado','success' => 'false'], 404);
        }

        $rules = [
            'dni_paciente' => 'sometimes|required|string|max:20|unique:pacientes,dni_paciente,'.$paciente->id,
            'nombre'       => 'sometimes|required|string|max:100',
            'apellido'     => 'sometimes|required|string|max:100',
            'email'        => 'sometimes|required|email|unique:pacientes,email,'.$paciente->id,
            'telefono'     => 'sometimes|required|string|max:20',
            'obra_social'  => 'sometimes|required|string|max:100',
        ];

        $messages = [
            'dni_paciente.required' => 'El DNI del paciente es obligatorio.',
            'dni_paciente.unique'   => 'Ya existe un paciente con este DNI.',
            'nombre.required'       => 'El nombre es obligatorio.',
            'apellido.required'     => 'El apellido es obligatorio.',
            'email.required'        => 'El email es obligatorio.',
            'email.email'           => 'El email debe tener un formato válido.',
            'email.unique'          => 'Ya existe un paciente con este email.',
            'telefono.required'     => 'El teléfono es obligatorio.',
            'obra_social.required'  => 'La obra social es obligatoria.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
                'success' => 'false',
            ], 422);
        }

        $paciente->update($validator->validated());

        return response()->json([
            'message'  => 'Paciente actualizado correctamente',
            'data' => $paciente,
            'success' => true,
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/pacientes/{id}",
     *     summary="Eliminar un paciente",
     *     tags={"Pacientes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del paciente",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Paciente eliminado exitosamente"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Paciente no encontrado"
     *     )
     * )
     */
    public function deletePaciente($id)
    {
        $paciente = Paciente::find($id);

        if (!$paciente) {
            return response()->json(['message' => 'Paciente no encontrado', 'success' => 'false'], 404);
        }

        $paciente->delete();

        return response()->json([
            'message' => 'Paciente eliminado exitosamente',
            'success' => true,
        ], 200);
    }
}

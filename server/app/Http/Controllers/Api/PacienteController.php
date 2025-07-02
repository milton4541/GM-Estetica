<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Paciente;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
class PacienteController extends Controller
{
    // Mostrar todos los pacientes
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
        ], 201);    }

    // Crear un nuevo paciente
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

    // Mostrar un paciente específico
    public function getPacienteById($id)
    {
        $paciente = Paciente::find($id);

        if (!$paciente) {
            return response()->json(['message' => 'Paciente no encontrado','success' => false], 404);
        }

        return response()->json([
            'message'  => 'Paciente encontrado correctamente',
            'data' => $paciente,
            'success' => true,
        ],200);
    }

    //actualizar un paciente
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

    // Eliminar un paciente
    public function deletePaciente($id)
    {
        $paciente = Paciente::find($id);

        if (!$paciente) {
            return response()->json(['message' => 'Paciente no encontrado', 'success' => false], 404);
        }

        $paciente->delete();

        return response()->json([
            'message' => 'Paciente eliminado exitosamente',
            'success' => true,
        ], 200);
    }
}

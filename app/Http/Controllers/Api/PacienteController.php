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
    public function index()
    {
        $pacientes = Paciente::all();

        if($pacientes->isEmpty()){
            $data = [
                'message'=> 'No se encontraron pacientes',
                'status'=> '404'
            ];
            return response()->json($data,404);
        }
        return response()->json($pacientes,200);
    }

    // Crear un nuevo paciente
     public function store(Request $request): JsonResponse
    {
        // 1. Definimos reglas y mensajes
        $validator = Validator::make($request->all(), [
            'dni_paciente' => 'required|string|max:20|unique:pacientes,dni_paciente',
            'nombre'       => 'required|string|max:100',
            'apellido'     => 'required|string|max:100',
            'email'        => 'required|email|unique:pacientes,email',
            'telefono'     => 'required|string|max:20',
            'obra_social'  => 'required|string|max:100',
        ], [
            'dni_paciente.required' => 'El DNI del paciente es obligatorio.',
            'dni_paciente.unique'   => 'Ya existe un paciente con este DNI.',
            'nombre.required'       => 'El nombre es obligatorio.',
            'apellido.required'     => 'El apellido es obligatorio.',
            'email.required'        => 'El email es obligatorio.',
            'email.email'           => 'El email debe tener un formato válido.',
            'email.unique'          => 'Ya existe un paciente con este email.',
            'telefono.required'     => 'El teléfono es obligatorio.',
            'obra_social.required'  => 'La obra social es obligatoria.',
        ]);

        // 2. Si falla validación, devolvemos 422 con los errores
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // 3. Creamos el paciente con los datos validados
        $paciente = Paciente::create($validator->validated());

        // 4. Respondemos con 201 y el recurso creado
        return response()->json([
            'message'  => 'Paciente creado correctamente',
            'paciente' => $paciente,
        ], 201);
    }

    // Mostrar un paciente específico
    public function show($id)
    {
        $paciente = Paciente::find($id);

        if (!$paciente) {
            return response()->json(['message' => 'Paciente no encontrado'], 404);
        }

        return response()->json([
            'paciente' => $paciente,
        ]);
    }

    // Actualizar un paciente existente
    public function update(Request $request, $id)
    {
        $paciente = Paciente::find($id);

        if (!$paciente) {
            return response()->json(['message' => 'Paciente no encontrado'], 404);
        }

        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'apellido' => 'sometimes|required|string|max:255',
            'dni' => 'sometimes|required|string|max:20|unique:pacientes,dni,'.$paciente->id,
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:50',
            'direccion' => 'nullable|string|max:255',
        ]);

        $paciente->update($validated);

        return response()->json([
            'message' => 'Paciente actualizado exitosamente',
            'paciente' => $paciente,
        ]);
    }

    // Eliminar un paciente
    public function destroy($id)
    {
        $paciente = Paciente::find($id);

        if (!$paciente) {
            return response()->json(['message' => 'Paciente no encontrado'], 404);
        }

        $paciente->delete();

        return response()->json([
            'message' => 'Paciente eliminado exitosamente',
        ]);
    }
}

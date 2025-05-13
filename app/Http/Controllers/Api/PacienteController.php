<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Paciente;

class PacienteController extends Controller
{
    // Mostrar todos los pacientes
    public function index()
    {
        $pacientes = Paciente::all();

        return response()->json([
            'pacientes' => $pacientes,
        ]);
    }

    // Crear un nuevo paciente
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'required|string|max:20|unique:pacientes',
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:50',
            'direccion' => 'nullable|string|max:255',
        ]);

        $paciente = Paciente::create($validated);

        return response()->json([
            'message' => 'Paciente creado exitosamente',
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

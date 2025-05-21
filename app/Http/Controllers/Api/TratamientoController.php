<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tratamiento;
use App\Models\Paciente;

class TratamientoController extends Controller
{
    // Listar todas las consultas
    public function index()
    {
        $consultas = Tratamiento::with('paciente')->get();

        return response()->json([
            'consultas' => $consultas,
        ]);
    }

    // Crear una nueva consulta
    public function store(Request $request)
    {
        $validated = $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'fecha' => 'required|date',
            'motivo' => 'required|string|max:255',
            'diagnostico' => 'nullable|string',
            'tratamiento' => 'nullable|string',
        ]);

        $consulta = Tratamiento::create($validated);

        return response()->json([
            'message' => 'Consulta creada exitosamente',
            'consulta' => $consulta,
        ], 201);
    }

    // Mostrar una consulta específica
    public function show($id)
    {
        $consulta = Tratamiento::with('paciente')->find($id);

        if (!$consulta) {
            return response()->json(['message' => 'Consulta no encontrada'], 404);
        }

        return response()->json([
            'consulta' => $consulta,
        ]);
    }

    // Actualizar una consulta existente
    public function update(Request $request, $id)
    {
        $consulta = Tratamiento::find($id);

        if (!$consulta) {
            return response()->json(['message' => 'Consulta no encontrada'], 404);
        }

        $validated = $request->validate([
            'fecha' => 'sometimes|required|date',
            'motivo' => 'sometimes|required|string|max:255',
            'diagnostico' => 'nullable|string',
            'tratamiento' => 'nullable|string',
        ]);

        $consulta->update($validated);

        return response()->json([
            'message' => 'Consulta actualizada exitosamente',
            'consulta' => $consulta,
        ]);
    }

    // Eliminar una consulta
    public function destroy($id)
    {
        $consulta = Tratamiento::find($id);

        if (!$consulta) {
            return response()->json(['message' => 'Consulta no encontrada'], 404);
        }

        $consulta->delete();

        return response()->json([
            'message' => 'Consulta eliminada exitosamente',
        ]);
    }

    // Listar consultas de un paciente específico
    public function consultasPorPaciente($pacienteId)
    {
    $consultas = Tratamiento::where('paciente_id', $pacienteId)->get();

    if ($consultas->isEmpty()) {
        return response()->json(['message' => 'No se encontraron consultas para este paciente'], 404);
    }

    return response()->json([
        'consultas' => $consultas,
    ]);
    }
}

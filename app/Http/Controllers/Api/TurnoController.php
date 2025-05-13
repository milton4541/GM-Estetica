<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Turno;

class TurnoController extends Controller
{
    // Listar todos los turnos
    public function index()
    {
        $turnos = Turno::with('paciente')->get();

        return response()->json([
            'turnos' => $turnos,
        ]);
    }

    // Crear nuevo turno
    public function store(Request $request)
    {
        $validated = $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'fecha_turno' => 'required|date',
            'hora_turno' => 'required|date_format:H:i',
            'estado' => 'required|in:pendiente,confirmado,cancelado',
            'observaciones' => 'nullable|string',
        ]);
    
        // Verificar si ya existe un turno para ese paciente en esa fecha y hora
        $existeTurno = Turno::where('paciente_id', $validated['paciente_id'])
            ->where('fecha_turno', $validated['fecha_turno'])
            ->where('hora_turno', $validated['hora_turno'])
            ->exists();
    
        if ($existeTurno) {
            return response()->json([
                'message' => 'El paciente ya tiene un turno asignado en esa fecha y hora.'
            ], 422);
        }
    
        $turno = Turno::create($validated);
    
        return response()->json([
            'message' => 'Turno creado exitosamente',
            'turno' => $turno,
        ], 201);
    }

    // Mostrar turno específico
    public function show($id)
    {
        $turno = Turno::with('paciente')->find($id);

        if (!$turno) {
            return response()->json(['message' => 'Turno no encontrado'], 404);
        }

        return response()->json([
            'turno' => $turno,
        ]);
    }

    // Actualizar turno
    public function update(Request $request, $id)
    {
        $turno = Turno::find($id);

        if (!$turno) {
            return response()->json(['message' => 'Turno no encontrado'], 404);
        }

        $validated = $request->validate([
            'fecha_turno' => 'sometimes|required|date',
            'hora_turno' => 'sometimes|required|date_format:H:i',
            'estado' => 'sometimes|required|in:pendiente,confirmado,cancelado',
            'observaciones' => 'nullable|string',
        ]);

        $turno->update($validated);

        return response()->json([
            'message' => 'Turno actualizado exitosamente',
            'turno' => $turno,
        ]);
    }

    // Eliminar turno
    public function destroy($id)
    {
        $turno = Turno::find($id);

        if (!$turno) {
            return response()->json(['message' => 'Turno no encontrado'], 404);
        }

        $turno->delete();

        return response()->json([
            'message' => 'Turno eliminado exitosamente',
        ]);
    }
}

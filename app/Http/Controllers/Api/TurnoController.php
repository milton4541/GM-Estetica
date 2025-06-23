<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Turno;
use App\Models\Historial;
use Validator;

class TurnoController extends Controller
{
    public function getTurnos(): JsonResponse
    {
        $turnos = Turno::with(['tratamiento', 'paciente'])->get();

        $data = $turnos->map(function($turno) {
            return [
                'id_turno'    => $turno->id_turno,
                'fecha'       => $turno->fecha,
                'hora'        => $turno->hora,
                'tratamiento' => [
                    'id_tratamiento' => $turno->tratamiento->id_tratamiento,
                    'descripcion'    => $turno->tratamiento->descripcion,
                    'duracion'       => $turno->tratamiento->duracion,
                    'precio'         => $turno->tratamiento->precio,
                ],
                'paciente' => [
                    'id_paciente'     => $turno->paciente->id_paciente,
                    'nombre'          => $turno->paciente->nombre,
                    'apellido'        => $turno->paciente->apellido,
                    'dni'             => $turno->paciente->dni_paciente,
                    'email'           => $turno->paciente->email,
                    'telefono'        => $turno->paciente->telefono,
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
            'message' => 'Listado de turnos obtenido exitosamente',
        ], 200);
    }
    public function getTurnoById(Request $request, $id){
        $turno = Turno::with(['tratamiento', 'paciente'])->find($id);
        if (! $turno) {
            return response()->json([
                'success' => false,
                'message' => 'Turno no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'id_turno'     => $turno->id_turno,
                'fecha'        => $turno->fecha,
                'hora'         => $turno->hora,
                'tratamiento'  => [
                    'id_tratamiento' => $turno->tratamiento->id_tratamiento,
                    'descripcion'    => $turno->tratamiento->descripcion,
                    'duracion'       => $turno->tratamiento->duracion,
                    'precio'         => $turno->tratamiento->precio,
                ],
                'paciente'     => [
                    'id_paciente' => $turno->paciente->id_paciente,
                    'nombre'      => $turno->paciente->nombre,
                    'apellido'    => $turno->paciente->apellido,
                    'dni'         => $turno->paciente->dni_paciente,
                    'email'       => $turno->paciente->email,
                    'telefono'    => $turno->paciente->telefono,
                    'obra_social' => $turno->paciente->obra_social,
                ],
            ],
            'message' => 'Turno obtenido exitosamente',
        ], 200);
    }
    public function createTurno(Request $request): JsonResponse
{
    $validator = Validator::make($request->all(), [
        'fecha'          => 'required|date_format:d/m/Y',
        'hora'           => 'required|date_format:H:i',
        'id_tratamiento' => 'required|integer|exists:tratamientos,id_tratamiento',
        'id_paciente'    => 'required|integer|exists:pacientes,id_paciente',
    ], [
        'fecha.required'          => 'La fecha es obligatoria.',
        'fecha.date'              => 'La fecha debe tener formato válido (DD-MM-YYYY).',
        'hora.required'           => 'La hora es obligatoria.',
        'hora.date_format'        => 'La hora debe tener formato HH:MM.',
        'id_tratamiento.required' => 'El ID del tratamiento es obligatorio.',
        'id_tratamiento.exists'   => 'El tratamiento no existe.',
        'id_paciente.required'    => 'El ID del paciente es obligatorio.',
        'id_paciente.exists'      => 'El paciente no existe.',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Error en la validación de datos',
            'errors'  => $validator->errors(),
        ], 422);
    }
    $data = $validator->validated();
    $data['fecha'] = Carbon::createFromFormat('d/m/Y', $data['fecha'])->format('Y-m-d');
    $turno = Turno::create($data);
    Historial::create([
        'id_paciente'    => $turno->id_paciente,
        'id_tratamiento' => $turno->id_tratamiento,
        'fecha'          => $turno->fecha,
        // puedes poner un mensaje genérico o dejar observaciones vacías
        'observaciones'  => 'Turno agendado para ' . $turno->fecha . ' a las ' . $turno->hora,
    ]);
    return response()->json([
        'success' => true,
        'data'    => $turno,
        'message' => 'Turno creado correctamente',
    ], 201);
}
public function updateTurno(Request $request, $id): JsonResponse
{
    $turno = Turno::find($id);
    if (! $turno) {
        return response()->json(['success'=>false,'message'=>'Turno no encontrado'], 404);
    }

    $rules = [
        'fecha'          => 'sometimes|required|date_format:d/m/Y',
        'hora'           => 'sometimes|required|date_format:H:i',
        'id_tratamiento' => 'sometimes|required|integer|exists:tratamientos,id_tratamiento',
        'id_paciente'    => 'sometimes|required|integer|exists:pacientes,id_paciente',
    ];
    $messages = [
        'fecha.required'          => 'La fecha es obligatoria.',
        'fecha.date_format'    => 'La fecha debe tener el formato dd/mm/aaaa.',
        'hora.required'           => 'La hora es obligatoria.',
        'hora.date_format'        => 'La hora debe tener formato HH:MM.',
        'id_tratamiento.required' => 'El ID del tratamiento es obligatorio.',
        'id_tratamiento.exists'   => 'El tratamiento no existe.',
        'id_paciente.required'    => 'El ID del paciente es obligatorio.',
        'id_paciente.exists'      => 'El paciente no existe.',
    ];

    $validator = Validator::make($request->all(), $rules, $messages);
    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Error en la validación de datos',
            'errors'  => $validator->errors(),
        ], 422);
    }

    $data = $validator->validated();

    if (isset($data['fecha'])) {
        $data['fecha'] = Carbon::createFromFormat('d/m/Y', $data['fecha'])->format('Y-m-d');
    }

    $turno->update($data);

    return response()->json([
        'success' => true,
        'data'    => $turno,
        'message' => 'Turno actualizado correctamente',
    ], 200);
}
public function deleteTurno($id): JsonResponse
{
    $turno = Turno::find($id);
    if (! $turno) {
        return response()->json(['success'=>false,'message'=>'Turno no encontrado'], 404);
    }

    $turno->delete();

    return response()->json([
        'success' => true,
        'message' => 'Turno eliminado correctamente',
    ], 200);
}
}


<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Turno;
use App\Models\Historial;
use App\Models\Tratamiento;
use Validator;

/**
 * @OA\Tag(
 *     name="Turnos",
 *     description="Operaciones relacionadas con turnos"
 * )
 */
class TurnoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/turnos",
     *     summary="Obtener todos los turnos",
     *     tags={"Turnos"},
     *     @OA\Response(
     *         response=200,
     *         description="Listado de turnos obtenido exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Listado de turnos obtenido exitosamente"),
     *             @OA\Property(property="data", type="array")
     *         )
     *     ),
     *     @OA\Response(response=404, description="No se encontraron turnos")
     * )
     */
    public function getTurnos(): JsonResponse
    {
        $turnos = Turno::with(['tratamiento', 'paciente'])->get();

        if ($turnos->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontraron turnos',
            ], 404);
        }

        $data = $turnos->map(fn($turno) => $this->mapTurno($turno));

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Listado de turnos obtenido exitosamente',
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/turnos/{id}",
     *     summary="Obtener un turno por su ID",
     *     tags={"Turnos"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del turno",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Turno obtenido exitosamente"),
     *     @OA\Response(response=404, description="Turno no encontrado")
     * )
     */
    public function getTurnoById($id): JsonResponse
    {
        $turno = Turno::with(['tratamiento', 'paciente'])->find($id);

        if (!$turno) {
            return response()->json([
                'success' => false,
                'message' => 'Turno no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->mapTurno($turno),
            'message' => 'Turno obtenido exitosamente',
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/turnos",
     *     summary="Crear uno o más turnos para un paciente",
     *     tags={"Turnos"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"fecha","hora","id_tratamiento","id_paciente"},
     *             @OA\Property(property="fecha", type="string", format="date", example="02/07/2025"),
     *             @OA\Property(property="hora", type="string", example="15:30"),
     *             @OA\Property(
     *                 property="id_tratamiento",
     *                 type="array",
     *                 @OA\Items(type="integer", example=1)
     *             ),
     *             @OA\Property(property="id_paciente", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Turnos creados correctamente"),
     *     @OA\Response(response=422, description="Error en la validación de datos")
     * )
     */
    public function createTurno(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'fecha' => 'required|date_format:d/m/Y',
            'hora' => 'required|date_format:H:i',
            'id_tratamiento' => 'required|array|min:1',
            'id_tratamiento.*' => 'integer|exists:tratamientos,id_tratamiento',
            'id_paciente' => 'required|integer|exists:pacientes,id_paciente',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['fecha'] = Carbon::createFromFormat('d/m/Y', $data['fecha'])->format('Y-m-d');
        $hora = Carbon::createFromFormat('H:i', $data['hora']);
        $turnosCreados = collect();

        foreach ($data['id_tratamiento'] as $id_tratamiento) {
            $tratamiento = Tratamiento::findOrFail($id_tratamiento);

            $turno = Turno::create([
                'fecha' => $data['fecha'],
                'hora' => $hora->format('H:i'),
                'id_paciente' => $data['id_paciente'],
                'id_tratamiento' => $id_tratamiento,
                'finalizado' => false,
            ]);

            $turnosCreados->push($this->mapTurno($turno->load(['tratamiento', 'paciente'])));
            $hora->addMinutes((int)$tratamiento->duracion);
        }

        return response()->json([
            'success' => true,
            'data' => $turnosCreados,
            'message' => 'Turnos creados correctamente',
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/turnos/{id}",
     *     summary="Actualizar un turno",
     *     tags={"Turnos"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del turno",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="fecha", type="string", format="date", example="02/07/2025"),
     *             @OA\Property(property="hora", type="string", example="16:00"),
     *             @OA\Property(property="id_tratamiento", type="integer", example=2),
     *             @OA\Property(property="id_paciente", type="integer", example=3)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Turno actualizado correctamente"),
     *     @OA\Response(response=404, description="Turno no encontrado"),
     *     @OA\Response(response=422, description="Error en la validación de datos")
     * )
     */
    public function updateTurno(Request $request, $id): JsonResponse
    {
        $turno = Turno::find($id);
        if (!$turno) {
            return response()->json([
                'success' => false,
                'message' => 'Turno no encontrado',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'fecha' => 'sometimes|required|date_format:d/m/Y',
            'hora' => 'sometimes|required|date_format:H:i',
            'id_tratamiento' => 'sometimes|required|integer|exists:tratamientos,id_tratamiento',
            'id_paciente' => 'sometimes|required|integer|exists:pacientes,id_paciente',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        if (isset($data['fecha'])) {
            $data['fecha'] = Carbon::createFromFormat('d/m/Y', $data['fecha'])->format('Y-m-d');
        }

        $turno->update($data);

        return response()->json([
            'success' => true,
            'data' => $this->mapTurno($turno->load(['tratamiento', 'paciente'])),
            'message' => 'Turno actualizado correctamente',
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/turnos/{id}",
     *     summary="Eliminar un turno",
     *     tags={"Turnos"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del turno",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Turno eliminado correctamente"),
     *     @OA\Response(response=404, description="Turno no encontrado")
     * )
     */
    public function deleteTurno($id): JsonResponse
    {
        $turno = Turno::find($id);
        if (!$turno) {
            return response()->json([
                'success' => false,
                'message' => 'Turno no encontrado',
            ], 404);
        }

        $turno->delete();

        return response()->json([
            'success' => true,
            'message' => 'Turno eliminado correctamente',
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/turnos/{id}/finalizar",
     *     summary="Finalizar un turno",
     *     tags={"Turnos"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del turno",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Turno finalizado correctamente"),
     *     @OA\Response(response=404, description="Turno no encontrado")
     * )
     */
    public function finalizarTurno($id): JsonResponse
    {
        $turno = Turno::find($id);
        if (!$turno) {
            return response()->json([
                'success' => false,
                'message' => 'Turno no encontrado',
            ], 404);
        }

        $turno->finalizado = true;
        $turno->save();

        Historial::create([
            'id_paciente' => $turno->id_paciente,
            'id_tratamiento' => $turno->id_tratamiento,
            'fecha' => $turno->fecha,
            'observaciones' => 'Turno finalizado el ' . $turno->fecha . ' a las ' . $turno->hora,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Turno finalizado correctamente',
        ], 200);
    }

    /**
     * Mapea un turno a la estructura que espera el frontend
     */
    private function mapTurno(Turno $turno): array
    {
        return [
            'id_turno' => $turno->id_turno,
            'fecha' => $turno->fecha,
            'hora' => $turno->hora,
            'tratamiento' => [
                'id_tratamiento' => $turno->tratamiento->id_tratamiento,
                'descripcion' => $turno->tratamiento->descripcion,
                'duracion' => $turno->tratamiento->duracion,
                'precio' => $turno->tratamiento->precio,
            ],
            'paciente' => [
                'id_paciente' => $turno->paciente->id_paciente,
                'nombre' => $turno->paciente->nombre,
                'apellido' => $turno->paciente->apellido,
                'dni' => $turno->paciente->dni_paciente,
                'email' => $turno->paciente->email,
                'telefono' => $turno->paciente->telefono,
                'obra_social' => $turno->paciente->obra_social ?? null,
            ],
            'finalizado' => $turno->finalizado,
        ];
    }
}

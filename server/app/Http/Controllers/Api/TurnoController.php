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
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id_turno", type="integer", example=1),
     *                     @OA\Property(property="fecha", type="string", format="date", example="2025-07-02"),
     *                     @OA\Property(property="hora", type="string", example="15:30"),
     *                     @OA\Property(
     *                         property="tratamiento",
     *                         type="object",
     *                         @OA\Property(property="id_tratamiento", type="integer", example=1),
     *                         @OA\Property(property="descripcion", type="string", example="Limpieza facial"),
     *                         @OA\Property(property="duracion", type="integer", example=45),
     *                         @OA\Property(property="precio", type="number", format="float", example=1200.50),
     *                     ),
     *                     @OA\Property(
     *                         property="paciente",
     *                         type="object",
     *                         @OA\Property(property="id_paciente", type="integer", example=2),
     *                         @OA\Property(property="nombre", type="string", example="Juan"),
     *                         @OA\Property(property="apellido", type="string", example="Perez"),
     *                         @OA\Property(property="dni", type="string", example="12345678"),
     *                         @OA\Property(property="email", type="string", example="juan.perez@mail.com"),
     *                         @OA\Property(property="telefono", type="string", example="1234567890"),
     *                     ),
     *                 )
     *             )
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

        $data = $turnos->map(function ($turno) {
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
                    'id_paciente' => $turno->paciente->id_paciente,
                    'nombre'      => $turno->paciente->nombre,
                    'apellido'    => $turno->paciente->apellido,
                    'dni'         => $turno->paciente->dni_paciente,
                    'email'       => $turno->paciente->email,
                    'telefono'    => $turno->paciente->telefono,
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
            'message' => 'Listado de turnos obtenido exitosamente',
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/turnos/{id}",
     *     summary="Obtener un turno por ID",
     *     tags={"Turnos"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID del turno",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Turno obtenido exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Turno obtenido exitosamente"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id_turno", type="integer", example=1),
     *                 @OA\Property(property="fecha", type="string", format="date", example="2025-07-02"),
     *                 @OA\Property(property="hora", type="string", example="15:30"),
     *                 @OA\Property(
     *                     property="tratamiento",
     *                     type="object",
     *                     @OA\Property(property="id_tratamiento", type="integer", example=1),
     *                     @OA\Property(property="descripcion", type="string", example="Limpieza facial"),
     *                     @OA\Property(property="duracion", type="integer", example=45),
     *                     @OA\Property(property="precio", type="number", format="float", example=1200.50),
     *                 ),
     *                 @OA\Property(
     *                     property="paciente",
     *                     type="object",
     *                     @OA\Property(property="id_paciente", type="integer", example=2),
     *                     @OA\Property(property="nombre", type="string", example="Juan"),
     *                     @OA\Property(property="apellido", type="string", example="Perez"),
     *                     @OA\Property(property="dni", type="string", example="12345678"),
     *                     @OA\Property(property="email", type="string", example="juan.perez@mail.com"),
     *                     @OA\Property(property="telefono", type="string", example="1234567890"),
     *                     @OA\Property(property="obra_social", type="string", example="OSDE"),
     *                 ),
     *             ),
     *         )
     *     ),
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
            'data'    => [
                'id_turno'   => $turno->id_turno,
                'fecha'      => $turno->fecha,
                'hora'       => $turno->hora,
                'tratamiento'=> [
                    'id_tratamiento' => $turno->tratamiento->id_tratamiento,
                    'descripcion'    => $turno->tratamiento->descripcion,
                    'duracion'       => $turno->tratamiento->duracion,
                    'precio'         => $turno->tratamiento->precio,
                ],
                'paciente' => [
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

    /**
 * @OA\Post(
 *     path="/api/turnos",
 *     summary="Crear uno o más turnos para un paciente",
 *     description="Crea múltiples turnos para un mismo paciente en una fecha, a partir de un array de tratamientos. La hora se ajusta automáticamente según la duración de cada tratamiento.",
 *     tags={"Turnos"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"fecha","hora","id_tratamiento","id_paciente"},
 *             @OA\Property(property="fecha", type="string", format="date", example="02/07/2025", description="Formato: dd/mm/yyyy"),
 *             @OA\Property(property="hora", type="string", example="15:30", description="Hora inicial del primer turno"),
 *             @OA\Property(
 *                 property="id_tratamiento",
 *                 type="array",
 *                 @OA\Items(type="integer", example=1),
 *                 description="Array de IDs de tratamientos a agendar en orden"
 *             ),
 *             @OA\Property(property="id_paciente", type="integer", example=2)
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Turnos creados correctamente",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Turnos creados correctamente"),
 *             @OA\Property(
 *                 property="data",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                     @OA\Property(property="id_turno", type="integer", example=10),
 *                     @OA\Property(property="fecha", type="string", format="date", example="2025-07-02"),
 *                     @OA\Property(property="hora", type="string", example="15:30"),
 *                     @OA\Property(property="id_tratamiento", type="integer", example=1),
 *                     @OA\Property(property="id_paciente", type="integer", example=2)
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Error en la validación de datos"
 *     )
 * )
 */

    public function createTurno(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'fecha'          => 'required|date_format:d/m/Y',
            'hora'           => 'required|date_format:H:i',
            'id_tratamiento'   => 'required|array|min:1',
            'id_tratamiento.*' => 'integer|exists:tratamientos,id_tratamiento',
            'id_paciente'    => 'required|integer|exists:pacientes,id_paciente',
        ], [
            'fecha.required'          => 'La fecha es obligatoria.',
            'fecha.date_format'       => 'La fecha debe tener formato dd/mm/aaaa.',
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

        $hora = Carbon::createFromFormat('H:i', $data['hora']);
        $turnos = [];
        foreach ($data['id_tratamiento'] as $tratamientoId) {
            $tratamiento = Tratamiento::findOrFail($tratamientoId);
            
            $turno = Turno::create([
                'fecha' => $data['fecha'],
                'hora' => $hora->format('H:i'),
                'id_paciente' => $data['id_paciente'],
                'id_tratamiento' => $tratamiento->id_tratamiento,
            ]);
            
            Historial::create([
                'id_paciente' => $turno->id_paciente,
                'id_tratamiento' => $turno->id_tratamiento,
                'fecha' => $turno->fecha,
                'observaciones' => 'Turno agendado para ' . $turno->fecha . ' a las ' . $turno->hora,
            ]);
            
            $turnos[] = $turno;

            $hora->addMinutes($tratamiento->duracion);
        }

        return response()->json([
            'success' => true,
            'data' => $turnos,
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
     *         description="ID del turno a actualizar",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="fecha", type="string", format="date", example="02/07/2025"),
     *             @OA\Property(property="hora", type="string", example="16:00"),
     *             @OA\Property(property="id_tratamiento", type="integer", example=1),
     *             @OA\Property(property="id_paciente", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Turno actualizado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Turno actualizado correctamente"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
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

        $rules = [
            'fecha'          => 'sometimes|required|date_format:d/m/Y',
            'hora'           => 'sometimes|required|date_format:H:i',
            'id_tratamiento' => 'sometimes|required|integer|exists:tratamientos,id_tratamiento',
            'id_paciente'    => 'sometimes|required|integer|exists:pacientes,id_paciente',
        ];

        $messages = [
            'fecha.required'          => 'La fecha es obligatoria.',
            'fecha.date_format'       => 'La fecha debe tener el formato dd/mm/aaaa.',
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

    /**
     * @OA\Delete(
     *     path="/api/turnos/{id}",
     *     summary="Eliminar un turno",
     *     tags={"Turnos"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID del turno a eliminar",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Turno eliminado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Turno eliminado correctamente")
     *         )
     *     ),
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
}

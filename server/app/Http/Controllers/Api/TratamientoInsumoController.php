<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TratamientoInsumo;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Schema(
 *     schema="TratamientoInsumo",
 *     type="object",
 *     title="TratamientoInsumo",
 *     required={"id", "id_tratamiento", "id_insumo"},
 *     @OA\Property(property="id", type="integer", example=1, description="ID de la relación"),
 *     @OA\Property(property="id_tratamiento", type="integer", example=1, description="ID del tratamiento"),
 *     @OA\Property(property="id_insumo", type="integer", example=2, description="ID del insumo"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-07-04T15:00:00Z", description="Fecha de creación"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-07-04T15:00:00Z", description="Fecha de actualización")
 * )
 *
 * @OA\Tag(
 *     name="TratamientoInsumo",
 *     description="Relaciones entre tratamientos e insumos"
 * )
 */
class TratamientoInsumoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/tratamiento-insumo",
     *     summary="Obtener todas las relaciones tratamiento-insumo",
     *     tags={"TratamientoInsumo"},
     *     @OA\Response(
     *         response=200,
     *         description="Relaciones encontradas correctamente",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/TratamientoInsumo"))
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontraron relaciones"
     *     )
     * )
     */
    public function getRelaciones()
    {
        $relaciones = TratamientoInsumo::all();

        if ($relaciones->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron relaciones tratamiento-insumo',
                'success' => false,
            ], 404);
        }

        return response()->json([
            'message' => 'Relaciones encontradas correctamente',
            'data'    => $relaciones,
            'success' => true,
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/tratamiento-insumo",
     *     summary="Crear una relación tratamiento-insumo",
     *     tags={"TratamientoInsumo"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"id_tratamiento","id_insumo"},
     *             @OA\Property(property="id_tratamiento", type="integer", example=1),
     *             @OA\Property(property="id_insumo", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Relación creada correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/TratamientoInsumo")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error en la validación de datos"
     *     )
     * )
     */
    public function createRelacion(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_tratamiento' => 'required|exists:tratamiento,id_tratamiento',
            'id_insumo'      => 'required|exists:insumo,id_insumo',
        ], [
            'id_tratamiento.required' => 'El ID del tratamiento es obligatorio.',
            'id_tratamiento.exists'   => 'El tratamiento no existe.',
            'id_insumo.required'      => 'El ID del insumo es obligatorio.',
            'id_insumo.exists'        => 'El insumo no existe.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
                'success' => false,
            ], 422);
        }

        $relacion = TratamientoInsumo::create($validator->validated());

        return response()->json([
            'message' => 'Relación creada correctamente',
            'data'    => $relacion,
            'success' => true,
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/tratamiento-insumo/{id}",
     *     summary="Obtener una relación tratamiento-insumo por ID",
     *     tags={"TratamientoInsumo"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la relación",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Relación encontrada correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/TratamientoInsumo")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Relación no encontrada"
     *     )
     * )
     */
    public function getRelacionById($id)
    {
        $relacion = TratamientoInsumo::find($id);

        if (!$relacion) {
            return response()->json([
                'message' => 'Relación no encontrada',
                'success' => false,
            ], 404);
        }

        return response()->json([
            'message' => 'Relación encontrada correctamente',
            'data'    => $relacion,
            'success' => true,
        ], 200);
    }

    /**
     * @OA\Put(
     *     path="/api/tratamiento-insumo/{id}",
     *     summary="Actualizar una relación tratamiento-insumo",
     *     tags={"TratamientoInsumo"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la relación a actualizar",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id_tratamiento", type="integer", example=1),
     *             @OA\Property(property="id_insumo", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Relación actualizada correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/TratamientoInsumo")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Relación no encontrada"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error en la validación de datos"
     *     )
     * )
     */
    public function updateRelacion(Request $request, $id)
    {
        $relacion = TratamientoInsumo::find($id);

        if (!$relacion) {
            return response()->json([
                'message' => 'Relación no encontrada',
                'success' => false,
            ], 404);
        }

        $rules = [
            'id_tratamiento' => 'sometimes|required|exists:tratamiento,id_tratamiento',
            'id_insumo'      => 'sometimes|required|exists:insumo,id_insumo',
        ];

        $messages = [
            'id_tratamiento.required' => 'El ID del tratamiento es obligatorio.',
            'id_tratamiento.exists'   => 'El tratamiento no existe.',
            'id_insumo.required'      => 'El ID del insumo es obligatorio.',
            'id_insumo.exists'        => 'El insumo no existe.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
                'success' => false,
            ], 422);
        }

        $relacion->update($validator->validated());

        return response()->json([
            'message' => 'Relación actualizada correctamente',
            'data'    => $relacion,
            'success' => true,
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/tratamiento-insumo/{id}",
     *     summary="Eliminar una relación tratamiento-insumo por ID",
     *     tags={"TratamientoInsumo"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la relación a eliminar",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Relación eliminada correctamente"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Relación no encontrada"
     *     )
     * )
     */
    public function deleteRelacion($id)
    {
        $relacion = TratamientoInsumo::find($id);

        if (!$relacion) {
            return response()->json([
                'message' => 'Relación no encontrada',
                'success' => false,
            ], 404);
        }

        $relacion->delete();

        return response()->json([
            'message' => 'Relación eliminada correctamente',
            'success' => true,
        ], 200);
    }
}

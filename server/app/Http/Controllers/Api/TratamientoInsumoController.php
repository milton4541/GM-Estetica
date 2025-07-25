<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tratamiento;
use Illuminate\Http\Request;
use App\Models\TratamientoInsumo;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Schema(
 *     schema="TratamientoInsumo",
 *     type="object",
 *     title="TratamientoInsumo",
 *     required={"id", "id_tratamiento", "id_insumo", "cantidad"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="id_tratamiento", type="integer", example=1),
 *     @OA\Property(property="id_insumo", type="integer", example=2),
 *     @OA\Property(property="cantidad", type="integer", example=3),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-07-04T15:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-07-04T15:00:00Z")
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
     *             required={"id_tratamiento","id_insumo","cantidad"},
     *             @OA\Property(property="id_tratamiento", type="integer", example=1),
     *             @OA\Property(property="id_insumo", type="integer", example=2),
     *             @OA\Property(property="cantidad", type="integer", example=3)
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
            'id_tratamiento' => 'required|exists:tratamientos,id_tratamiento',
            'id_insumo'      => 'required|exists:insumos,id_insumo',
            'cantidad'       => 'required|integer|min:1',
        ], [
            'id_tratamiento.required' => 'El ID del tratamiento es obligatorio.',
            'id_tratamiento.exists'   => 'El tratamiento no existe.',
            'id_insumo.required'      => 'El ID del insumo es obligatorio.',
            'id_insumo.exists'        => 'El insumo no existe.',
            'cantidad.required'       => 'La cantidad es obligatoria.',
            'cantidad.integer'        => 'La cantidad debe ser un número entero.',
            'cantidad.min'            => 'La cantidad debe ser al menos 1.',
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
public function getRelacionById($id_tratamiento)
{
    // Obtiene todas las relaciones para ese tratamiento
    $relaciones = TratamientoInsumo::where('id_tratamiento', $id_tratamiento)->get();

    if ($relaciones->isEmpty()) {
        return response()->json([
            'message' => 'No se encontraron relaciones para el tratamiento ' . $id_tratamiento,
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
     *             @OA\Property(property="id_insumo", type="integer", example=2),
     *             @OA\Property(property="cantidad", type="integer", example=2)
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
   public function updateRelacion(Request $request, $id_tratamiento)
{
    // 1. Validar
    $validator = Validator::make($request->all(), [
        'id_insumo'     => 'required|array|min:1',
        'id_insumo.*'   => 'integer|exists:insumos,id_insumo',
        'cantidad'       => 'required|integer|min:1',
    ], [
        'id_insumo.required'     => 'Debes enviar al menos un insumo.',
        'id_insumo.array'        => 'id_insumo debe ser un arreglo de enteros.',
        'id_insumo.*.integer'    => 'Cada id_insumo debe ser un número entero.',
        'id_insumo.*.exists'     => 'El insumo :input no existe.',
        'cantidad.required'       => 'La cantidad es obligatoria.',
        'cantidad.integer'        => 'La cantidad debe ser un número entero.',
        'cantidad.min'            => 'La cantidad debe ser al menos 1.',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Error en la validación de datos',
            'errors'  => $validator->errors(),
            'success' => false,
        ], 422);
    }

    $data    = $validator->validated();
    $ids     = $data['id_insumo'];
    $cantidad = $data['cantidad'];

    // 2. Borra las relaciones antiguas que ya no están en el array
    TratamientoInsumo::where('id_tratamiento', $id_tratamiento)
        ->whereNotIn('id_insumo', $ids)
        ->delete();

    // 3. Inserta o actualiza (updateOrCreate) las relaciones que sí vienen
    $relaciones = [];
    foreach ($ids as $insumoId) {
        $relaciones[] = TratamientoInsumo::updateOrCreate(
            ['id_tratamiento' => $id_tratamiento, 'id_insumo' => $insumoId],
            ['cantidad'      => $cantidad]
        );
    }

    // 4. Devuelve resultado
    return response()->json([
        'message' => 'Relaciones sincronizadas correctamente',
        'data'    => $relaciones,
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
public function deleteRelacion($id_tratamiento)
{
    $deleted = TratamientoInsumo::where('id_tratamiento', $id_tratamiento)
                 ->delete();

    return response()->json([
        'message' => $deleted
            ? 'Relaciones eliminadas correctamente'
            : 'No había relaciones que eliminar',
        'deleted' => $deleted,
        'success' => true,
    ], 200);
}

//eliminar relacion si se borra el insumo aqui

}

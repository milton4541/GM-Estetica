<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TratamientoInsumo;
use App\Models\Insumo;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Validator;

/**
 * @OA\Tag(
 *     name="Insumos",
 *     description="Operaciones sobre insumos médicos"
 * )
 * 
 * @OA\Schema(
 *     schema="Insumo",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="componentes", type="string", example="Ácido hialurónico"),
 *     @OA\Property(property="precio_insumo", type="number", example=4500.50),
 *     @OA\Property(property="cantidad", type="integer", example=10),
 *     @OA\Property(property="cantidad_min", type="integer", example=5),
 *     @OA\Property(property="nombre", type="string", example="Insumo facial A"),
 *     @OA\Property(property="fecha_expiracion", type="string", example="2025-12-31"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-07-04T12:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-07-04T12:00:00Z"),
 * )
 * 
 * @OA\Schema(
 *     schema="ResponseInsumoList",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="message", type="string", example="Insumos encontrados correctamente"),
 *     @OA\Property(
 *         property="data",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/Insumo")
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="ResponseInsumoSingle",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="message", type="string", example="Insumo encontrado correctamente"),
 *     @OA\Property(property="data", ref="#/components/schemas/Insumo")
 * )
 */
class InsumoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/insumos",
     *     summary="Obtener todos los insumos",
     *     tags={"Insumos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Listado de insumos encontrado correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseInsumoList")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontraron tratamientos",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="No se encontraron tratamientos")
     *         )
     *     )
     * )
     */
    public function getInsumos(Request $request): JsonResponse
    {
        $insumo = Insumo::all();
        if ($insumo->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron Insumos',
                'success' => false,
            ], 404);
        }

        $insumosConAlerta = $insumo->map(function ($insumo) {
            $insumo->alertaBajoStock = ($insumo->cantidad <= $insumo->cantidad_min);
            return $insumo;
        });

        return response()->json([
            'message' => 'Insumos encontrados correctamente',
            'data' => $insumosConAlerta,
            'success' => true,
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/insumos",
     *     summary="Crear un nuevo insumo",
     *     tags={"Insumos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"componentes", "precio_insumo", "cantidad", "nombre", "fecha_expiracion"},
     *             @OA\Property(property="componentes", type="string", example="Ácido hialurónico"),
     *             @OA\Property(property="precio_insumo", type="number", example=4500.50),
     *             @OA\Property(property="cantidad", type="integer", example=10),
     *             @OA\Property(property="nombre", type="string", example="Insumo facial A"),
     *             @OA\Property(property="fecha_expiracion", type="string", example="31/12/2025")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Insumo creado correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseInsumoSingle")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error en la validación de datos",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error en la validación de datos"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function createInsumo(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'componentes'      => 'required|string',
            'precio_insumo'    => 'required|numeric|min:0',
            'cantidad'         => 'required|integer|min:0',
            'nombre'           => 'required|string|max:255',
            'fecha_expiracion' => 'required|date_format:d/m/Y',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['fecha_expiracion'] = Carbon::createFromFormat('d/m/Y', $data['fecha_expiracion'])->format('Y-m-d');

        $insumo = Insumo::create($data);
        return response()->json([
            'success' => true,
            'data'    => $insumo,
            'message' => 'Insumo creado correctamente',
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/insumos/{id}",
     *     summary="Obtener un insumo por ID",
     *     tags={"Insumos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del insumo",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Insumo encontrado correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseInsumoSingle")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Insumo no encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Insumo no encontrado")
     *         )
     *     )
     * )
     */
    public function getInsumoById(Request $request, $id): JsonResponse
    {
        $insumo = Insumo::find($id);
        if (!$insumo) {
            return response()->json(['message' => 'Insumo no encontrado', 'success' => false], 404);
        }
        return response()->json([
            'message' => 'Insumo encontrado correctamente',
            'data' => $insumo,
            'success' => true,
        ], 200);
    }

    /**
     * @OA\Put(
     *     path="/api/insumos/{id}",
     *     summary="Actualizar un insumo",
     *     tags={"Insumos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del insumo a actualizar",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="componentes", type="string", example="Nuevo componente"),
     *             @OA\Property(property="precio_insumo", type="number", example=3000),
     *             @OA\Property(property="cantidad", type="integer", example=5),
     *             @OA\Property(property="nombre", type="string", example="Insumo actualizado"),
     *             @OA\Property(property="fecha_expiracion", type="string", example="01/01/2026")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Insumo actualizado correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseInsumoSingle")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Insumo no encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Insumo no encontrado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error en la validación de datos",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Error en la validación de datos"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function updateInsumo(Request $request, $id): JsonResponse
    {
        $insumo = Insumo::find($id);
        if (!$insumo) {
            return response()->json([
                'success' => false,
                'message' => 'Insumo no encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'componentes'      => 'sometimes|required|string',
            'precio_insumo'    => 'sometimes|required|numeric|min:0',
            'cantidad'         => 'sometimes|required|integer|min:0',
            'nombre'           => 'sometimes|required|string|max:255',
            'fecha_expiracion' => 'sometimes|required|date_format:d/m/Y',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        if (isset($data['fecha_expiracion'])) {
            $data['fecha_expiracion'] = Carbon::createFromFormat('d/m/Y', $data['fecha_expiracion'])->format('Y-m-d');
        }

        $insumo->update($data);

        return response()->json([
            'success' => true,
            'data'    => $insumo,
            'message' => 'Insumo actualizado correctamente',
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/insumos/{id}",
     *     summary="Eliminar un insumo",
     *     tags={"Insumos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del insumo",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Insumo eliminado correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Insumo eliminado correctamente")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Insumo no encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Insumo no encontrado")
     *         )
     *     )
     * )
     */
    public function deleteInsumo(Request $request, $id): JsonResponse
    {
        $insumo = Insumo::find($id);

        if (!$insumo) {
            return response()->json(['message' => 'Insumo no encontrado', 'success' => false], 404);
        }

        $insumo->delete();
        return response()->json([
            'success' => true,
            'message' => 'Insumo eliminado correctamente',
        ], 200);
    }

/**
 * @OA\Put(
 *     path="/api/insumos/actualizar-stock",
 *     summary="Actualizar stock según tratamiento finalizado",
 *     tags={"Insumos"},
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"id_tratamiento", "cantidad"},
 *             @OA\Property(property="id_tratamiento", type="integer", example=1),
 *             @OA\Property(property="cantidad", type="integer", example=2)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Stock actualizado correctamente",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Stock actualizado correctamente")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="No se encontraron insumos relacionados al tratamiento",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string", example="No se encontraron insumos relacionados al tratamiento")
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Error en la validación de datos",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string", example="Error en la validación de datos"),
 *             @OA\Property(
 *                 property="errors",
 *                 type="object",
 *                 example={
 *                     "id_tratamiento": {"El campo id_tratamiento es obligatorio."},
 *                     "cantidad": {"El campo cantidad debe ser un número entero mayor o igual a 1."}
 *                 }
 *             )
 *         )
 *     )
 * )
 */
   public function actualizarStock(Request $request): JsonResponse
{
    // 1. Validación de entrada
    $validator = Validator::make($request->all(), [
        'id_tratamiento' => 'required|exists:tratamientos,id_tratamiento',
        'id_insumo'      => 'required|exists:insumos,id_insumo',
        'cantidad'       => 'required|integer|min:1',  // cuántos tratamientos aplicamos
    ], [
        'id_tratamiento.required' => 'El ID del tratamiento es obligatorio.',
        'id_tratamiento.exists'   => 'El tratamiento no existe.',
        'id_insumo.required'      => 'El ID del insumo es obligatorio.',
        'id_insumo.exists'        => 'El insumo no existe.',
        'cantidad.required'       => 'La cantidad de tratamientos es obligatoria.',
        'cantidad.integer'        => 'La cantidad debe ser un número entero.',
        'cantidad.min'            => 'La cantidad debe ser al menos 1.',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Error en la validación de datos',
            'errors'  => $validator->errors(),
        ], 422);
    }

    $data            = $validator->validated();
    $idTratamiento   = $data['id_tratamiento'];
    $idInsumo        = $data['id_insumo'];
    $cantidad        = $data['cantidad'];

    // 2. Buscamos la relación específica
    $relacion = TratamientoInsumo::where('id_tratamiento', $idTratamiento)
        ->where('id_insumo', $idInsumo)
        ->first();

    if (! $relacion) {
        return response()->json([
            'success' => false,
            'message' => "No existe relación tratamiento‐insumo para tratamiento {$idTratamiento} e insumo {$idInsumo}",
        ], 404);
    }

    $insumo = Insumo::find($idInsumo);
    $stockAnterior = $insumo->cantidad;
    $insumo->cantidad = ( $stockAnterior - $cantidad);
    $insumo->save();

    // 4. Respuesta
    return response()->json([
        'success' => true,
        'message' => 'Stock del insumo actualizado correctamente',
        'data'    => [
            'id_insumo'       => $idInsumo,
            'stock_anterior'  => $stockAnterior,
            'stock_actual'    => $insumo->cantidad,
            'descontado'      => $cantidad,
        ],
    ], 200);

}


 /**
 * @OA\Put(
 *     path="/api/insumos/reestock",
 *     summary="Reabastecer stock de un insumo",
 *     tags={"Insumos"},
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"id_insumo", "cantidad"},
 *             @OA\Property(property="id_insumo", type="integer", example=1),
 *             @OA\Property(property="cantidad", type="integer", example=5)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Stock reabastecido correctamente",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Stock reabastecido correctamente"),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="id_insumo", type="integer", example=1),
 *                 @OA\Property(property="nombre", type="string", example="Guantes de látex"),
 *                 @OA\Property(property="cantidad", type="integer", example=25),
 *                 @OA\Property(property="descripcion", type="string", example="Guantes para uso médico"),
 *                 @OA\Property(property="created_at", type="string", format="date-time", example="2025-07-15T09:00:00Z"),
 *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2025-07-15T10:00:00Z")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Insumo no encontrado",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string", example="Insumo no encontrado")
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Error en la validación de datos",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string", example="Error en la validación de datos"),
 *             @OA\Property(
 *                 property="errors",
 *                 type="object",
 *                 example={
 *                     "id_insumo": {"El campo id_insumo es obligatorio."},
 *                     "cantidad": {"El campo cantidad debe ser un número entero mayor o igual a 1."}
 *                 }
 *             )
 *         )
 *     )
 * )
 */
    public function reestock(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_insumo' => 'required|exists:insumos,id_insumo',
            'cantidad' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors' => $validator->errors()
            ], 422);
        }

        $insumo = Insumo::find($request->id_insumo);

        if (!$insumo) {
            return response()->json([
                'success' => false,
                'message' => 'Insumo no encontrado'
            ], 404);
        }

        $insumo->cantidad += $request->cantidad;
        $insumo->save();

        return response()->json([
            'success' => true,
            'message' => 'Stock reabastecido correctamente',
            'data' => $insumo
        ], 200);
    }
}


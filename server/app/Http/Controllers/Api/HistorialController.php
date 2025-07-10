<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Historial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Historiales",
 *     description="Operaciones sobre historiales clínicos"
 * )
 * 
 * @OA\Schema(
 *     schema="Historial",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="paciente", type="object",
 *         @OA\Property(property="id_paciente", type="integer", example=1),
 *         @OA\Property(property="nombre", type="string", example="Juan"),
 *         @OA\Property(property="apellido", type="string", example="Pérez")
 *     ),
 *     @OA\Property(property="tratamiento", type="object",
 *         @OA\Property(property="id_tratamiento", type="integer", example=1),
 *         @OA\Property(property="nombre", type="string", example="Limpieza facial")
 *     ),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-07-02T12:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-07-02T12:00:00Z")
 * )
 * 
 * @OA\Schema(
 *     schema="ResponseHistorialList",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="message", type="string", example="Historiales encontrados correctamente"),
 *     @OA\Property(
 *         property="data",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/Historial")
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="ResponseHistorialEmpty",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="No se encontraron historiales")
 * )
 */
class HistorialController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/historiales",
     *     summary="Obtener todos los historiales clínicos",
     *     tags={"Historiales"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Historiales encontrados correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseHistorialList")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontraron historiales",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseHistorialEmpty")
     *     )
     * )
     */
    public function getHistorial(): JsonResponse
    {
        $historiales = Historial::with(['paciente', 'tratamiento'])->get();

        if ($historiales->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontraron historiales',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Historiales encontrados correctamente',
            'data' => $historiales,
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/historiales/paciente/{id}",
     *     summary="Obtener historiales por paciente",
     *     tags={"Historiales"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del paciente",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Historiales encontrados correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseHistorialList")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontraron historiales",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseHistorialEmpty")
     *     )
     * )
     */
    public function getHistorialPorPaciente($id): JsonResponse
    {
        $historiales = Historial::with(['paciente', 'tratamiento'])
            ->where('id_paciente', $id)
            ->get();

        if ($historiales->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontraron historiales para el paciente indicado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Historiales encontrados correctamente',
            'data' => $historiales,
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/historiales/tratamiento/{id}",
     *     summary="Obtener historiales por tratamiento",
     *     tags={"Historiales"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID del tratamiento",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Historiales encontrados correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseHistorialList")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontraron historiales",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseHistorialEmpty")
     *     )
     * )
     */
    public function getHistorialPorTratamiento($id): JsonResponse
    {
        $historiales = Historial::with(['paciente', 'tratamiento'])
            ->where('id_tratamiento', $id)
            ->get();

        if ($historiales->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontraron historiales para el tratamiento indicado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Historiales encontrados correctamente',
            'data' => $historiales,
        ], 200);
    }
}

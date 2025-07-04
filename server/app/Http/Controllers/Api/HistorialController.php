<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Historial;

/**
 * @OA\Tag(
 *     name="Historiales",
 *     description="Operaciones sobre historiales de pacientes"
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
     *         description="Listado de historiales",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="paciente", type="object",
     *                         @OA\Property(property="id_paciente", type="integer", example=1),
     *                         @OA\Property(property="nombre", type="string", example="Juan"),
     *                         @OA\Property(property="apellido", type="string", example="Pérez")
     *                     ),
     *                     @OA\Property(property="tratamiento", type="object",
     *                         @OA\Property(property="id_tratamiento", type="integer", example=1),
     *                         @OA\Property(property="nombre", type="string", example="Limpieza facial")
     *                     ),
     *                     @OA\Property(property="created_at", type="string", example="2025-07-02T12:00:00Z"),
     *                     @OA\Property(property="updated_at", type="string", example="2025-07-02T12:00:00Z")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getHistorial(): JsonResponse
    {
        $historiales = Historial::with(['paciente', 'tratamiento'])->get();

        return response()->json([
            'success' => true,
            'data' => $historiales
        ], 200);
    }
}

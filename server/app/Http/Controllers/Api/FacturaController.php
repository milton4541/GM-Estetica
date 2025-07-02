<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Validator;

/**
 * @OA\Tag(
 *     name="Facturas",
 *     description="Operaciones sobre facturas"
 * )
 */
class FacturaController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/facturas",
     *     summary="Obtener todas las facturas",
     *     tags={"Facturas"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Listado de facturas obtenido exitosamente"
     *     )
     * )
     */
    public function getFacturas(): JsonResponse
    {
        $facturas = Factura::with(['paciente', 'pagos'])->get();

        return response()->json([
            'success' => true,
            'data'    => $facturas,
            'message' => 'Listado de facturas obtenido exitosamente'
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/facturas",
     *     summary="Crear una nueva factura",
     *     tags={"Facturas"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"importe", "importe_final", "id_paciente", "id_tratamiento"},
     *             @OA\Property(property="importe", type="number", example=1000),
     *             @OA\Property(property="descuento_precio", type="number", example=100, nullable=true),
     *             @OA\Property(property="descuento_porcentaje", type="number", example=10, nullable=true),
     *             @OA\Property(property="importe_final", type="number", example=900),
     *             @OA\Property(property="id_paciente", type="integer", example=1),
     *             @OA\Property(property="id_tratamiento", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Factura creada correctamente"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error en la validación de datos"
     *     )
     * )
     */
    public function createFactura(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'importe'               => 'required|numeric|min:0',
            'descuento_precio'      => 'nullable|numeric|min:0',
            'descuento_porcentaje'  => 'nullable|numeric|min:0|max:100',
            'importe_final'         => 'required|numeric|min:0',
            'id_paciente'           => 'required|integer|exists:pacientes,id_paciente',
            'id_tratamiento'        => 'required|integer|exists:tratamientos,id_tratamiento',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $factura = Factura::create($validator->validated());

        return response()->json([
            'success' => true,
            'data'    => $factura,
            'message' => 'Factura creada correctamente',
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/facturas/{id}",
     *     summary="Actualizar una factura existente",
     *     tags={"Facturas"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la factura",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="importe", type="number", example=1000),
     *             @OA\Property(property="descuento_precio", type="number", example=100, nullable=true),
     *             @OA\Property(property="descuento_porcentaje", type="number", example=10, nullable=true),
     *             @OA\Property(property="importe_final", type="number", example=900),
     *             @OA\Property(property="id_paciente", type="integer", example=1),
     *             @OA\Property(property="id_tratamiento", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Factura actualizada correctamente"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Factura no encontrada"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error en la validación de datos"
     *     )
     * )
     */
    public function updateFactura(Request $request, $id): JsonResponse
    {
        $factura = Factura::find($id);
        if (! $factura) {
            return response()->json([
                'success' => false,
                'message' => 'Factura no encontrada'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'importe'              => 'sometimes|required|numeric|min:0',
            'descuento_precio'     => 'sometimes|nullable|numeric|min:0',
            'descuento_porcentaje' => 'sometimes|nullable|numeric|min:0|max:100',
            'importe_final'        => 'sometimes|required|numeric|min:0',
            'id_paciente'          => 'sometimes|required|integer|exists:pacientes,id_paciente',
            'id_tratamiento'       => 'sometimes|required|integer|exists:tratamientos,id_tratamiento',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $factura->update($validator->validated());

        return response()->json([
            'success' => true,
            'data'    => $factura,
            'message' => 'Pago actualizado correctamente',
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/facturas/{id}",
     *     summary="Obtener una factura por ID",
     *     tags={"Facturas"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la factura",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Factura obtenida exitosamente"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Factura no encontrada"
     *     )
     * )
     */
    public function getFacturaById($id): JsonResponse
    {
        $factura = Factura::with(['paciente', 'pagos'])->find($id);

        if (! $factura) {
            return response()->json([
                'success' => false,
                'message' => 'Factura no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $factura,
            'message' => 'Factura obtenida exitosamente'
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/facturas/{id}",
     *     summary="Eliminar una factura",
     *     tags={"Facturas"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la factura",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Factura eliminada correctamente"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Factura no encontrada"
     *     )
     * )
     */
    public function deleteFactura($id): JsonResponse
    {
        $factura = Factura::find($id);
        if (! $factura) {
            return response()->json([
                'success' => false,
                'message' => 'Factura no encontrada'
            ], 404);
        }

        $factura->delete();

        return response()->json([
            'success' => true,
            'message' => 'Factura eliminada correctamente'
        ], 200);
    }
}

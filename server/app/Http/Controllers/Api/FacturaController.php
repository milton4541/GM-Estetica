<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Factura;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Validator;

class FacturaController extends Controller
{
    public function getFacturas(): JsonResponse
    {
        $facturas = Factura::with(['paciente', 'pagos'])->get();

        return response()->json([
            'success' => true,
            'data'    => $facturas,
            'message' => 'Listado de facturas obtenido exitosamente'
        ], 200);
    }

    public function createFactura(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'importe'               => 'required|numeric|min:0',
            'descuento_precio'      => 'nullable|numeric|min:0',
            'descuento_porcentaje'  => 'nullable|numeric|min:0|max:100',
            'importe_final'         => 'required|numeric|min:0',
            'id_paciente'           => 'required|integer|exists:pacientes,id_paciente',
            'id_tratamiento'        => 'required|integer|exists:tratamientos,id_tratamiento',
        ], [
            'importe.required'              => 'El importe es obligatorio.',
            'importe.numeric'               => 'El importe debe ser un número.',
            'importe.min'                   => 'El importe no puede ser negativo.',

            'descuento_precio.numeric'      => 'El descuento en precio debe ser un número.',
            'descuento_precio.min'          => 'El descuento en precio no puede ser negativo.',

            'descuento_porcentaje.numeric'  => 'El descuento porcentual debe ser un número.',
            'descuento_porcentaje.min'      => 'El descuento porcentual no puede ser negativo.',
            'descuento_porcentaje.max'      => 'El descuento porcentual no puede superar 100.',

            'importe_final.required'        => 'El importe final es obligatorio.',
            'importe_final.numeric'         => 'El importe final debe ser un número.',
            'importe_final.min'             => 'El importe final no puede ser negativo.',

            'id_paciente.required'          => 'El ID de paciente es obligatorio.',
            'id_paciente.integer'           => 'El ID de paciente debe ser un entero.',
            'id_paciente.exists'            => 'El paciente no existe.',

            'id_tratamiento.required'       => 'El ID de tratamiento es obligatorio.',
            'id_tratamiento.integer'        => 'El ID de tratamiento debe ser un entero.',
            'id_tratamiento.exists'         => 'El tratamiento no existe.',
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

    public function updateFactura(Request $request, $id): JsonResponse
    {
        $factura = Factura::find($id);
        if (! $factura) {
            return response()->json([
                'success' => false,
                'message' => 'Factura no encontrada'
            ], 404);
        }

        $rules = [
            'importe'              => 'sometimes|required|numeric|min:0',
            'descuento_precio'     => 'sometimes|nullable|numeric|min:0',
            'descuento_porcentaje' => 'sometimes|nullable|numeric|min:0|max:100',
            'importe_final'        => 'sometimes|required|numeric|min:0',
            'id_paciente'          => 'sometimes|required|integer|exists:pacientes,id_paciente',
            'id_tratamiento'       => 'sometimes|required|integer|exists:tratamientos,id_tratamiento',
        ];
        $messages = [
            'importe.required'              => 'El importe es obligatorio.',
            'importe.numeric'               => 'El importe debe ser un número.',
            'importe.min'                   => 'El importe no puede ser negativo.',

            'descuento_precio.numeric'      => 'El descuento en precio debe ser un número.',
            'descuento_precio.min'          => 'El descuento en precio no puede ser negativo.',

            'descuento_porcentaje.numeric'  => 'El descuento porcentual debe ser un número.',
            'descuento_porcentaje.min'      => 'El descuento porcentual no puede ser negativo.',
            'descuento_porcentaje.max'      => 'El descuento porcentual no puede superar 100.',

            'importe_final.required'        => 'El importe final es obligatorio.',
            'importe_final.numeric'         => 'El importe final debe ser un número.',
            'importe_final.min'             => 'El importe final no puede ser negativo.',

            'id_paciente.required'          => 'El ID de paciente es obligatorio.',
            'id_paciente.integer'           => 'El ID de paciente debe ser un entero.',
            'id_paciente.exists'            => 'El paciente no existe.',

            'id_tratamiento.required'       => 'El ID de tratamiento es obligatorio.',
            'id_tratamiento.integer'        => 'El ID de tratamiento debe ser un entero.',
            'id_tratamiento.exists'         => 'El tratamiento no existe.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
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
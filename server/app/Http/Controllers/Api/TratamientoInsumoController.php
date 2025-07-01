<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TratamientoInsumo;
use Illuminate\Support\Facades\Validator;

class TratamientoInsumoController extends Controller
{
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

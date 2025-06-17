<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TratamientoInsumo;
use Illuminate\Http\Request;

class TratamientoInsumoController extends Controller
{
    public function index()
    {
        $data = TratamientoInsumo::all();
        return response()->json([
            'success' => true,
            'data'    => $data,
            'message' => 'Listado de relaciones obtenido exitosamente',
        ], 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_tratamiento' => 'required|exists:tratamiento,id_tratamiento',
            'id_insumo' => 'required|exists:insumo,id_insumo',
        ]);

        $relacion = TratamientoInsumo::create($data);
        return response()->json([
            'success' => true,
            'data'    => $relacion,
            'message' => 'Relación creada exitosamente',
        ], 201);
    }

    public function show($id)
    {
        $relacion = TratamientoInsumo::findOrFail($id);
        return response()->json([
            'success' => true,
            'data'    => $relacion,
            'message' => 'Relación obtenida exitosamente',
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $relacion = TratamientoInsumo::findOrFail($id);

        $data = $request->validate([
            'id_tratamiento' => 'sometimes|required|exists:tratamiento,id_tratamiento',
            'id_insumo' => 'sometimes|required|exists:insumo,id_insumo',
        ]);

        $relacion->update($data);
        return response()->json([
            'success' => true,
            'data'    => $relacion,
            'message' => 'Relación actualizada exitosamente',
        ], 200);
    }

    public function destroy($id)
    {
        $relacion = TratamientoInsumo::findOrFail($id);
        $relacion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Relación eliminada correctamente',
        ], 200);
    }
}


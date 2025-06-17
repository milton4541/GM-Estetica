<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TratamientoInsumo;
use Illuminate\Http\Request;

class TratamientoInsumoController extends Controller
{
    public function index()
    {
        return response()->json(TratamientoInsumo::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_tratamiento' => 'required|exists:tratamiento,id_tratamiento',
            'id_insumo' => 'required|exists:insumo,id_insumo',
        ]);

        $relacion = TratamientoInsumo::create($data);
        return response()->json($relacion, 201);
    }

    public function show($id)
    {
        return response()->json(TratamientoInsumo::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $relacion = TratamientoInsumo::findOrFail($id);

        $data = $request->validate([
            'id_tratamiento' => 'sometimes|required|exists:tratamiento,id_tratamiento',
            'id_insumo' => 'sometimes|required|exists:insumo,id_insumo',
        ]);

        $relacion->update($data);
        return response()->json($relacion);
    }

    public function destroy($id)
    {
        $relacion = TratamientoInsumo::findOrFail($id);
        $relacion->delete();

        return response()->json(['message' => 'Relación eliminada correctamente']);
    }
}

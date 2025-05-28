<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Insumo;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Validator;

class InsumoController extends Controller
{
    public function getInsumos(Request $request){
        $insumo = Insumo::all();
        if($insumo->isEmpty()){
            return response()->json([
                'message'=>'No se encontraron tratamientos',
                'success' => false,
            ],404);
        }
        return response()->json([
            'message'=> 'Insumos encontrados correctamente',
            'data' => $insumo,
            'success' => true,
        ],200);
    }
    public function createInsumo(Request $request){
        $validator = Validator::make($request->all(), [
            'componentes'      => 'required|string',
            'precio_insumo'    => 'required|numeric|min:0',
            'cantidad'         => 'required|integer|min:0',
            'nombre'           => 'required|string|max:255',
            'fecha_expiracion' => 'required|date_format:d/m/Y',
        ], [
            'componentes.required'       => 'Los componentes del insumo son obligatorios.',
            'componentes.string'         => 'Los componentes deben ser texto.',
            'precio_insumo.required'     => 'El precio del insumo es obligatorio.',
            'precio_insumo.numeric'      => 'El precio del insumo debe ser un valor numérico.',
            'precio_insumo.min'          => 'El precio del insumo no puede ser negativo.',
            'cantidad.required'          => 'La cantidad es obligatoria.',
            'cantidad.integer'           => 'La cantidad debe ser un número entero.',
            'cantidad.min'               => 'La cantidad no puede ser negativa.',
            'nombre.required'            => 'El nombre del insumo es obligatorio.',
            'nombre.string'              => 'El nombre del insumo debe ser texto.',
            'nombre.max'                 => 'El nombre del insumo no puede superar los 255 caracteres.',
            'fecha_expiracion.required'  => 'La fecha de expiración es obligatoria.',
            'fecha_expiracion.date_format' => 'La fecha de expiración debe tener formato dd/mm/aaaa.',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
            ], 422);
        }
        $data = $validator->validated();
        $data['fecha_expiracion'] = Carbon::createFromFormat('d/m/Y', $data['fecha_expiracion'])
                                            ->format('Y-m-d');

        $insumo = Insumo::create($data);
        return response()->json([
            'success' => true,
            'data'    => $insumo,
            'message' => 'Insumo creado correctamente',
        ], 201);
    }
    public function getInsumoById(Request $request, $id){
        $insumo = Insumo::find($id);
        if(!$insumo){
            return response()->json(['message' => 'Insumo no encontrado','success' => 'false'],404);
        }
        return response()->json([
            'message'  => 'Insumo encontrado correctamente',
            'data' => $insumo,
            'success' => true,
        ], 200);
    }
    public function updateInsumo(Request $request, $id){
        $insumo = Insumo::find($id);
        if (! $insumo) {
            return response()->json([
                'success' => false,
                'message' => 'Insumo no encontrado'
            ], 404);
        }

        // 2. Definir reglas y mensajes (similares al create, con "sometimes")
        $rules = [
            'componentes'      => 'sometimes|required|string',
            'precio_insumo'    => 'sometimes|required|numeric|min:0',
            'cantidad'         => 'sometimes|required|integer|min:0',
            'nombre'           => 'sometimes|required|string|max:255',
            'fecha_expiracion' => 'sometimes|required|date_format:d/m/Y',
        ];
        $messages = [
            'componentes.required'         => 'Los componentes del insumo son obligatorios.',
            'componentes.string'           => 'Los componentes deben ser texto.',
            'precio_insumo.required'       => 'El precio del insumo es obligatorio.',
            'precio_insumo.numeric'        => 'El precio del insumo debe ser un valor numérico.',
            'precio_insumo.min'            => 'El precio del insumo no puede ser negativo.',
            'cantidad.required'            => 'La cantidad es obligatoria.',
            'cantidad.integer'             => 'La cantidad debe ser un número entero.',
            'cantidad.min'                 => 'La cantidad no puede ser negativa.',
            'nombre.required'              => 'El nombre del insumo es obligatorio.',
            'nombre.string'                => 'El nombre del insumo debe ser texto.',
            'nombre.max'                   => 'El nombre del insumo no puede superar los 255 caracteres.',
            'fecha_expiracion.required'    => 'La fecha de expiración es obligatoria.',
            'fecha_expiracion.date_format' => 'La fecha de expiración debe tener formato dd/mm/aaaa.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        if (isset($data['fecha_expiracion'])) {
            $data['fecha_expiracion'] = Carbon::createFromFormat('d/m/Y', $data['fecha_expiracion'])
                                                ->format('Y-m-d');
        }

        $insumo->update($data);

        return response()->json([
            'success' => true,
            'data'    => $insumo,
            'message' => 'Insumo actualizado correctamente',
        ], 200);
    }

    public function deleteInsumo(Request $request, $id){
        $insumo = Insumo::find($id);

        if(!$insumo){
            return response()->json(['message' => 'Insumo no encontrado', 'success' => 'false'], 404);
        }
        $insumo->delete();
        return response()->json([
            'success'=> true,
            'message' => 'Insumo elminado correctamente',
        ],200);
    }
}

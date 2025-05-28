<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Tratamiento;
use App\Models\Paciente;
use Illuminate\Support\Facades\Validator;

class TratamientoController extends Controller
{
    public function getTratamientos(Request $request){
        $tratamiento = Tratamiento::all();

        if($tratamiento->isEmpty()){
            return response()->json([
                'message'=>'No se encontraron tratamientos',
                'success' => false,
            ],404);
        }
        return response()->json([
            'message'  => 'Tratamientos encontrados correctamente',
            'data' => $tratamiento,
            'success' => true
        ], 200);    }

    //crear nuevo tratamiento
    public function createTratamiento(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
        'id_tratamiento' => 'required|integer|unique:tratamientos,id_tratamiento',
        'descripcion'    => 'required|string|max:255',
        'duracion'       => 'required|integer|min:1',
        'precio'         => 'required|numeric|min:0',
    ], [
        'id_tratamiento.required' => 'El ID del tratamiento es obligatorio.',
        'id_tratamiento.integer'  => 'El ID del tratamiento debe ser un número entero.',
        'id_tratamiento.unique'   => 'Ya existe un tratamiento con ese ID.',
        
        'descripcion.required'    => 'La descripción es obligatoria.',
        'descripcion.string'      => 'La descripción debe ser texto.',
        'descripcion.max'         => 'La descripción no puede superar los 255 caracteres.',
        
        'duracion.required'       => 'La duración es obligatoria.',
        'duracion.integer'        => 'La duración debe ser un número entero.',
        'duracion.min'            => 'La duración debe ser al menos 1 minuto.',

        'precio.required'         => 'El precio es obligatorio.',
        'precio.numeric'          => 'El precio debe ser un valor numérico.',
        'precio.min'              => 'El precio no puede ser negativo.',
    ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
                'success' => 'false',
            ], 422);
        }

        $tratamiento = Tratamiento::create($validator->validated());

        return response()->json([
            'message'  => 'Tratamiento creado correctamente',
            'data' => $tratamiento,
            'success' => true
        ], 201);
    }

    public function getTratamientoById($id){
        $tratamiento = Tratamiento::find($id);
        if(!$tratamiento){
            return response()->json(['message' => 'Tratamiento no encontrado','success' => 'false'],404);
        }
        return response()->json([
            'message'  => 'tratamiento encontrado correctamente',
            'data' => $tratamiento,
            'success' => true,
        ], 200);
    }

    public function updateTratamiento(Request $request, $id){
        $tratamiento = Tratamiento::find($id);
        if(!$tratamiento){
            return response()->json(['message' => 'Tratamiento no encontrado','success' => 'false'], 404);
        }
        $rules = [
            'id_tratamiento' => 'sometimes|required|integer|unique:tratamientos,id_tratamiento,' . $tratamiento->id_tratamiento . ',id_tratamiento',
            'descripcion'    => 'sometimes|required|string|max:255',
            'duracion'       => 'sometimes|required|integer|min:1',
            'precio'         => 'sometimes|required|numeric|min:0',
        ];
        $messages = [
            'id_tratamiento.required' => 'El ID del tratamiento es obligatorio.',
            'id_tratamiento.integer'  => 'El ID del tratamiento debe ser un número entero.',
            'id_tratamiento.unique'   => 'Ya existe un tratamiento con ese ID.',

            'descripcion.required'    => 'La descripción es obligatoria.',
            'descripcion.string'      => 'La descripción debe ser texto.',
            'descripcion.max'         => 'La descripción no puede superar los 255 caracteres.',

            'duracion.required'       => 'La duración es obligatoria.',
            'duracion.integer'        => 'La duración debe ser un número entero.',
            'duracion.min'            => 'La duración debe ser al menos 1 minuto.',

            'precio.required'         => 'El precio es obligatorio.',
            'precio.numeric'          => 'El precio debe ser un valor numérico.',
            'precio.min'              => 'El precio no puede ser negativo.',
        ];
        
        $validator = Validator::make($request->all(), $rules, $messages);
        if($validator->fails()){
            return response()->json([
                'message' => 'Error en la validación de datos',
                'errors'  => $validator->errors(),
                'success' => 'false',
            ], 422);
        }
        $tratamiento->update($validator->validated());
        return response()->json([
            'message'  => 'Tratamiento actualizado correctamente',
            'data' => $tratamiento,
            'success' => true,
        ], 200);        
    }
    public function deleteTratamiento($id){
        $tratamiento = Tratamiento::find($id);

        if(!$tratamiento){
            return response()->json(['message' => 'Tratamiento no encontrado', 'success' => 'false'], 404);
        }

        $tratamiento->delete();
        return response()->json([
            'message' => 'Tratamiento eliminado exitosamente',
            'success' => true,
        ], 200);
    }
}

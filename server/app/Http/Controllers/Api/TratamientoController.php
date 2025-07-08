<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Tratamiento;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Tag(
 *     name="Tratamientos",
 *     description="Operaciones relacionadas con tratamientos"
 * )
 * 
 * @OA\Schema(
 *     schema="Tratamiento",
 *     type="object",
 *     @OA\Property(property="id_tratamiento", type="integer", example=1),
 *     @OA\Property(property="descripcion", type="string", example="Tratamiento facial"),
 *     @OA\Property(property="duracion", type="integer", example=60),
 *     @OA\Property(property="precio", type="number", format="float", example=1200.50),
 * )
 * 
 * @OA\Schema(
 *     schema="ErrorValidacion",
 *     type="object",
 *     @OA\Property(property="message", type="string", example="Error en la validación de datos"),
 *     @OA\Property(
 *         property="errors",
 *         type="object",
 *         additionalProperties=@OA\Property(type="array", @OA\Items(type="string"))
 *     ),
 *     @OA\Property(property="success", type="boolean", example=false),
 * )
 * 
 * @OA\Schema(
 *     schema="ResponseTratamientoList",
 *     type="object",
 *     @OA\Property(property="message", type="string", example="Tratamientos encontrados correctamente"),
 *     @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Tratamiento")),
 *     @OA\Property(property="success", type="boolean", example=true),
 * )
 * 
 * @OA\Schema(
 *     schema="ResponseTratamientoSingle",
 *     type="object",
 *     @OA\Property(property="message", type="string", example="Tratamiento encontrado correctamente"),
 *     @OA\Property(property="data", ref="#/components/schemas/Tratamiento"),
 *     @OA\Property(property="success", type="boolean", example=true),
 * )
 */

class TratamientoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/tratamientos",
     *     summary="Listar todos los tratamientos",
     *     tags={"Tratamientos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Tratamientos encontrados correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseTratamientoList")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No se encontraron tratamientos",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No se encontraron tratamientos"),
     *             @OA\Property(property="success", type="boolean", example=false)
     *         )
     *     )
     * )
     */
    public function getTratamientos(Request $request)
    {
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
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/tratamientos",
     *     summary="Crear un nuevo tratamiento",
     *     tags={"Tratamientos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"descripcion","duracion","precio"},
     *             @OA\Property(property="descripcion", type="string", example="Tratamiento facial"),
     *             @OA\Property(property="duracion", type="integer", example=60),
     *             @OA\Property(property="precio", type="number", format="float", example=1200.50)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Tratamiento creado correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseTratamientoSingle")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error en la validación de datos",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorValidacion")
     *     )
     * )
     */
    public function createTratamiento(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'descripcion'    => 'required|string|max:255',
            'duracion'       => 'required|integer|min:1',
            'precio'         => 'required|numeric|min:0',
        ], [
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
                'success' => false,
            ], 422);
        }

        $tratamiento = Tratamiento::create($validator->validated());

        return response()->json([
            'message'  => 'Tratamiento creado correctamente',
            'data' => $tratamiento,
            'success' => true
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/tratamientos/{id}",
     *     summary="Obtener un tratamiento por ID",
     *     tags={"Tratamientos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID del tratamiento",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Tratamiento encontrado correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseTratamientoSingle")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Tratamiento no encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Tratamiento no encontrado"),
     *             @OA\Property(property="success", type="boolean", example=false)
     *         )
     *     )
     * )
     */
    public function getTratamientoById($id)
    {
        $tratamiento = Tratamiento::find($id);
        if(!$tratamiento){
            return response()->json(['message' => 'Tratamiento no encontrado','success' => false],404);
        }
        return response()->json([
            'message'  => 'Tratamiento encontrado correctamente',
            'data' => $tratamiento,
            'success' => true,
        ], 200);
    }

    /**
     * @OA\Put(
     *     path="/api/tratamientos/{id}",
     *     summary="Actualizar un tratamiento por ID",
     *     tags={"Tratamientos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID del tratamiento a actualizar",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id_tratamiento", type="integer", example=1),
     *             @OA\Property(property="descripcion", type="string", example="Tratamiento facial actualizado"),
     *             @OA\Property(property="duracion", type="integer", example=75),
     *             @OA\Property(property="precio", type="number", format="float", example=1300.00)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Tratamiento actualizado correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/ResponseTratamientoSingle")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Tratamiento no encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Tratamiento no encontrado"),
     *             @OA\Property(property="success", type="boolean", example=false)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error en la validación de datos",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorValidacion")
     *     )
     * )
     */
    public function updateTratamiento(Request $request, $id)
    {
        $tratamiento = Tratamiento::find($id);
        if(!$tratamiento){
            return response()->json(['message' => 'Tratamiento no encontrado','success' => false], 404);
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
                'success' => false,
            ], 422);
        }
        $tratamiento->update($validator->validated());
        return response()->json([
            'message'  => 'Tratamiento actualizado correctamente',
            'data' => $tratamiento,
            'success' => true,
        ], 200);        
    }

    /**
     * @OA\Delete(
     *     path="/api/tratamientos/{id}",
     *     summary="Eliminar un tratamiento por ID",
     *     tags={"Tratamientos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID del tratamiento a eliminar",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Tratamiento eliminado exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Tratamiento eliminado exitosamente"),
     *             @OA\Property(property="success", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Tratamiento no encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Tratamiento no encontrado"),
     *             @OA\Property(property="success", type="boolean", example=false)
     *         )
     *     )
     * )
     */
    public function deleteTratamiento($id)
    {
        $tratamiento = Tratamiento::find($id);

        if(!$tratamiento){
            return response()->json(['message' => 'Tratamiento no encontrado', 'success' => false], 404);
        }

        $tratamiento->delete();
        return response()->json([
            'message' => 'Tratamiento eliminado exitosamente',
            'success' => true,
        ], 200);
    }
}

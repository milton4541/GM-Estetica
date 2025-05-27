<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tratamiento;
use App\Models\Paciente;

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
        ], 201);    }
    
}

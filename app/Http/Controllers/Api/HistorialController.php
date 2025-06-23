<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Historial;

class HistorialController extends Controller
{
    public function getHistorial(): JsonResponse
    {
        $historiales = Historial::with(['paciente', 'tratamiento'])->get();

        return response()->json([
            'succes' => true,
            'data' => $historiales
        ], 200);
    }
}

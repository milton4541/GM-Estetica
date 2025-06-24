<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Factura;
use App\Models\Tratamiento;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReporteAdministrativoController extends Controller
{
    // 1. Ingresos totales del sistema
    public function ingresosTotales()
    {
        $total = Factura::sum('importe_final');

        return response()->json([
            'success' => true,
            'message' => 'Ingresos totales calculados correctamente',
            'total' => $total,
        ], 200);
    }

    // 2. Ingresos por mes
    public function ingresosPorMes()
    {
        $ingresos = Factura::selectRaw("strftime('%Y-%m', created_at) as mes, sum(importe_final) as total")
            ->groupBy('mes')
            ->orderBy('mes')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Ingresos mensuales obtenidos correctamente',
            'data' => $ingresos,
        ], 200);
    }

    // 3. Rendimiento por tratamiento
    public function rendimientoPorTratamiento()
    {
        $rendimiento = DB::table('factura')
            ->join('tratamiento', 'tratamiento.id_tratamiento', '=', 'factura.id_tratamiento')
            ->select('tratamiento.descripcion as tratamiento', DB::raw('SUM(factura.importe_final) as ingreso_total'))
            ->groupBy('tratamiento.descripcion')
            ->orderByDesc('ingreso_total')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Rendimiento por tratamiento generado correctamente',
            'data' => $rendimiento,
        ], 200);
    }
}

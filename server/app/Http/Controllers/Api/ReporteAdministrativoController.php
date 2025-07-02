<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Factura;
use App\Models\Tratamiento;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * @OA\Tag(
 *     name="Reportes administrativos",
 *     description="Reportes e indicadores financieros del sistema"
 * )
 */
class ReporteAdministrativoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/reportes/ingresos-totales",
     *     summary="Obtener el total de ingresos del sistema",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Ingresos totales calculados correctamente"
     *     )
     * )
     */
    public function ingresosTotales()
    {
        $total = Factura::sum('importe_final');

        return response()->json([
            'success' => true,
            'message' => 'Ingresos totales calculados correctamente',
            'total' => $total,
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/reportes/ingresos-mensuales",
     *     summary="Obtener ingresos totales agrupados por mes",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Ingresos mensuales obtenidos correctamente"
     *     )
     * )
     */
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

    /**
     * @OA\Get(
     *     path="/api/reportes/rendimiento-tratamientos",
     *     summary="Obtener ingresos generados por cada tratamiento",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Rendimiento por tratamiento generado correctamente"
     *     )
     * )
     */
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

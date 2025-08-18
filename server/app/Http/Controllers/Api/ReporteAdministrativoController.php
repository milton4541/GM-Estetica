<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Factura;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

/**
 * @OA\Tag(
 *     name="Reportes administrativos",
 *     description="Reportes e indicadores financieros del sistema"
 * )
 * 
 * @OA\Schema(
 *     schema="IngresoTotalResponse",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="message", type="string", example="Ingresos totales calculados correctamente"),
 *     @OA\Property(property="total", type="number", format="float", example=150000.75),
 * )
 * 
 * @OA\Schema(
 *     schema="IngresoPorMesItem",
 *     type="object",
 *     @OA\Property(property="mes", type="string", example="2025-07"),
 *     @OA\Property(property="total", type="number", format="float", example=25000.00),
 * )
 * 
 * @OA\Schema(
 *     schema="IngresoPorMesResponse",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="message", type="string", example="Ingresos mensuales obtenidos correctamente"),
 *     @OA\Property(
 *         property="data",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/IngresoPorMesItem")
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="RendimientoTratamientoItem",
 *     type="object",
 *     @OA\Property(property="tratamiento", type="string", example="Limpieza facial"),
 *     @OA\Property(property="ingreso_total", type="number", format="float", example=50000.00),
 * )
 * 
 * @OA\Schema(
 *     schema="RendimientoTratamientoResponse",
 *     type="object",
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="message", type="string", example="Rendimiento por tratamiento generado correctamente"),
 *     @OA\Property(
 *         property="data",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/RendimientoTratamientoItem")
 *     )
 * )
 */
class ReporteAdministrativoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/reportes/ingresos-totales",
     *     summary="Obtener el total de ingresos del sistema (con rango de fechas opcional)",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="fecha_inicio",
     *         in="query",
     *         description="Fecha de inicio (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="fecha_fin",
     *         in="query",
     *         description="Fecha de fin (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Ingresos totales calculados correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/IngresoTotalResponse")
     *     )
     * )
     */

    /* se puede filtrar por rango de fechas, Finicio y Ffin*/ 
public function ingresosTotales(Request $request)
{
    $query = Factura::query();

    // ✅ Soporta inicio/fin opcionales
    if ($request->filled('fecha_inicio') && $request->filled('fecha_fin')) {
        $query->whereBetween('created_at', [$request->fecha_inicio, $request->fecha_fin]);
    } elseif ($request->filled('fecha_inicio')) {
        $query->whereDate('created_at', '>=', $request->fecha_inicio);
    } elseif ($request->filled('fecha_fin')) {
        $query->whereDate('created_at', '<=', $request->fecha_fin);
    }

    $total = (float) $query->sum('importe_final');

    return response()->json([
        'success' => true,
        'message' => 'Ingresos totales calculados correctamente',
        'total'   => $total,
    ], 200);
}

    /**
     * @OA\Get(
     *     path="/api/reportes/ingresos-totales-pdf",
     *     summary="Generar y descargar reporte PDF de ingresos totales (con rango de fechas opcional)",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="fecha_inicio",
     *         in="query",
     *         description="Fecha de inicio (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="fecha_fin",
     *         in="query",
     *         description="Fecha de fin (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Archivo PDF descargado correctamente",
     *         @OA\MediaType(mediaType="application/pdf")
     *     )
     * )
     */
    public function exportarIngresosTotalesPdf(Request $request)
{
    try {
        $query = Factura::query();

        // ✅ Mismo criterio de filtros que el JSON
        if ($request->filled('fecha_inicio') && $request->filled('fecha_fin')) {
            $query->whereBetween('created_at', [$request->fecha_inicio, $request->fecha_fin]);
        } elseif ($request->filled('fecha_inicio')) {
            $query->whereDate('created_at', '>=', $request->fecha_inicio);
        } elseif ($request->filled('fecha_fin')) {
            $query->whereDate('created_at', '<=', $request->fecha_fin);
        }

        $total = (float) $query->sum('importe_final');

        // ✅ Enviamos las 3 variables que el Blade necesita
        $pdf = Pdf::loadView('pdfs.ingresos_totales', [
            'total'        => $total,
            'fechaInicio'  => $request->input('fecha_inicio'), // <-- nombre que usa tu Blade
            'fechaFin'     => $request->input('fecha_fin'),    // <-- nombre que usa tu Blade
        ]);

        return $pdf->download('ingresos_totales.pdf');
    } catch (\Throwable $e) {
        Log::error('PDF ingresos totales - error', ['msg' => $e->getMessage()]);
        return response()->json([
            'success' => false,
            'message' => 'No se pudo generar el PDF de ingresos totales.',
            'error'   => $e->getMessage(),
        ], 500);
    }
}

    /**
     * @OA\Get(
     *     path="/api/reportes/ingresos-mensuales",
     *     summary="Obtener ingresos totales agrupados por mes (filtrar por mes opcional)",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="mes",
     *         in="query",
     *         description="Mes en formato YYYY-MM",
     *         required=false,
     *         @OA\Schema(type="string", example="2025-07")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Ingresos mensuales obtenidos correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/IngresoPorMesResponse")
     *     )
     * )
     */

    /*se filtra por mes en formato año/mes */
    public function ingresosPorMes(Request $request)
    {
        $query = Factura::selectRaw("strftime('%Y-%m', created_at) as mes, sum(importe_final) as total")
            ->groupBy('mes')
            ->orderBy('mes');

        if ($request->filled('mes')) {
            $query->having('mes', '=', $request->mes);
        }

        $ingresos = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Ingresos mensuales obtenidos correctamente',
            'data' => $ingresos,
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/reportes/ingresos-mensuales-pdf",
     *     summary="Generar y descargar reporte PDF de ingresos mensuales (filtrar por mes opcional)",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="mes",
     *         in="query",
     *         description="Mes en formato YYYY-MM",
     *         required=false,
     *         @OA\Schema(type="string", example="2025-07")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Archivo PDF descargado correctamente",
     *         @OA\MediaType(mediaType="application/pdf")
     *     )
     * )
     */
    public function exportarIngresosMensualesPdf(Request $request)
    {
        $query = Factura::selectRaw("strftime('%Y-%m', created_at) as mes, sum(importe_final) as total")
            ->groupBy('mes')
            ->orderBy('mes');

        if ($request->filled('mes')) {
            $query->having('mes', '=', $request->mes);
        }

        $ingresos = $query->get();

        $pdf = Pdf::loadView('pdfs.ingresos_mensuales', compact('ingresos'));

        return $pdf->download('ingresos_mensuales.pdf');
    }

    /**
     * @OA\Get(
     *     path="/api/reportes/rendimiento-tratamientos",
     *     summary="Obtener ingresos generados por cada tratamiento (filtrar por nombre opcional)",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="tratamiento",
     *         in="query",
     *         description="Nombre o parte del nombre del tratamiento",
     *         required=false,
     *         @OA\Schema(type="string", example="Limpieza")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Rendimiento por tratamiento generado correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/RendimientoTratamientoResponse")
     *     )
     * )
     */

    public function rendimientoPorTratamiento(Request $request)
    {
        $query = DB::table('factura')
            ->join('tratamiento', 'tratamiento.id_tratamiento', '=', 'factura.id_tratamiento')
            ->select('tratamiento.descripcion as tratamiento', DB::raw('SUM(factura.importe_final) as ingreso_total'))
            ->groupBy('tratamiento.descripcion')
            ->orderByDesc('ingreso_total');

        if ($request->filled('tratamiento')) {
            $query->where('tratamiento.descripcion', 'LIKE', '%' . $request->tratamiento . '%');
        }

        $rendimiento = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Rendimiento por tratamiento generado correctamente',
            'data' => $rendimiento,
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/reportes/rendimiento-tratamientos-pdf",
     *     summary="Generar y descargar reporte PDF de rendimiento por tratamiento (filtrar por nombre opcional)",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="tratamiento",
     *         in="query",
     *         description="Nombre o parte del nombre del tratamiento",
     *         required=false,
     *         @OA\Schema(type="string", example="Limpieza")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Archivo PDF descargado correctamente",
     *         @OA\MediaType(mediaType="application/pdf")
     *     )
     * )
     */
    public function exportarRendimientoTratamientosPdf(Request $request)
    {
        $query = DB::table('facturas')
            ->join('tratamientos', 'tratamientos.id_tratamiento', '=', 'facturas.id_tratamiento')
            ->select('tratamientos.descripcion as tratamiento', DB::raw('SUM(facturas.importe_final) as ingreso_total'))
            ->groupBy('tratamientos.descripcion')
            ->orderByDesc('ingreso_total');

        if ($request->filled('tratamiento')) {
            $query->where('tratamientos.descripcion', 'LIKE', '%' . $request->tratamiento . '%');
        }

        $rendimiento = $query->get();

        $pdf = Pdf::loadView('pdfs.rendimiento_tratamientos', compact('rendimiento'));

        return $pdf->download('rendimiento_tratamientos.pdf');
    }
}
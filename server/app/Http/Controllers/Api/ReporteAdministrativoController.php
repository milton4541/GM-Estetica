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
     *     summary="Obtener el total de ingresos del sistema",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Ingresos totales calculados correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/IngresoTotalResponse")
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
     *     path="/api/reportes/ingresos-totales-pdf",
     *     summary="Generar y descargar reporte PDF de ingresos totales",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Archivo PDF descargado correctamente",
     *         @OA\MediaType(
     *             mediaType="application/pdf"
     *         )
     *     )
     * )
     */
    public function exportarIngresosTotalesPdf()
    {
        $total = Factura::sum('importe_final');

        $pdf = Pdf::loadView('pdfs.ingresos_totales', compact('total'));

        return $pdf->download('ingresos_totales.pdf');
    }

    /**
     * @OA\Get(
     *     path="/api/reportes/ingresos-mensuales",
     *     summary="Obtener ingresos totales agrupados por mes",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Ingresos mensuales obtenidos correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/IngresoPorMesResponse")
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
     *     path="/api/reportes/ingresos-mensuales-pdf",
     *     summary="Generar y descargar reporte PDF de ingresos mensuales",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Archivo PDF descargado correctamente",
     *         @OA\MediaType(
     *             mediaType="application/pdf"
     *         )
     *     )
     * )
     */
    public function exportarIngresosMensualesPdf()
    {
        $ingresos = Factura::selectRaw("strftime('%Y-%m', created_at) as mes, sum(importe_final) as total")
            ->groupBy('mes')
            ->orderBy('mes')
            ->get();

        $pdf = Pdf::loadView('pdfs.ingresos_mensuales', compact('ingresos'));

        return $pdf->download('ingresos_mensuales.pdf');
    }

    /**
     * @OA\Get(
     *     path="/api/reportes/rendimiento-tratamientos",
     *     summary="Obtener ingresos generados por cada tratamiento",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Rendimiento por tratamiento generado correctamente",
     *         @OA\JsonContent(ref="#/components/schemas/RendimientoTratamientoResponse")
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

    /**
     * @OA\Get(
     *     path="/api/reportes/rendimiento-tratamientos-pdf",
     *     summary="Generar y descargar reporte PDF de rendimiento por tratamiento",
     *     tags={"Reportes administrativos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Archivo PDF descargado correctamente",
     *         @OA\MediaType(
     *             mediaType="application/pdf"
     *         )
     *     )
     * )
     */
    public function exportarRendimientoTratamientosPdf()
    {
    $rendimiento = DB::table('facturas')
        ->join('tratamientos', 'tratamientos.id_tratamiento', '=', 'facturas.id_tratamiento')
        ->select('tratamientos.descripcion as tratamiento', DB::raw('SUM(facturas.importe_final) as ingreso_total'))
        ->groupBy('tratamientos.descripcion')
        ->orderByDesc('ingreso_total')
        ->get();

        $pdf = Pdf::loadView('pdfs.rendimiento_tratamientos', compact('rendimiento'));

        return $pdf->download('rendimiento_tratamientos.pdf');
    }
}

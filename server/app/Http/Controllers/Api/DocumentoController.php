<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use App\Models\Documentos;

class DocumentoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/documentos",
     *     summary="Obtener todos los documentos no eliminados",
     *     tags={"Documentos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de documentos",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="nombre_doc", type="string", example="informe.pdf"),
     *                     @OA\Property(property="url", type="string", example="http://localhost/archivos/uuid.pdf"),
     *                     @OA\Property(property="historial_id", type="integer", example=3),
     *                     @OA\Property(property="eliminado", type="boolean", example=false),
     *                     @OA\Property(property="created_at", type="string", example="2025-07-02T12:00:00.000000Z"),
     *                     @OA\Property(property="updated_at", type="string", example="2025-07-02T12:00:00.000000Z")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getDoc(): JsonResponse
    {
        $docs = Documentos::where('eliminado', false)
                          ->orderBy('created_at', 'desc')
                          ->get();

        return response()->json([
            'data' => $docs
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/documentos",
     *     summary="Subir un nuevo documento",
     *     tags={"Documentos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"archivo", "historial_id"},
     *                 @OA\Property(
     *                     property="archivo",
     *                     type="string",
     *                     format="binary"
     *                 ),
     *                 @OA\Property(
     *                     property="historial_id",
     *                     type="integer",
     *                     example=3
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Documento subido correctamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Archivo subido correctamente"),
     *             @OA\Property(property="doc", type="object",
     *                 @OA\Property(property="id", type="integer", example=10),
     *                 @OA\Property(property="nombre_doc", type="string", example="archivo.pdf"),
     *                 @OA\Property(property="url", type="string", example="http://localhost/archivos/uuid.pdf"),
     *                 @OA\Property(property="historial_id", type="integer", example=3),
     *                 @OA\Property(property="created_at", type="string", example="2025-07-02T12:00:00.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", example="2025-07-02T12:00:00.000000Z")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validación"
     *     )
     * )
     */
    public function createDoc(Request $request): JsonResponse
    {
        $request->validate([
            'archivo'       => 'required|file|max:5120',
            'historial_id'  => 'required|integer|exists:historial,id_historial',
        ]);

        $file       = $request->file('archivo');
        $original   = $file->getClientOriginalName();
        $extension  = $file->getClientOriginalExtension();
        $filename   = Str::uuid() . '.' . $extension;

        $file->move(public_path('archivos'), $filename);

        $url = url("archivos/{$filename}");

        $doc = Documentos::create([
            'nombre_doc'     => $original,
            'url'            => $url,
            'historial_id'   => $request->historial_id,
        ]);

        return response()->json([
            'message' => 'Archivo subido correctamente',
            'doc'     => $doc,
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/documentos/{doc_id}/descargar",
     *     summary="Descargar un documento",
     *     tags={"Documentos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="doc_id",
     *         in="path",
     *         required=true,
     *         description="ID del documento",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Archivo descargado exitosamente",
     *         @OA\MediaType(
     *             mediaType="application/octet-stream"
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Documento no encontrado"
     *     )
     * )
     */
    public function download(int $doc_id)
    {
        $doc = Documentos::findOrFail($doc_id);

        $filename = basename(parse_url($doc->url, PHP_URL_PATH));
        $path = public_path("archivos/{$filename}");

        return response()->download(
            $path,
            $doc->nombre_doc
        );
    }

    /**
     * @OA\Delete(
     *     path="/api/documentos/{doc_id}",
     *     summary="Eliminar lógicamente un documento",
     *     tags={"Documentos"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="doc_id",
     *         in="path",
     *         required=true,
     *         description="ID del documento a eliminar",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Documento marcado como eliminado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Documento marcado como eliminado (baja lógica).")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Documento no encontrado"
     *     )
     * )
     */
    public function destroy(int $doc_id): JsonResponse
    {
        $doc = Documentos::findOrFail($doc_id);
        $doc->eliminado = true;
        $doc->save();

        return response()->json([
            'message' => 'Documento marcado como eliminado (baja lógica).'
        ], 200);
    }
}

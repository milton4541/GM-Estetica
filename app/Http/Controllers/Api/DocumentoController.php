<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use App\Models\Documentos;

class DocumentoController extends Controller
{
    public function getDoc(): JsonResponse
    {
        // Trae solo los que tengan eliminado = false
        $docs = Documentos::where('eliminado', false)
                          ->orderBy('created_at', 'desc')
                          ->get();

        return response()->json([
            'data' => $docs
        ], 200);
    }
    public function createDoc(Request $request): JsonResponse
    {
        // 1. Validación básica
        $request->validate([
            'archivo'        => 'required|file|max:5120', // hasta 5 MB
            'tratamiento_id' => 'required|integer|exists:tratamientos,id_tratamiento',
        ]);

        $file         = $request->file('archivo');
        $original    = $file->getClientOriginalName();
        $extension   = $file->getClientOriginalExtension();
        $filename    = Str::uuid().'.'.$extension;

        //    public_path('archivos') apunta a C:\laragon\www\Taller\server\public\archivos
        $file->move(public_path('archivos'), $filename);

        $url = url("archivos/{$filename}");

        $doc = Documentos::create([
            'nombre_doc'      => $original,
            'url'             => $url,
            'tratamiento_id'  => $request->tratamiento_id,
        ]);

        return response()->json([
            'message' => 'Archivo subido correctamente',
            'doc'     => $doc,
        ], 201);
    }
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
        public function destroy(int $doc_id): JsonResponse
    {
        // 1) Obtener el registro
        $doc = Documentos::findOrFail($doc_id);

        // 2) Marcar como eliminado en la BD
        $doc->eliminado = true;
        $doc->save();

        // 3) Responder al cliente
        return response()->json([
            'message' => 'Documento marcado como eliminado (baja lógica).'
        ], 200);
    }

}

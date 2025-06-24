<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Documentos;
use Illuminate\Support\Facades\File;

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
    // 1) Validación
    $data = $request->validate([
        'archivo'        => 'required|file|max:5120',
        'tratamiento_id' => 'required|integer|exists:tratamientos,id_tratamiento',
    ]);

    $file       = $request->file('archivo');
    $original   = $file->getClientOriginalName();
    $extension  = $file->getClientOriginalExtension();
    $filename   = Str::uuid().'.'.$extension;

    // 2) Guarda usando Storage en public/archivos
    try {
        $storedPath = $file->storeAs('', $filename, 'archivos');
        // $storedPath === 'c5d6ae33-c734-41bf-a159-e441ab24d266.jpeg'
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error al guardar el archivo: '.$e->getMessage()
        ], 500);
    }

    // 3) Guarda en BD sólo la ruta relativa
    $doc = Documentos::create([
        'nombre_doc'     => $original,
        'url'             => 'archivos/'.$filename,
        'tratamiento_id' => $data['tratamiento_id'],
    ]);

    // 4) Devuelve la URL pública por comodidad
    return response()->json([
        'message' => 'Archivo subido correctamente',
        'doc'     => $doc,
        'url'     => Storage::disk('archivos')->url($filename)
    ], 201);
    }
    public function download(int $doc_id)
    {
        $doc = Documentos::findOrFail($doc_id);

    $path     = public_path($doc->url); // C:\...\public\archivos\uuid.JPEG

    return response()->download($path, $doc->nombre_doc);
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
    public function deleteFromBD(int $doc_id): JsonResponse
    {
        $doc = Documentos::findOrFail($doc_id);

        $filePath = public_path($doc->url);

        if (File::exists($filePath)) {
            File::delete($filePath);
        }

        $doc->delete();

        return response()->json([
            'message' => 'Documento eliminado completamente.'
        ], 200);
    }
}

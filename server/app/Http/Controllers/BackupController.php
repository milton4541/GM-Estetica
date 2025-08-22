<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class BackupController extends Controller
{
    /**
     * Crear un backup de la base de datos SQL Server
     */
    public function createBackup()
    {
        $database = env('DB_DATABASE'); // Nombre de la BD desde .env
        $backupDir = storage_path('app/backups'); // Carpeta en storage/app/backups

        // Si no existe la carpeta, la crea
        if (!file_exists($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        // Nombre del archivo con fecha y hora
        $backupFile = $backupDir . "/{$database}_" . date('Y-m-d_H-i-s') . ".bak";

        // Query de backup
        $query = "BACKUP DATABASE [$database] TO DISK = N'$backupFile' WITH INIT, FORMAT";

        try {
            DB::statement($query);
            return response()->json([
                'message' => 'Backup creado exitosamente',
                'file' => $backupFile
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

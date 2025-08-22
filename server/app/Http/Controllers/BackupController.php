<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BackupController extends Controller
{
    /**
     * Crear un backup de la base de datos SQL Server usando sqlcmd
     */
    public function createBackup()
    {
        $database = env('DB_DATABASE'); // Nombre de la BD desde .env
        $backupDir = 'C:\\backups_sql'; // Carpeta para backups
        $backupFile = $backupDir . "\\{$database}_" . date('Y-m-d_H-i-s') . ".bak";

        // Si no existe la carpeta, la crea
        if (!file_exists($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        // Credenciales de SQL Server desde .env
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');
        $server   = env('DB_HOST') . ',' . env('DB_PORT'); // ej: 127.0.0.1,1433

        // Comando sqlcmd para ejecutar el backup
        $command = "sqlcmd -S $server -U $username -P $password -Q \"BACKUP DATABASE [$database] TO DISK = N'$backupFile' WITH INIT, FORMAT\"";

        // Ejecutar comando
        exec($command, $output, $returnVar);

        if ($returnVar === 0) {
            return response()->json([
                'message' => 'Backup creado exitosamente',
                'file' => $backupFile,
                'output' => $output
            ]);
        } else {
            return response()->json([
                'error' => 'No se pudo crear el backup',
                'output' => $output,
                'returnVar' => $returnVar
            ], 500);
        }
    }
}

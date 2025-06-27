<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class EnviarRecordatorioWhatsApp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'enviar:recordatorio-whatsapp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
public function handle()
{
    $mañana = now()->addDay()->format('Y-m-d');

    $turnos = \App\Models\Turno::with(['paciente', 'tratamiento'])
        ->whereDate('fecha', $mañana)
        ->get();

    if ($turnos->isEmpty()) {
        $mensaje = "*No hay turnos programados para mañana.*";
    } else {
        $mensaje = "*Turnos programados para mañana*:\n\n";
        foreach ($turnos as $turno) {
            $mensaje .= "- Paciente: " . $turno->paciente->nombre . " " . $turno->paciente->apellido .
                        "\n Hora: " . $turno->hora .
                        "\n Tratamiento: " . ($turno->tratamiento->descripcion ?? 'No especificado') . "\n\n";
        }
    }

    $path = storage_path('app');

    if (!file_exists($path)) {
        mkdir($path, 0777, true);
    }

    file_put_contents($path.'/mensaje_wsp.txt', $mensaje);

    $this->info("Mensaje generado:\n" . $mensaje);
}



}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Historial extends Model
{
    protected $table = 'historial';
    protected $primaryKey = 'id_historial';
    public $incrementing = true;
    protected $keyType = 'int';

    // Campos que puedes rellenar masivamente
    protected $fillable = [
        'id_paciente',
        'id_tratamiento',
        'fecha',
        'observaciones',
    ];

    // Relación al paciente
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }

    // Relación al tratamiento
    public function tratamiento()
    {
        return $this->belongsTo(Tratamiento::class, 'id_tratamiento', 'id_tratamiento');
    }
}

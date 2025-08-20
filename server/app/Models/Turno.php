<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turno extends Model
{
    protected $primaryKey = 'id_turno';
    public $incrementing = true;
    protected $keyType = 'int';

    // Asignación masiva
    protected $fillable = [
        'fecha',
        'hora',
        'id_tratamiento',
        'id_paciente',
        'finalizado', 
    ];

    // Casteo de tipos
    protected $casts = [
        'finalizado' => 'boolean',
    ];

    // Relación: un turno pertenece a un tratamiento
    public function tratamiento()
    {
        return $this->belongsTo(Tratamiento::class, 'id_tratamiento', 'id_tratamiento');
    }

    // Relación: un turno pertenece a un paciente
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }  
}

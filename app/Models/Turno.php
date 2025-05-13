<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Turno extends Model
{
    use HasFactory;

    protected $fillable = [
        'paciente_id',
        'fecha_turno',
        'hora_turno',
        'estado',
        'observaciones',
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }
}

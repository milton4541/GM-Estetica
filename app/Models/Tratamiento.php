<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tratamiento extends Model
{
    use HasFactory;

    protected $fillable = [
        'paciente_id',
        'fecha',
        'motivo',
        'diagnostico',
        'tratamiento',
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }
}


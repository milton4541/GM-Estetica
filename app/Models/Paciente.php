<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    protected $primaryKey = 'id_paciente';
    public $incrementing = true;
    protected $keyType = 'int';

    // Asignación masiva: estos campos podrán rellenarse via create/update
    protected $fillable = [
        'dni_paciente',
        'nombre',
        'apellido',
        'email',
        'telefono',
        'obra_social',
    ];
}

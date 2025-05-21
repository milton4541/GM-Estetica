<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tratamiento extends Model
{
    protected $primaryKey = 'id_tratamiento';
    public $incrementing = true;
    protected $keyType = 'int';

    // Asignación masiva: estos campos podrán rellenarse vía create/update
    protected $fillable = [
        'descripcion',
        'duracion',
        'precio',
    ];
}

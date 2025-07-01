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
    public function insumos()
{
    return $this->belongsToMany(
        Insumo::class,
        'tratamiento_insumo',
        'id_tratamiento',
        'id_insumo'
    );
}
}

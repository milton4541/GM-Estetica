<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Insumo extends Model
{
    protected $primaryKey = 'id_insumo';
    public $incrementing = true;
    protected $keyType = 'int';

    // Asignación masiva
    protected $fillable = [
        'componentes',
        'precio_insumo',
        'cantidad',
        'nombre',
        'fecha_expiracion',
    ];

    // Cast de fechas
    protected $casts = [
        'fecha_expiracion' => 'date',
    ];
    public function tratamientos()
    {
        return $this->belongsToMany(
            Tratamiento::class,
            'tratamiento_insumo',
            'id_insumo',
            'id_tratamiento'
        );
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Factura extends Model
{
     protected $primaryKey = 'factura_id';
    public $incrementing = true;
    protected $keyType = 'int';

    // Asignación masiva
    protected $fillable = [
        'importe',
        'descuento_precio',
        'descuento_porcentaje',
        'importe_final',
        'id_paciente',
        'id_tratamiento',
    ];

    // Relaciones
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }

    public function tratamiento()
    {
        return $this->belongsTo(Tratamiento::class, 'id_tratamiento', 'id_tratamiento');
    }

    /**
     * Opcional: si prefieres calcular importe_final en lugar de almacenarlo,
     * elimina la columna de la migración y usa este accesor:
     */
    public function getImporteFinalAttribute($value)
    {
        // si hay descuento_porcentaje aplicamos porcentaje
        if ($this->descuento_porcentaje > 0) {
            return round($this->importe * (1 - $this->descuento_porcentaje / 100), 2);
        }
        // si hay descuento_precio, restamos
        return round($this->importe - $this->descuento_precio, 2);
    }
}

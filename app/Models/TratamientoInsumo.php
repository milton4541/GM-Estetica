<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TratamientoInsumo extends Model
{
    protected $table = 'tratamiento_insumo';
    protected $primaryKey = 'id_tratamiento_insumo';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'id_tratamiento',
        'id_insumo',
    ];
}


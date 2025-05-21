<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $primaryKey = 'id_rol';
    protected $keyType = 'int';
    public $incrementing = true;
    protected $fillable = [
        'nombre_rol',
    ];
}

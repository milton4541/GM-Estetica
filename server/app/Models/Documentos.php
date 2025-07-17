<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Documentos extends Model
{
    protected $table = 'doc_trabajos';
    protected $primaryKey = 'doc_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nombre_doc',
        'url',
        'historial_id', 
        'doc_trabajo_guid',
        'eliminado',
    ];

    protected $casts = [
        'eliminado' => 'boolean',
    ];

    // Generar un GUID si no se asigna
    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (!$model->doc_trabajo_guid) {
                $model->doc_trabajo_guid = (string) Str::uuid();
            }
        });
    }


    public function historial()
    {
        return $this->belongsTo(Historial::class, 'historial_id', 'id_historial');
    }
}


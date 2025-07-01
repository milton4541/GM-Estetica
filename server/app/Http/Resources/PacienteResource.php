<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PacienteResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'           => $this->id_paciente,
            'dni'          => $this->dni_paciente,
            'nombre'       => $this->nombre,
            'apellido'     => $this->apellido,
            'email'        => $this->email,
            'telefono'     => $this->telefono,
            'obra_social'  => $this->obra_social,
            'created_at'   => $this->created_at->toDateTimeString(),
            'updated_at'   => $this->updated_at->toDateTimeString(),
        ];
    }
}
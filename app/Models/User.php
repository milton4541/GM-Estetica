<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements JWTSubject
{
    use Notifiable;

    // Si tu tabla no se llama "users", cámbialo aquí:
    protected $table = 'users';

    // Clave primaria personalizada
    protected $primaryKey = 'id_usuario';
    public $incrementing = true;
    protected $keyType = 'int';

    // Asignación masiva: estos campos podrán rellenarse vía create/update
    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'contrasena',
        'nombre_usuario',
        'id_rol',
    ];

    // Ocultar estos campos cuando serialices el modelo (p. ej. al devolver JSON)
    protected $hidden = [
        'contrasena',
    ];

    /**
     * Mutator: al asignar $user->contrasena = 'texto',
     * automáticamente se guardará como bcrypt('texto').
     */
    public function setContrasenaAttribute($value)
    {
        $this->attributes['contrasena'] = bcrypt($value);
    }

    /**
     * Relación: cada usuario pertenece a un rol.
     */
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id_rol');
    }

    public function getJWTIdentifier(){
        return $this->getKey();
    }
    public function getJWTCustomClaims(){
        return [];
    }
}

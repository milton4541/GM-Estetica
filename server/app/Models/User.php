<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject{
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
        'password',
        'nombre_usuario',
        'id_rol',
    ];

    // Ocultar estos campos cuando serialices el modelo (p. ej. al devolver JSON)
    protected $hidden = [
        'password',
    ];

    /**
     * Mutator: al asignar $user->password = 'texto',
     * automáticamente se guardará como bcrypt('texto').
     */
    // public function setPasswordAttribute($value)
    // {
    //     $this->attributes['password'] = bcrypt($value);
    // }

    /**
     * Relación: cada usuario pertenece a un rol.
     */
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id');
    }
    public function getAuthIdentifierName()
    {
        return 'nombre_usuario';
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}

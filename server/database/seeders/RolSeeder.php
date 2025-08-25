<?php

namespace Database\Seeders;
use Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('rols')->updateOrInsert(
            ['nombre_rol' => 'admin'],
            ['created_at' => now(), 'updated_at' => now()]
        );

        DB::table('rols')->updateOrInsert(
            ['nombre_rol' => 'secretario'],
            ['created_at' => now(), 'updated_at' => now()]
        );

        DB::table('rols')->updateOrInsert(
        ['nombre_rol' => 'empleado'],
            ['created_at' => now(), 'updated_at' => now()]
        );
        DB::table('users')->updateOrInsert(
    // Clave para evitar duplicados
    ['email' => 'admin@example.com'],
    // Datos a insertar/actualizar
    [
        'nombre'         => 'Admin',
        'apellido'       => 'Sistema',
        'nombre_usuario' => 'admin',
        'password'       => Hash::make('12345678'), 
        'id_rol'         => 1, 
        'bloqueado'      => false,
        'created_at'     => now(),
        'updated_at'     => now(),
    ]
);
    }
}


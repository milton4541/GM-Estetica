## 📄 Manual de Usuario – GM Estética

DESCRIPCIÓN
------------
GM Estética es un sistema de gestión para clínica estética desarrollado en Laravel
con base de datos SQL Server. Permite administrar pacientes, tratamientos, insumos,
turnos, facturas e historial, con gestión de usuarios y roles.

TECNOLOGÍAS UTILIZADAS
----------------------
Backend: Laravel 11 (PHP 8.3)
Base de datos: SQL Server
Autenticación: JWT
Documentación API: Swagger (l5-swagger)
Frontend: Vite + React / Blade
Servidor local: Laragon / XAMPP

REQUISITOS DEL SISTEMA
----------------------
- PHP >= 8.3
- Composer 2.x
- Node.js >= 18
- NPM >= 9
- SQL Server 2019+
- Extensión PHP: sqlsrv, pdo_sqlsrv
- Git (opcional, para clonar repositorio)

---

## Configuración de Entorno (.env)
```ini
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=sqlsrv
DB_HOST=localhost
DB_PORT=1433
DB_DATABASE=GM-Estetica
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_mail_user
MAIL_PASSWORD=tu_mail_pass
MAIL_FROM_ADDRESS="noreply@GMestetica.com"
MAIL_FROM_NAME="${APP_NAME}"

L5_SWAGGER_GENERATE_ALWAYS=true
JWT_SECRET=tu_jwt_secret

---
```bash
## Instalación Backend
- git clone https://github.com/usuario/GM-Estetica.git
- cd GM-Estetica/backend

- composer install
- npm install

# Configurar archivo .env
- php artisan key:generate
- php artisan migrate --seed

- php artisan serve
# URL: http://localhost:8000

## Instalación Frontend
- cd frontend
- npm install

# Crear archivo .env.local
# VITE_API_URL=http://localhost:8000/api

- npm run dev

## Roles y Permisos

- Administrador: Acceso total, gestiona usuarios y roles, accede a todos los módulos.

- Secretaria: Gestiona pacientes, turnos, facturas, historial y reportes.

- Empleado: Acceso limitado a tratamientos realizados y consulta de pacientes/insumos.

DOCUMENTACIÓN DE API
-------------------
Generar documentación con:
php artisan l5-swagger:generate
Acceder en navegador:
http://localhost:8000/api/documentation

MANTENIMIENTO
-------------
- Backup base de datos: exportar desde SQL Server
- Actualizar dependencias:
  composer update
  npm update
- Migraciones futuras:
  php artisan migrate
-------------

# Funciones del sistema
- 📘 [Manual de Usuario](manual-usuario.md)
1. INTRODUCCIÓN
- Guía paso a paso para usar GM Estética: registrar pacientes, cargar insumos,
  administrar tratamientos, turnos, facturas e historial.

-------------------
2. ACCESO AL SISTEMA
- Abrir navegador y acceder a URL del sistema.
- Ingresar usuario y contraseña.
- Presionar "Iniciar sesión".
- Recuperar contraseña si es necesario.

----------------------
3. MÓDULO DE PACIENTES
- Registrar paciente
- Editar paciente
- Eliminar o desactivar paciente

-------------------
4. MÓDULO DE INSUMOS
- Agregar nuevo insumo
- Editar insumo
- Eliminar insumo
- Reabastecer stock

-------------------------
5. MÓDULO DE TRATAMIENTOS
- Registrar tratamiento
- Asociar insumos
- Editar tratamiento
- Eliminar tratamiento

-------------------
6. MÓDULO DE TURNOS
- Crear turno
- Modificar o cancelar turno

---------------------
7. MÓDULO DE USUARIOS
- Agregar usuario
- Administrar roles
- Bloquear usuario
- Eliminar usuario

-------------------
8. ROLES Y PERMISOS
- Administrador: acceso total
- Secretaria: acceso a pacientes, turnos, facturas, historial y reportes
- Empleado: acceso limitado a tratamientos y consulta de datos

--------------------
9. MÓDULO DE FACTURAS
- Ver facturas
- Editar facturas
- Eliminar facturas

----------------------
10. MÓDULO DE HISTORIAL
- Filtrar historial por paciente o tratamiento
- Limpiar filtro
- Editar registro
- Eliminar registro

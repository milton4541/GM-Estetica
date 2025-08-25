# 📄 README + Manual de Usuario – GM Estética

## Descripción
GM Estética es un sistema de gestión para clínica estética desarrollado en **Laravel** con base de datos **SQL Server**. Permite administrar **pacientes, tratamientos, insumos, turnos, facturas e historial**, con **gestión de usuarios y roles**.

---

## Tabla de Contenidos
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Requisitos del sistema](#requisitos-del-sistema)
- [Configuración de Entorno (.env)](#configuración-de-entorno-env)
- [Instalación Backend](#instalación-backend)
- [Instalación Frontend](#instalación-frontend)
- [Roles y Permisos](#roles-y-permisos)
- [Documentación de API](#documentación-de-api)
- [Mantenimiento](#mantenimiento)
  - [Backups automáticos](#backups-automáticos)
  - [Restaurar BD desde .bak (SQL Server)](#restaurar-bd-desde-bak-sql-server)
- [Manual de Usuario](#manual-de-usuario)
  - [1. Introducción](#1-introducción)
  - [2. Acceso al sistema](#2-acceso-al-sistema)
  - [3. Módulo de Pacientes](#3-módulo-de-pacientes)
  - [4. Módulo de Insumos](#4-módulo-de-insumos)
  - [5. Módulo de Tratamientos](#5-módulo-de-tratamientos)
  - [6. Módulo de Turnos](#6-módulo-de-turnos)
  - [7. Módulo de Usuarios](#7-módulo-de-usuarios)
  - [8. Roles y Permisos](#8-roles-y-permisos)
  - [9. Módulo de Facturas](#9-módulo-de-facturas)
  - [10. Módulo de Historial](#10-módulo-de-historial)

---

## Tecnologías utilizadas
- **Backend:** Laravel 11 (PHP 8.3)  
- **Base de datos:** SQL Server  
- **Autenticación:** JWT  
- **Documentación API:** Swagger (l5-swagger)  
- **Frontend:** Vite + React / Blade  
- **Servidor local:** Laragon / XAMPP  

---

## Requisitos del sistema
- PHP >= 8.3  
- Composer 2.x  
- Node.js >= 18  
- NPM >= 9  
- SQL Server 2019+  
- Extensiones PHP: `sqlsrv`, `pdo_sqlsrv`  
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

## Mantenimiento
- Backups automáticos

- Frecuencia: 1 vez por semana

- Horario: Lunes a las 22:00

- Ubicación: C:\backups_sql

- Formato: .bak (backup completo de la BD)

- Recomendación: asegurarse de que el servicio SQL tenga permisos de escritura en la carpeta y que exista espacio suficiente en disco antes de la ejecución.

- Restaurar BD desde .bak (SQL Server)

- Ver archivos lógicos dentro del backup:

- RESTORE FILELISTONLY
- FROM DISK = 'C:\backups_sql\MiBase_YYYYMMDD.bak';


- Restaurar la base (ajustar nombres y rutas):

- RESTORE DATABASE MiBase
FROM DISK = 'C:\backups_sql\MiBase_YYYYMMDD.bak'
WITH
  MOVE 'MiBase_Data' TO 'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\MiBase.mdf',
  MOVE 'MiBase_Log'  TO 'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\MiBase_log.ldf',
  REPLACE,
  RECOVERY;


⚠️ Nota: REPLACE sobrescribe si la base ya existe.
Si querés restaurar backups diferenciales o de logs, usá NORECOVERY hasta el último y luego RECOVERY.

## Manual de Usuario
- 1. Introducción

Guía paso a paso para usar GM Estética: registrar pacientes, cargar insumos, administrar tratamientos, turnos, facturas e historial.

- 2. Acceso al sistema

Abrir navegador y acceder a la URL del sistema.

Ingresar usuario y contraseña.

Presionar Iniciar sesión.

Usar Recuperar contraseña si es necesario.

- 3. Módulo de Pacientes

Registrar paciente

Editar paciente

Eliminar o desactivar paciente

- 4. Módulo de Insumos

Agregar nuevo insumo

Editar insumo

Eliminar insumo

Reabastecer stock

- 5. Módulo de Tratamientos

Registrar tratamiento

Asociar insumos

Editar tratamiento

Eliminar tratamiento

- 6. Módulo de Turnos

Crear turno

Modificar o cancelar turno

- 7. Módulo de Usuarios

Agregar usuario

Administrar roles

Bloquear usuario

Eliminar usuario

- 8. Roles y Permisos

Administrador: acceso total

Secretaria: acceso a pacientes, turnos, facturas, historial y reportes

Empleado: acceso limitado a tratamientos y consulta de datos

- 9. Módulo de Facturas

Ver facturas

Editar facturas

Eliminar facturas

- 10. Módulo de Historial

Filtrar historial por paciente o tratamiento

Limpiar filtro

Editar registro

Eliminar registro


---
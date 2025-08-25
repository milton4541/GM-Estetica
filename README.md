# GM Estética

Sistema de gestión para clínica estética desarrollado en **Laravel** con base de datos **SQL Server**. Permite administrar **pacientes, tratamientos, insumos, turnos, facturas e historial**, con **gestión de usuarios y roles**.

> **Stack**: Laravel 11 (PHP 8.3) · SQL Server · JWT · Swagger (l5-swagger) · Vite + React/Blade · Laragon/XAMPP

---

## Tabla de Contenidos
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Configuración de Entorno](#configuración-de-entorno)
- [Instalación Backend](#instalación-backend)
- [Instalación Frontend](#instalación-frontend)
- [Roles y Permisos](#roles-y-permisos)
- [Documentación de API](#documentación-de-api)
- [Mantenimiento](#mantenimiento)
  - [Backups automáticos](#backups-automáticos)
  - [Restaurar BD desde .bak (SQL Server)](#restaurar-bd-desde-bak-sql-server)
- [Manual de Usuario](#manual-de-usuario)

---

## Tecnologías
- **Backend:** Laravel 11 (PHP 8.3)
- **Base de datos:** SQL Server
- **Autenticación:** JWT
- **Documentación API:** Swagger (l5-swagger)
- **Frontend:** Vite + React / Blade
- **Servidor local:** Laragon / XAMPP

## Requisitos
- PHP ≥ 8.3  
- Composer 2.x  
- Node.js ≥ 18 · NPM ≥ 9  
- SQL Server 2019+  
- Extensiones PHP: `sqlsrv`, `pdo_sqlsrv`  
- Git (opcional, para clonar)

---

## Configuración de Entorno

> **Importante:** No subas tu `.env` al repositorio. Usá un archivo como `.env.example` (ver abajo) y cada developer crea su `.env` local.

### `.env.example`
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
DB_USERNAME=your_user
DB_PASSWORD=your_password

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mail_user
MAIL_PASSWORD=your_mail_pass
MAIL_FROM_ADDRESS="noreply@gmestetica.local"
MAIL_FROM_NAME="${APP_NAME}"

L5_SWAGGER_GENERATE_ALWAYS=true
JWT_SECRET=change_me

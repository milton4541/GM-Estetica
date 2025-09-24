# 📘 Sistema de Gestión para GM Clínica Estética  
## Manual de Usuario

---

## 1. Introducción
Este manual tiene como objetivo guiar al usuario en el uso del sistema de gestión, explicando de manera clara y sencilla cómo realizar las operaciones más comunes: registrar pacientes y usuarios, administrar tratamientos, insumos, turnos, facturas y generar reportes.  

El sistema ha sido diseñado para optimizar el trabajo administrativo de una clínica estética, reduciendo errores y mejorando la organización de la información.

### Roles y permisos de usuario
El sistema cuenta con un esquema de roles que determina qué acciones puede realizar cada usuario y qué módulos estarán disponibles en la barra lateral una vez inicie sesión.  

- **Administrador**  
  Tiene acceso completo a todos los módulos y funciones del sistema. Puede crear, editar, bloquear y eliminar usuarios, administrar roles, configurar el sistema y acceder a todos los reportes.

- **Secretaria**  
  Tiene acceso a los módulos de Pacientes, Turnos, Facturas, Historial y Reportes. Puede registrar, editar y eliminar información en esos módulos, pero no puede modificar configuraciones del sistema ni gestionar usuarios.

- **Empleado**  
  Tiene acceso limitado según las tareas asignadas. Puede visualizar y registrar tratamientos realizados, ver información de pacientes y consultar reportes básicos, pero no puede modificar datos de otros usuarios ni acceder a la configuración avanzada.

💡 La visibilidad de cada módulo en el menú y la disponibilidad de acciones están controladas automáticamente por el sistema según el rol asignado al usuario.

---

## 2. Requisitos para utilizar el sistema
- Navegador recomendado: **Google Chrome** o **Microsoft Edge** (última versión).  
- Conexión a internet estable.  
- Usuario y contraseña provistos por el administrador del sistema.  

---

## 3. Acceso al sistema
1. Abra el navegador web.  
2. Ingrese la dirección del sistema en la barra de direcciones.  
3. Escriba su usuario y contraseña en los campos correspondientes.  
4. Presione **Iniciar Sesión**.  

---

## 4. Módulo de Pacientes

### 4.1 Registrar un paciente
1. Diríjase al menú lateral y seleccione **Pacientes**.  
2. Presione el botón **Agregar Paciente**.  
3. Complete los campos requeridos: DNI, nombre, apellido, teléfono, correo electrónico y obra social.  
4. Haga clic en **Agregar Paciente**.  

### 4.2 Editar datos de un paciente
1. En el listado de pacientes, ubique al paciente que desea modificar.  
2. Haga clic en el ícono **Editar**.  
3. Cambie la información necesaria.  
4. Presione **Guardar cambios**.  

### 4.3 Eliminar un paciente
1. Localice al paciente en el listado.  
2. Haga clic en el ícono **Eliminar**.  
3. Confirme la acción.  

---

## 5. Módulo de Insumos

### 5.1 Cargar un nuevo insumo
1. Seleccione **Insumos** en el menú lateral.  
2. Presione **Agregar Insumo**.  
3. Complete los datos: componentes, nombre, precio, cantidad inicial, cantidad mínima y fecha de expiración.  
4. Guarde la información.  

### 5.2 Editar un insumo existente
1. Ubique el insumo en la lista.  
2. Haga clic en el ícono **Editar**.  
3. Modifique los datos necesarios.  
4. Guarde los cambios.  

### 5.3 Eliminar un insumo
1. Seleccione el insumo en la lista.  
2. Presione **Eliminar**.  
3. Confirme la acción.  

### 5.4 Reabastecer stock
1. En la sección de insumos, elija el insumo a reponer.  
2. Indique la cantidad a sumar al stock actual.  
3. Presione el botón **Reestock**.  
4. Guarde los cambios.  

---

## 6. Módulo de Tratamientos

### 6.1 Registrar un tratamiento
1. Seleccione **Tratamientos** en el menú lateral.  
2. Presione **Agregar Tratamiento**.  
3. Complete los campos: nombre, descripción, precio, duración e insumos que utiliza.  
4. Guarde el tratamiento.  

### 6.2 Asociar insumos a un tratamiento
1. Dentro del tratamiento, busque la sección **Insumos**.  
2. Seleccione los insumos y cantidades necesarias para el tratamiento.  
3. Guarde los cambios.  

### 6.3 Editar un tratamiento
1. Ubique el tratamiento en la lista.  
2. Presione el ícono **Editar**.  
3. Modifique los datos.  
4. Guarde los cambios.  

### 6.4 Eliminar un tratamiento
1. Busque el tratamiento en la lista.  
2. Presione el ícono **Eliminar**.  
3. Confirme la acción.  

---

## 7. Módulo de Turnos

### 7.1 Crear un turno
1. Ingrese a **Turnos**.  
2. Presione en el calendario el día y el horario de inicio del turno.  
3. Seleccione el paciente y tratamiento a realizar (el sistema calculará automáticamente la duración de la cita).  
4. Guarde la información.  

### 7.2 Modificar o cancelar un turno
1. Localice el turno en el calendario y selecciónelo.  
2. Presione **Editar** para modificar o **Cancelar** para anularlo.  

---

## 8. Módulo de Reportes

### 8.1 Generar un reporte
1. Seleccione **Reportes** en el menú lateral.  
2. Elija el tipo de reporte (por ingresos totales, ingresos mensuales o ingresos por tratamiento).  
3. Seleccione el rango de fechas y demás filtros según corresponda.  
4. Presione **Descargar PDF**.  

---

## 9. Módulo de Facturas

### 9.1 Ver facturas
1. Seleccione **Facturas** en el menú lateral.  
2. Visualice el listado de facturas con su código, importe, descuento (si aplica), importe total, paciente, tratamiento y fecha.  

### 9.2 Editar una factura
1. Ubique la factura en el listado.  
2. Presione el ícono **Editar**.  
3. Realice las modificaciones necesarias.  
4. Guarde los cambios.  

### 9.3 Eliminar una factura
1. Localice la factura que desea eliminar.  
2. Presione **Eliminar**.  
3. Confirme la acción.  

---

## 10. Módulo de Historial

### 10.1 Filtrar historial
1. Presione el botón de **Filtro**.  
2. Elija si desea filtrar por **Tratamiento** o **Paciente**.  
3. Seleccione el paciente o tratamiento correspondiente.  
4. Visualice los resultados filtrados.  

### 10.2 Limpiar filtro
1. Presione el botón **Limpiar filtro**.  
2. El historial volverá a mostrar todos los registros sin filtros.  

### 10.3 Editar un registro de historial
1. Localice el registro que desea modificar.  
2. Presione el ícono **Editar**.  
3. Realice los cambios necesarios.  
4. Guarde los cambios.  

### 10.4 Eliminar un registro de historial
1. Ubique el registro en el listado.  
2. Presione el ícono **Eliminar**.  
3. Confirme la acción.  

---

## 11. Módulo de Usuarios

### 11.1 Agregar un usuario
1. Seleccione **Usuarios** en el menú lateral.  
2. Presione **Agregar Usuario**.  
3. Complete los datos solicitados: nombre, apellido, usuario, correo electrónico, contraseña y rol.  
4. Guarde los cambios.  

### 11.2 Administrar roles de usuario
1. Localice el usuario que desea modificar.  
2. Presione **Editar**.  
3. Seleccione el nuevo rol (Administrador, Secretaria o Empleado).  
4. Guarde los cambios.  

### 11.3 Bloquear un usuario
1. Busque el usuario en la lista.  
2. Presione **Bloquear**.  
3. Confirme la acción.  

💡 Un usuario bloqueado no podrá iniciar sesión hasta ser desbloqueado.  

### 11.4 Eliminar un usuario
1. Localice el usuario en el listado.  
2. Presione **Eliminar**.  
3. Confirme la acción.  

---

## 12. Cierre de sesión
1. Seleccione **Cerrar sesión** en el menú lateral.  
2. Confirme la acción.  

💡 Cerrar sesión evita el acceso no autorizado a su cuenta.  

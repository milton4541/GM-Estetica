<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rendimiento por Tratamiento</title>
    <style>
        /* Importa la fuente Roboto desde Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        /* Estilos generales del cuerpo de la página */
        body {
            font-family: 'Roboto', sans-serif;
            background: #f9fafb;
            color: #333;
            margin: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* Estilos para el título principal */
        h1 {
            color: #2c3e50;
            font-weight: 700;
            margin-bottom: 30px; /* Ajustado el margen para compensar la eliminación del filtro */
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        /* Estilos para la tabla */
        table {
            width: 80%;
            border-collapse: separate;
            border-spacing: 0 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            background: white;
            border-radius: 10px;
            overflow: hidden;
        }

        /* Estilos para la cabecera de la tabla */
        thead tr {
            background: #34495e;
            color: white;
            text-transform: uppercase;
            font-size: 14px;
        }

        /* Estilos para las celdas de la cabecera y el cuerpo */
        th, td {
            padding: 14px 20px;
            text-align: left;
        }

        /* Estilos para las filas del cuerpo de la tabla */
        tbody tr {
            background: #fff;
            transition: background-color 0.3s ease;
            cursor: default;
        }

        /* Efecto de hover en las filas */
        tbody tr:hover {
            background-color: #ecf0f1;
        }

        /* Estilos para la primera celda de cada fila (el tratamiento) */
        tbody tr td:first-child {
            font-weight: 600;
            color: #2c3e50;
        }

        /* Estilos para la última celda de cada fila (el ingreso total) */
        tbody tr td:last-child {
            font-weight: 700;
            color: #27ae60;
            text-align: right;
        }
    </style>
</head>
<body>
    <h1>Rendimiento por Tratamiento</h1>

    <!-- Tabla de rendimiento -->
    <table>
        <thead>
            <tr>
                <th>Tratamiento</th>
                <th>Ingreso Total</th>
            </tr>
        </thead>
        <tbody id="tablaRendimiento">
            <!-- Bucle para mostrar los datos del rendimiento -->
            @foreach($rendimiento as $item)
                <tr>
                    <td>{{ $item->tratamiento }}</td>
                    <td>${{ number_format($item->ingreso_total, 2, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

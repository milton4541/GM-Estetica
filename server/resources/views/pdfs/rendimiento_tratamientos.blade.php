<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Rendimiento por Tratamiento</title>
    <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 5px; }
        th { background: #eee; }
    </style>
</head>
<body>
    <h1>Rendimiento por Tratamiento</h1>
    <table>
        <thead>
            <tr>
                <th>Tratamiento</th>
                <th>Ingreso Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rendimiento as $item)
                <tr>
                    <td>{{ $item->tratamiento }}</td>
                    <td>${{ number_format($item->ingreso_total, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

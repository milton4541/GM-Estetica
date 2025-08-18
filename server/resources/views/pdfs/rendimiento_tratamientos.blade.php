<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Rendimiento por Tratamiento</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1 { text-align: center; }
    </style>
</head>
<body>
    <h1>Rendimiento por Tratamiento</h1>
    <table>
        <thead>
            <tr>
                <th>Tratamiento</th>
                <th>Ingreso Total ($)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rendimiento as $item)
                <tr>
                    <td>{{ $item->tratamiento }}</td>
                    <td>{{ number_format($item->ingreso_total, 2, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
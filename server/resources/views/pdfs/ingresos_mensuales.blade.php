<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte de Ingresos Mensuales</title>
    <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1 { text-align: center; }
    </style>
</head>
<body>
    <h1>Reporte de Ingresos Mensuales</h1>

    <table>
        <thead>
            <tr>
                <th>Mes</th>
                <th>Total ($)</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($ingresos as $item)
                <tr>
                    <td>{{ $item->mes }}</td>
                    <td>{{ number_format($item->total, 2, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

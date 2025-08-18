<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte de Ingresos Totales</title>
    <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1, h3 { text-align: center; }
        .info { margin-top: 10px; text-align: center; }
    </style>
</head>
<body>
    <h1>Reporte de Ingresos Totales</h1>
    <h3>Rango de Fechas: {{ $fechaInicio }} a {{ $fechaFin }}</h3>

    <div class="info">
        <strong>Total de Ingresos:</strong> ${{ number_format($total, 2, ',', '.') }}
    </div>
</body>
</html>
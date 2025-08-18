<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
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
    <div class="header">
        <h1>Reporte de Ingresos Mensuales</h1>
        <h3>Generado el {{ now()->format('d/m/Y H:i') }}</h3>
        @if(request()->filled('mes'))
            <div class="filters">Mes filtrado: {{ request('mes') }}</div>
        @else
            <div class="filters">Mostrando todos los meses</div>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>Mes</th>
                <th>Total ($)</th>
            </tr>
        </thead>
        <tbody>
            @php $sumaTotal = 0; @endphp
            @foreach ($ingresos as $item)
                @php $sumaTotal += $item->total; @endphp
                <tr>
                    <td>{{ $item->mes }}</td>
                    <td>{{ number_format($item->total, 2, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td>Total General</td>
                <td>{{ number_format($sumaTotal, 2, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>
</body>
</html>
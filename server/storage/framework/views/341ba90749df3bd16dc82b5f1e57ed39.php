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
    <h3>Rango de Fechas: <?php echo e($fechaInicio); ?> a <?php echo e($fechaFin); ?></h3>

    <div class="info">
        <strong>Total de Ingresos:</strong> $<?php echo e(number_format($total, 2, ',', '.')); ?>

    </div>
</body>
</html><?php /**PATH C:\laragon\www\GM-Estetica\server\resources\views/pdfs/ingresos_totales.blade.php ENDPATH**/ ?>
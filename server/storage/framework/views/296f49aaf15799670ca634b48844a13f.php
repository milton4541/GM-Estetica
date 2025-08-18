<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte de Ingresos Mensuales</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 14px; }
        h1, h3 { text-align: center; margin: 0; }
        .header { text-align: center; margin-bottom: 20px; }
        .filters { margin-top: 10px; font-size: 12px; color: #555; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tfoot td { font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Reporte de Ingresos Mensuales</h1>
        <h3>Generado el <?php echo e(now()->format('d/m/Y H:i')); ?></h3>
        <?php if(request()->filled('mes')): ?>
            <div class="filters">Mes filtrado: <?php echo e(request('mes')); ?></div>
        <?php else: ?>
            <div class="filters">Mostrando todos los meses</div>
        <?php endif; ?>
    </div>

    <table>
        <thead>
            <tr>
                <th>Mes</th>
                <th>Total ($)</th>
            </tr>
        </thead>
        <tbody>
            <?php $sumaTotal = 0; ?>
            <?php $__currentLoopData = $ingresos; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <?php $sumaTotal += $item->total; ?>
                <tr>
                    <td><?php echo e($item->mes); ?></td>
                    <td><?php echo e(number_format($item->total, 2, ',', '.')); ?></td>
                </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
        <tfoot>
            <tr>
                <td>Total General</td>
                <td><?php echo e(number_format($sumaTotal, 2, ',', '.')); ?></td>
            </tr>
        </tfoot>
    </table>
</body>
</html><?php /**PATH C:\laragon\www\GM-Estetica\server\resources\views/pdfs/ingresos_mensuales.blade.php ENDPATH**/ ?>
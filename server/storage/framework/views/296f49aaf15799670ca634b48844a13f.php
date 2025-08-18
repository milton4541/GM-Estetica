<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <title>Reporte de Ingresos Mensuales</title>
    <style>
<<<<<<< HEAD
        body { font-family: Arial, sans-serif; font-size: 14px; }
        h1, h3 { text-align: center; margin: 0; }
        .header { text-align: center; margin-bottom: 20px; }
        .filters { margin-top: 10px; font-size: 12px; color: #555; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tfoot td { font-weight: bold; }
=======
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
            background: #f9fafb;
            color: #333;
            margin: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        h1 {
            color: #2c3e50;
            font-weight: 700;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        table {
            width: 80%;
            border-collapse: separate;
            border-spacing: 0 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            background: white;
            border-radius: 10px;
            overflow: hidden;
        }

        thead tr {
            background: #34495e;
            color: white;
            text-transform: uppercase;
            font-size: 14px;
        }

        th, td {
            padding: 14px 20px;
            text-align: left;
        }

        tbody tr {
            background: #fff;
            transition: background-color 0.3s ease;
            cursor: default;
        }

        tbody tr:hover {
            background-color: #ecf0f1;
        }

        tbody tr td:first-child {
            font-weight: 600;
            color: #2c3e50;
        }

        tbody tr td:last-child {
            font-weight: 700;
            color: #27ae60;
            text-align: right;
        }
>>>>>>> 2271495ff0da42df6479760c9b5a73dbcc822eb8
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
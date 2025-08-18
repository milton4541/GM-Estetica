<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <title>Reporte de Ingresos Mensuales</title>
    <style>
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
            <?php $__currentLoopData = $ingresos; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <tr>
                    <td><?php echo e($item->mes); ?></td>
                    <td><?php echo e(number_format($item->total, 2, ',', '.')); ?></td>
                </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
    </table>
</body>
</html>
<?php /**PATH C:\laragon\www\GM-Estetica\server\resources\views/pdfs/ingresos_mensuales.blade.php ENDPATH**/ ?>
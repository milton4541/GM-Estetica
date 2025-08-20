<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rendimiento por Tratamiento</title>
    <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 5px; }
        th { background: #eee; }
    </style>
</head>
<body>
    <h1>Rendimiento por Tratamiento</h1>

    <!-- Tabla de rendimiento -->
    <table>
        <thead>
            <tr>
                <th>Tratamiento</th>
                <th>Ingreso Total ($)</th>
            </tr>
        </thead>
        <tbody id="tablaRendimiento">
            <!-- Bucle para mostrar los datos del rendimiento -->
            <?php $__currentLoopData = $rendimiento; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <tr>
                    <td><?php echo e($item->tratamiento); ?></td>
                    <td>$<?php echo e(number_format($item->ingreso_total, 2)); ?></td>
                </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
    </table>
</body>
</html><?php /**PATH C:\laragon\www\GM-Estetica\server\resources\views/pdfs/rendimiento_tratamientos.blade.php ENDPATH**/ ?>
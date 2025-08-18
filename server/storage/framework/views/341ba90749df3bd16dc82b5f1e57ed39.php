<!DOCTYPE html>
<html>
<head>
<<<<<<< HEAD
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

=======
    <meta charset="UTF-8" />
    <title>Ingresos Totales</title>
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
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .total-box {
            width: 80%;
            max-width: 400px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 20px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 18px;
        }
        
        .total-label {
            font-weight: 600;
            color: #2c3e50;
        }
        
        .total-amount {
            font-weight: 700;
            color: #27ae60;
        }
    </style>
</head>
<body>
    <h1>Ingresos Totales</h1>
    <div class="total-box">
        <span class="total-label">Total:</span>
        <span class="total-amount">$<?php echo e(number_format($total, 2, ',', '.')); ?></span>
>>>>>>> 2271495ff0da42df6479760c9b5a73dbcc822eb8
    </div>
</body>
</html><?php /**PATH C:\laragon\www\GM-Estetica\server\resources\views/pdfs/ingresos_totales.blade.php ENDPATH**/ ?>
<!DOCTYPE html>
<html lang="es">
<head>
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
    </div>
</body>
</html><?php /**PATH C:\laragon\www\GM-Estetica\server\resources\views/pdfs/ingresos_totales.blade.php ENDPATH**/ ?>
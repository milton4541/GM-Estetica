<?php $__env->startComponent('mail::message'); ?>
# Factura n.º <?php echo e($factura->id); ?>


**Paciente:** <?php echo e($paciente->nombre); ?>  
**Tratamiento:** <?php echo e($tratamiento->descripcion); ?>  

| Concepto               | Valor        |
|------------------------|--------------|
| Importe                | $<?php echo e(number_format($factura->importe, 2)); ?>         |
| Descuento (precio)     | $<?php echo e(number_format($factura->descuento_precio, 2)); ?>|
| Descuento (%)          | <?php echo e($factura->descuento_porcentaje); ?>%              |
| **Importe final**      | **$<?php echo e(number_format($factura->importe_final, 2)); ?>**|

<?php $__env->startComponent('mail::button', ['url' => url('/facturas/'.$factura->id)]); ?>
Ver factura en el sistema
<?php echo $__env->renderComponent(); ?>

Gracias por su confianza,  
<?php echo e(config('app.name')); ?>

<?php echo $__env->renderComponent(); ?>
<?php /**PATH C:\laragon\www\Taller\server\resources\views/emails/factura.blade.php ENDPATH**/ ?>
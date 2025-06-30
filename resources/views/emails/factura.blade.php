@component('mail::message')
# Factura n.º {{ $factura->id }}

**Paciente:** {{ $paciente->nombre }}  
**Tratamiento:** {{ $tratamiento->descripcion }}  

| Concepto               | Valor        |
|------------------------|--------------|
| Importe                | ${{ number_format($factura->importe, 2) }}         |
| Descuento (precio)     | ${{ number_format($factura->descuento_precio, 2) }}|
| Descuento (%)          | {{ $factura->descuento_porcentaje }}%              |
| **Importe final**      | **${{ number_format($factura->importe_final, 2) }}**|

@component('mail::button', ['url' => url('/facturas/'.$factura->id)])
Ver factura en el sistema
@endcomponent

Gracias por su confianza,  
{{ config('app.name') }}
@endcomponent

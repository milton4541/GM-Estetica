export interface Factura {
  importe: number;
  descuento_precio?: number | null;
  descuento_porcentaje?: number | null;
  importe_final: number;
  id_paciente: number;
  id_tratamiento: number;
  created_at: Date
}

export type facturaWithId = Factura &{factura_id: number}

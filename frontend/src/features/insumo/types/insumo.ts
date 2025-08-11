export type Insumo = {
    componentes: string,
    precio_insumo: number,
    cantidad: number,
    cantidad_min: number,
    nombre: string,
    fecha_expiracion: string
}
export type ReestockPayload = {
  id_insumo: number;
  cantidad: number; 
};
export type insumoWithId = Insumo &{id_insumo: number}

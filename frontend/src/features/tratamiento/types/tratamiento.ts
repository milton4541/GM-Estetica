import type { insumoWithId } from "../../insumo/types/insumo"

export type Tratamiento = {
    descripcion: string,
    duracion: number,
    precio: number,
    insumo: insumoWithId[]
}

export type TratamientoWithId = Tratamiento & {id_tratamiento: number}

export type DetalleTratamientoInsumo = {
  id_tratamiento: number;
  id_insumos: [number];
  cantidad: number;
};

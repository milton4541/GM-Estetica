export type Tratamiento = {
    descripcion: string,
    duracion: number,
    precio: number,
}

export type TratamientoWithId = Tratamiento & {id_tratamiento: number}
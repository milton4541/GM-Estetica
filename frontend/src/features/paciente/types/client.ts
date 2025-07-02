export type Pacient = {
    dni_paciente: string,
    nombre: string,
    apellido: string,
    email: string,
    telefono: string,
    obra_social: string
}

export type PacientWithId = Pacient & {id: number}
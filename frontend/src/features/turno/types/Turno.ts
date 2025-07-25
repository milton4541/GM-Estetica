import type { PacientWithId } from "../../paciente/types/pacient";
import type { TratamientoWithId } from "../../tratamiento/types/tratamiento";


export interface Turno {
  id_turno: number;
  fecha: string;               // formato "YYYY-MM-DD"
  hora: string;                // formato "HH:mm"
  tratamiento: TratamientoWithId;
  paciente: PacientWithId;
  finalizado: boolean;
}

export type NewTurno = {
  fecha: string;
  hora: string;
  id_tratamiento: number[];
  id_paciente: number;
};
export interface UpdateTurno {
  id_turno: number;
  fecha: string;             
  hora: string;              
  id_tratamiento: number;    // un único tratamiento
  id_paciente: number;
}
export interface FinalizePayload {
  documento?: File | null;
}
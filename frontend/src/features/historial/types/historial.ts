// 1. El paciente asociado a un historial
export interface Paciente {
  id_paciente: number;
  nombre: string;
  apellido: string;
}

// 2. El tratamiento asociado a un historial
export interface Tratamiento {
  id_tratamiento: number;
  descripcion: string;
  precio: number
}

// 3. Un único registro de historial
export interface HistorialItem {
  id_historial: number;
  paciente: Paciente;
  tratamiento: Tratamiento;
  created_at: string;   
  updated_at: string;   
}
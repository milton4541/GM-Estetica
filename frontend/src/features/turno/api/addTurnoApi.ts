import api from "../../../utils/axios";
import type { NewTurno, Turno } from "../types/Turno";

const API_URL = "/turnos";

export const addTurnoAPI = async (turno: NewTurno): Promise<Turno> => {
  const token = localStorage.getItem("authToken");
  const response = await api.post(API_URL, turno, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Asegurarse de devolver el primer turno creado si la API devuelve un array
  const createdTurno = Array.isArray(response.data.data)
    ? response.data.data[0]
    : response.data.data;

  // Forzar finalizado en false para evitar inconsistencias
  createdTurno.finalizado = false;

  return createdTurno;
};

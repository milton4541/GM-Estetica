// src/features/turnos/api/editTurnoApi.ts
import axios from "axios";
import { format, parseISO } from "date-fns";
import type { UpdateTurno } from "../types/Turno";
import api from "../../../utils/axios";

const API_URL = "/turnos";

export const editTurnoAPI = async (
  turnoData: UpdateTurno
): Promise<UpdateTurno> => {
  try {
    const token = localStorage.getItem("authToken");

    // 1️⃣ Formateamos la fecha a dd/MM/yyyy
    const formattedDate = format(parseISO(turnoData.fecha), "dd/MM/yyyy");

    // 2️⃣ Creamos un payload inmutable
    const payload = {
      ...turnoData,
      fecha: formattedDate,
    };

    // 3️⃣ Hacemos PATCH a /turnos/{id}
    const response = await api.patch<UpdateTurno>(
      `${API_URL}/${turnoData.id_turno}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 4️⃣ Devolvemos el turno actualizado (según tu API)
    return response.data;
  } catch (error) {
    console.error("Error al editar Turno:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Error al editar turno");
    } else {
      throw new Error("Ocurrió un error inesperado");
    }
  }
};

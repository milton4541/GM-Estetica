import axios from "axios";
import type { FinalizePayload } from "../types/Turno";
import api from "../../../utils/axios";

const TURNO_API_URL = "/turnos";

export const finalizeTurnoAPI = async (
  id_turno: number,
  payload: FinalizePayload
): Promise<void> => {
  try {
    console.log("Finalizing turno:", id_turno, payload);
    const token = localStorage.getItem("authToken");
    const form = new FormData();
    if (payload.documento) {
      form.append("documento", payload.documento);
    }
    form.append("stock_usado", String(payload.stock_usado));
    form.append("descuento_precio", String(payload.descuento_precio));
    form.append("descuento_porcentaje", String(payload.descuento_porcentaje));

    await api.post(
      `${TURNO_API_URL}/${id_turno}/finalizar`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error finalizing turno:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to finalize turno");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

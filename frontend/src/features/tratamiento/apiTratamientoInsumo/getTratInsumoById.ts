import axios from "axios";
import api from "../../../utils/axios";
import type { DetalleTratamientoInsumo } from "../types/tratamiento";

const API_URL_INSUMO = "/tratamiento-insumo";

export const getInsumoTratamientoApi = async (
  id: number
): Promise<DetalleTratamientoInsumo> => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await api.get<DetalleTratamientoInsumo>(
      `${API_URL_INSUMO}/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data)
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener detalle de insumo del tratamiento:", error);
    if (axios.isAxiosError(error)) {
      // si tu backend devuelve { message, ... } en error 4xx/5xx
      const msg = error.response?.data?.message;
      throw new Error(msg || "No se pudo obtener el detalle del insumo");
    }
    throw new Error("Ocurrió un error inesperado");
  }
};

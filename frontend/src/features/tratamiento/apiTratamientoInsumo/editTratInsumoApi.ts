import axios from "axios";
import api from "../../../utils/axios";
import type { DetalleTratamientoInsumo } from "../types/tratamiento";

const API_URL_INSUMO = "/tratamiento-insumo";

export const editTratInsumoApi = async (
  idTratamiento: number,
  idInsumos: number[],
  cantidad: number
): Promise<DetalleTratamientoInsumo[]> => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await api.patch<{ data: DetalleTratamientoInsumo[] }>(
      `${API_URL_INSUMO}/${idTratamiento}`,
      {
        id_insumo: idInsumos,    // ← aquí la clave correcta
        cantidad:  cantidad      // ← clave correcta también
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar insumos del tratamiento:", error);
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message;
      throw new Error(msg || "No se pudo actualizar los insumos del tratamiento");
    }
    throw new Error("Ocurrió un error inesperado");
  }
};
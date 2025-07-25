import axios from "axios";
import api from "../../../utils/axios";
import type { DetalleTratamientoInsumo } from "../types/tratamiento";
const API_URL_ADD_INSUMO = "/tratamiento-insumo";

export const addInsumoATratamientoApi = async (
  detalle: DetalleTratamientoInsumo
): Promise<DetalleTratamientoInsumo> => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await api.post(
      API_URL_ADD_INSUMO,
      detalle,  
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al agregar insumo al tratamiento:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "No se pudo agregar el insumo al tratamiento"
      );
    } else {
      throw new Error("Ocurrió un error inesperado");
    }
  }
};

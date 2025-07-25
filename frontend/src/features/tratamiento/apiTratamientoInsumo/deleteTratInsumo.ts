import axios from "axios";
import api from "../../../utils/axios";

const API_URL_TRATAMIENTOS = "/tratamiento-insumo";

export const deleteTratInsumoApi = async (
  idTratamiento: number
): Promise<void> => {
  try {
    const token = localStorage.getItem("authToken");
    await api.delete(
      `${API_URL_TRATAMIENTOS}/${idTratamiento}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error al eliminar tratamiento:", error);
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message;
      throw new Error(msg || "No se pudo eliminar el tratamiento");
    }
    throw new Error("Ocurrió un error inesperado");
  }
};

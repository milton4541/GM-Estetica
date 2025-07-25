import axios from "axios";
import api from "../../../utils/axios";

const API_URL = "/documentos";

export async function createDoc(
  archivo: File,
  historialId?: number   // ← ahora opcional
): Promise<void> {
  if (!archivo) {
    throw new Error("Debe proporcionar un archivo.");
  }
  if (archivo.size > 5 * 1024 * 1024) {
    throw new Error("El archivo no puede superar los 5 MB.");
  }

  const form = new FormData();
  form.append("archivo", archivo);

  // Sólo añadimos el ID si fue proporcionado
  if (historialId !== undefined) {
    form.append("historial_id", String(historialId));
  }

  try {
    const token = localStorage.getItem("authToken");
    await api.post(API_URL, form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      transformRequest: (data, headers) => {      
      delete headers["Content-Type"];
      return data;
    },
    });
  } catch (error) {
    console.error("Error subiendo documento:", error);
    if (axios.isAxiosError(error)) {
      const msg =
        (error.response?.data)?.message ||
        "Error al subir el archivo.";
      throw new Error(msg);
    }
    throw new Error("Ocurrió un error inesperado.");
  }
}

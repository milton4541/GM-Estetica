import axios from "axios";
import api from "../../../utils/axios";

const API_URL = "/documentos";

export async function createDoc(archivo: File, tratamientoId: number): Promise<void> {
  if (!archivo) {
    throw new Error("Debe proporcionar un archivo.");
  }
  if (archivo.size > 5 * 1024 * 1024) {
    throw new Error("El archivo no puede superar los 5 MB.");
  }

  const form = new FormData();
  form.append("archivo", archivo);
  form.append("tratamiento_id", String(tratamientoId));

  try {
    const token = localStorage.getItem("authToken");
    await api.post(API_URL, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
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

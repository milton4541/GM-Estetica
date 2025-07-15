import axios from "axios";
import api from "../../../utils/axios";

const TURNO_API_URL = "/turnos";

export const finaliceTurnoAPI = async (
  id_turno: number,
): Promise<void> => {
  try {
    console.log("Finalizing turno:", id_turno);
    const token = localStorage.getItem("authToken");
    await api.post(
      `${TURNO_API_URL}/${id_turno}/finalizar`,
      id_turno,
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

import type { Turno } from "../types/Turno";
import api from "../../../utils/axios";
const API_URL = "/turnos";
export const getTurnos = async (): Promise<Turno[]> => {
    try{
        const token = localStorage.getItem('authToken');
        const response = await api.get(
            API_URL,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data.data;
    } catch (error) {
    console.error("Error al obtener los tratamientos:", error);
    throw error;
  }
}
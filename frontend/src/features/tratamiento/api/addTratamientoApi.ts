import axios from "axios";
import api from "../../../utils/axios";
import type { Tratamiento, TratamientoWithId } from "../types/tratamiento";

const API_URL_NEW_CLIENT = '/tratamientos';

export const addTratamientoApi = async (tratamientoData: Tratamiento): Promise<TratamientoWithId> => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await api.post(
            API_URL_NEW_CLIENT,
            tratamientoData, // <-- Envía los datos al cuerpo de la solicitud
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log("Respuesta de la API:", response.data); // <-- Verifica la respuesta
        return response.data.data
    } catch (error) {
        console.error("Error creating new tratamiento:", error);
        // Lanza un error con un mensaje más descriptivo
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create new tratamiento");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
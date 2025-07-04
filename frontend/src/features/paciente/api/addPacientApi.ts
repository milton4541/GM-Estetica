import axios from "axios";
import type { Pacient } from "../types/pacient";
import api from "../../../utils/axios";

const API_URL_NEW_CLIENT = '/pacientes';



export const addPacientApi = async (pacientData: Pacient): Promise<Pacient> => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await api.post(
            API_URL_NEW_CLIENT,
            pacientData, // <-- Envía los datos al cuerpo de la solicitud
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log("Respuesta de la API:", response.data); // <-- Verifica la respuesta
        return response.data
    } catch (error) {
        console.error("Error creating new client:", error);
        // Lanza un error con un mensaje más descriptivo
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create new client");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
import axios from "axios";
import api from "../../../utils/axios";
import type { Insumo } from "../types/insumo";

const API_URL_NEW_CLIENT = '/insumos';



export const addInsumoApi = async (insumoData: Insumo): Promise<Insumo> => {
    try {
        const token = localStorage.getItem('authToken');
                console.log("Respuesta de la API:", insumoData); // 
        const response = await api.post(
            API_URL_NEW_CLIENT,
            insumoData, 
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log("Respuesta de la API:", response.data); // 
        return response.data
    } catch (error) {
        console.error("Error creating new Insumo:", error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create new Insumo");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
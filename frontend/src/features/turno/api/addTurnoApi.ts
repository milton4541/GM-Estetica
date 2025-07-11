import axios from "axios";
import type { NewTurno } from "../types/Turno";
import api from "../../../utils/axios";

const TURNO_API_URL = '/turnos';

export const addTurnoAPI = async (newTurnoData: NewTurno): Promise<void> => {
    try{
        console.log("Adding turno:", newTurnoData);
        const token = localStorage.getItem('authToken');
        await api.post(
            TURNO_API_URL,
            newTurnoData,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            }
        );
    }catch(error){
        console.error("Error adding turno:", error);
        if (axios.isAxiosError(error)){
            throw new Error(error.response?.data?.message || "Failed to add turno");
        }else{
            throw new Error("An unexpected error occurred");
        }
    }
}
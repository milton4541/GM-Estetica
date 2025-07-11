import axios from "axios";
import api from "../../../utils/axios";

const API_URL = '/turnos/';

export const deleteTurnoAPI = async (id: number): Promise<void> => {
    try {
        const token = localStorage.getItem('authToken');
        await api.delete(
            API_URL+`${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        console.error("Error deleting Turno:", error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete Turno");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
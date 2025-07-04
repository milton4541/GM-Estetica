import axios from "axios";
import api from "../../../utils/axios";

const API_URL_NEW_CLIENT = '/pacientes/';

export const deleteClientAPI = async (id: number): Promise<void> => {
    try {
        const token = localStorage.getItem('authToken');
        await api.delete(
            API_URL_NEW_CLIENT+`${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        console.error("Error deleting client:", error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete client");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
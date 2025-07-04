import axios from "axios";
import type { PacientWithId } from "../types/pacient";
import api from "../../../utils/axios";

const API_URL_EDIT_CLIENT = '/pacientes/';

export const editPacientAPI = async (pacientData: PacientWithId): Promise<PacientWithId> => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await api.patch(
            API_URL_EDIT_CLIENT+`${pacientData.id_paciente}`,
            pacientData, 
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Error al editar paciente");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
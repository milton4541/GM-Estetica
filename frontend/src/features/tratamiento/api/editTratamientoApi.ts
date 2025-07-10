import axios from "axios";
import api from "../../../utils/axios";
import type { TratamientoWithId } from "../types/tratamiento";

const API_URL_EDIT_TRATAMIENTO = '/tratamientos/';

export const editTratamientoAPI = async (TratamientoData: TratamientoWithId): Promise<TratamientoWithId> => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await api.patch(
            API_URL_EDIT_TRATAMIENTO+`${TratamientoData.id_tratamiento}`,
            TratamientoData, 
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
            throw new Error(error.response?.data?.message || "Error al editar Tratamiento");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
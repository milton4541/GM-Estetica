import axios from "axios";
import api from "../../../utils/axios";
import type { insumoWithId } from "../types/insumo";

const API_URL_EDIT_CLIENT = '/insumos/';

export const editInsumosAPI = async (insumoData: insumoWithId): Promise<insumoWithId> => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await api.patch(
            API_URL_EDIT_CLIENT+`${insumoData.id_insumo}`,
            insumoData, 
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
            throw new Error(error.response?.data?.message || "Error al editar insumo");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
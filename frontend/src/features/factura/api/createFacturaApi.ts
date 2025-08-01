import axios from "axios";
import api from "../../../utils/axios";
import type { Factura } from "../types/Factura";

const API_URL = "/facturas";

export const CreateFacturaApi = async (data: Factura): Promise<Factura> => {
    const token = localStorage.getItem('authToken')
    if(!token) throw new Error ('No token found')
    try {
        const response = await api.post(API_URL,data,{
        headers: {
            Authorization: `Bearer ${token}`,
      },
      
    })
    return response.data
    } catch (error) {
        console.error("Error creating new Insumo:", error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create new Insumo");
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}
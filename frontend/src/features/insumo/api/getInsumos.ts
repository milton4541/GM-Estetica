import api from '../../../utils/axios';
import type { insumoWithId } from '../types/insumo';

const API_URL = "/insumos";

export const getInsumos = async (): Promise<insumoWithId[]> => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No token found');

  try {
    const response = await api.get<{ data: insumoWithId[] }>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data; 
  } catch (error) {
    console.error("Error al obtener los insumos:", error);
    throw error;
  }
};
import api from '../../../utils/axios';
import type { HistorialItem } from '../types/historial';

const API_URL = "/historiales";

export const getHistorial = async (): Promise<HistorialItem[]> => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No token found');

  try {
    const response = await api.get<{ data: HistorialItem[] }>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data; 
  } catch (error) {
    console.error("Error al obtener historial:", error);
    throw error;
  }
};
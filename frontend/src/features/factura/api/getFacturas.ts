import api from '../../../utils/axios';
import type { facturaWithId } from '../types/Factura';

const API_URL = "/facturas";

export const getFacturas = async (): Promise<facturaWithId[]> => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No token found');

  try {
    const response = await api.get<{ data: facturaWithId[] }>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data; 
  } catch (error) {
    console.error("Error al obtener Facturas:", error);
    throw error;
  }
};
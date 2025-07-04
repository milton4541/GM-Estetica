import type { PacientWithId } from '../types/pacient'; 
import api from '../../../utils/axios';

const API_URL = "/pacientes";

export const getPacients = async (): Promise<PacientWithId[]> => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No token found');

  try {
    const response = await api.get<{ data: PacientWithId[] }>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data; 
  } catch (error) {
    console.error("Error al obtener los pacientes:", error);
    throw error;
  }
};

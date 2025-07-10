import api from '../../../utils/axios';
import type { TratamientoWithId } from '../types/tratamiento';

const API_URL = "/tratamientos";

export const getTratamientos = async (): Promise<TratamientoWithId[]> => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No token found');

  try {
    const response = await api.get<{ data: TratamientoWithId[] }>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data; 
  } catch (error) {
    console.error("Error al obtener los tratamientos:", error);
    throw error;
  }
};
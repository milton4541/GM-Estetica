import api from "../../../utils/axios";

export type ReestockPayload = {
  id_insumo: number;
  cantidad: number; // entero >= 1
};

export const reestockInsumoAPI = async ({ id_insumo, cantidad }: ReestockPayload): Promise<void> => {
  const token = localStorage.getItem('authToken');
  await api.put(
    '/insumos/reestock',
    { id_insumo, cantidad },
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
};

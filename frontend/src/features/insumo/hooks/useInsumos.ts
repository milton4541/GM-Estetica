import { useState, useEffect } from "react";
import { showNotification } from "../../../utils/showNotification";
import type { Insumo, insumoWithId, ReestockPayload } from "../types/insumo";
import { getInsumos } from "../api/getInsumos";
import { addInsumoApi } from "../api/addInsumoApi";
import { deleteInsumoAPI } from "../api/deleteInsumoApi";
import { editInsumosAPI } from "../api/editInsumoApi";
import { reestockInsumoAPI } from "../api/reestock";

export type InsumosSliceType = {
  insumos: insumoWithId[];
  loading: boolean;
  fetchInsumos: () => void;
  addInsumo: (insumo: Insumo) => void;
  deleteInsumo: (id: number) => void;
  editInsumo: (insumo: insumoWithId) => void;
reestockInsumo: (payload: ReestockPayload) => void;
};

export default function useInsumos(): InsumosSliceType {
  const [insumos, setInsumos] = useState<insumoWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchInsumos = async () => {
    setLoading(true);
    try {
      const data = await getInsumos();
      setInsumos(data);
    } catch (error) {
      const msg = (error as Error).message || "Error al cargar insumos";
      showNotification("error", msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsumos();
  }, []);

  const addInsumo = async (insumo: Insumo) => {
    setLoading(true);
    try {
      await addInsumoApi(insumo);
      showNotification("success", "Insumo agregado correctamente");
      await fetchInsumos();
    } catch (error) {
      const msg = (error as Error).message || "Ocurrió un error desconocido";
      showNotification("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteInsumo = async (id: number) => {
    setLoading(true);
    try {
      await deleteInsumoAPI(id);
      showNotification("success", "Insumo eliminado correctamente");
      await fetchInsumos();
    } catch (error) {
      const msg = (error as Error).message || "Ocurrió un error desconocido";
      showNotification("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const editInsumo = async (insumo: insumoWithId) => {
    setLoading(true);
    try {
      await editInsumosAPI(insumo);
      showNotification("success", "Insumo editado correctamente");
      await fetchInsumos();
    } catch (error) {
      const msg = (error as Error).message || "Ocurrió un error desconocido";
      showNotification("error", msg);
    } finally {
      setLoading(false);
    }
  };
  const reestockInsumo = async (payload: ReestockPayload) => {
    setLoading(true);
    try {
      await reestockInsumoAPI(payload);
      showNotification('success', 'Reestock realizado correctamente');
      await fetchInsumos();
    } catch (error) {
      const msg = (error as Error).message || 'Ocurrió un error desconocido';
      showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  }
  return { insumos, loading, fetchInsumos, addInsumo, deleteInsumo, editInsumo,reestockInsumo };
}

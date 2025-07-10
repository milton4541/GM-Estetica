import { useState, useEffect } from "react";
import { showNotification } from "../../../utils/showNotification";
import type { Insumo, insumoWithId } from "../types/insumo";
import { getInsumos } from "../api/getInsumos";
import { addInsumoApi } from "../api/addInsumoApi";
import { deleteInsumoAPI } from "../api/deleteInsumoApi";
import { editInsumosAPI } from "../api/editInsumoApi";

export type InsumosSliceType = {
  insumos: insumoWithId[];
  fetchInsumos: () => void;
  addInsumo: (insumo: Insumo) => void;
  deleteInsumo: (id: number) => void;
  editInsumo: (insumo: insumoWithId) => void;
};

export default function useInsumos(): InsumosSliceType {
  const [insumos, setInsumos] = useState<insumoWithId[]>([]);

  const fetchInsumos = async () => {
    try {
      const data = await getInsumos();
      setInsumos(data);
    } catch (error) {
      const msg = (error as Error).message || "Error al cargar insumos";
      showNotification("error", msg);
    }
  };

  useEffect(() => {
    fetchInsumos();
  }, []);

  const addInsumo = async (insumo: Insumo) => {
    try {
      await addInsumoApi(insumo);
      showNotification("success", "Insumo agregado correctamente");
      await fetchInsumos();
    } catch (error) {
      const msg = (error as Error).message || "Ocurrió un error desconocido";
      showNotification("error", msg);
    }
  };

  const deleteInsumo = async (id: number) => {
    try {
      await deleteInsumoAPI(id);
      showNotification("success", "Insumo eliminado correctamente");
      await fetchInsumos();
    } catch (error) {
      const msg = (error as Error).message || "Ocurrió un error desconocido";
      showNotification("error", msg);
    }
  };

  const editInsumo = async (insumo: insumoWithId) => {
    try {
      await editInsumosAPI(insumo);
      showNotification("success", "Insumo editado correctamente");
      await fetchInsumos();
    } catch (error) {
      const msg = (error as Error).message || "Ocurrió un error desconocido";
      showNotification("error", msg);
    }
  };

  return { insumos, fetchInsumos, addInsumo, deleteInsumo, editInsumo };
}

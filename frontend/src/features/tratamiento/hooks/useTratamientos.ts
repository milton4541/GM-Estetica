import { useState, useEffect } from "react";
import { showNotification } from "../../../utils/showNotification";
import type { Tratamiento, TratamientoWithId } from "../types/tratamiento";
import { getTratamientos } from "../api/getTratamientos";
import { addTratamientoApi } from "../api/addTratamientoApi";
import { deleteTratamientoAPI } from "../api/deleteTratamientoApi";
import { editTratamientoAPI } from "../api/editTratamientoApi";
import { addInsumoATratamientoApi } from "../apiTratamientoInsumo/addTratemientoInsumoApi";
import { getInsumoTratamientoApi } from "../apiTratamientoInsumo/getTratInsumoById";
import { editTratInsumoApi } from "../apiTratamientoInsumo/editTratInsumoApi";
import { deleteTratInsumoApi } from "../apiTratamientoInsumo/deleteTratInsumo";

export type TratamientosSliceType = {
  tratamientos: TratamientoWithId[];
  addTratamiento: (tratamiento: Tratamiento) => void;
  deleteTratamiento: (id: number) => void;
  editTratamiento: (tratamiento: TratamientoWithId) => void;
  getInsumoTratamiento: (id: number) => void;
};

export default function useTratamientos(): TratamientosSliceType {
  const [tratamientos, setTratamientos] = useState<TratamientoWithId[]>([]);

  const fetchTratamientos = async () => {
    try {
      const data = await getTratamientos();
      setTratamientos(data);
    } catch (error) {
      const errorMessage = (error as Error).message || "Ocurrió un error al cargar los tratamientos";
      showNotification("error", errorMessage);
    }
  };

  useEffect(() => {
    fetchTratamientos();
  }, []);

  const addTratamiento = async (tratamiento: Tratamiento) => {
    try {
      const newTratamiento = await addTratamientoApi(tratamiento);
      await Promise.all(
      tratamiento.insumo.map((insumo) =>
        addInsumoATratamientoApi({
          id_tratamiento: newTratamiento.id_tratamiento, 
          id_insumo: insumo.id_insumo,
          cantidad: insumo.cantidad ?? 1,              
        })
      )
    );      showNotification("success", "Tratamiento agregado correctamente");
      await fetchTratamientos();
    } catch (error) {
      const errorMessage = (error as Error).message || "Ocurrió un error desconocido";
      showNotification("error", errorMessage);
    }
  };

  const deleteTratamiento = async (id: number) => {
    try {
      await deleteTratamientoAPI(id);
      await deleteTratInsumoApi(id)
      showNotification("success", "Tratamiento eliminado correctamente");
      await fetchTratamientos();
    } catch (error) {
      const errorMessage = (error as Error).message || "Ocurrió un error desconocido";
      showNotification("error", errorMessage);
    }
  };

const editTratamiento = async (tratamiento: TratamientoWithId) => {
  try {
    await editTratamientoAPI(tratamiento); // actualiza cabecera
    const ids = tratamiento.insumo.map(i => i.id_insumo);
    const cantidadComun = tratamiento.insumo[0]?.cantidad ?? 1; 
    await editTratInsumoApi(tratamiento.id_tratamiento, ids, cantidadComun);
    showNotification("success", "Tratamiento editado correctamente");
    await fetchTratamientos();
  } catch (error) {
    showNotification("error", (error as Error).message);
  }
};

  const getInsumoTratamiento = async (id: number) => {
    try {
      const response = await getInsumoTratamientoApi(id)
      return response
    } catch (error) {
      console.error("error al traer los insumo-tratamiento por id ", error)
    }
  }

  return { tratamientos, addTratamiento, deleteTratamiento, editTratamiento, getInsumoTratamiento};
}

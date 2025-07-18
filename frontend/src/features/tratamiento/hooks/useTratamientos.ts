import { useState, useEffect } from "react";
import { showNotification } from "../../../utils/showNotification";
import type { Tratamiento, TratamientoWithId } from "../types/tratamiento";
import { getTratamientos } from "../api/getTratamientos";
import { addTratamientoApi } from "../api/addTratamientoApi";
import { deleteTratamientoAPI } from "../api/deleteTratamientoApi";
import { editTratamientoAPI } from "../api/editTratamientoApi";
import { addInsumoATratamientoApi } from "../api/addTratemientoInsumoApi";

export type TratamientosSliceType = {
  tratamientos: TratamientoWithId[];
  addTratamiento: (tratamiento: Tratamiento) => void;
  deleteTratamiento: (id: number) => void;
  editTratamiento: (tratamiento: TratamientoWithId) => void;
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
          id_insumos: insumo.id_insumo,
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
      showNotification("success", "Tratamiento eliminado correctamente");
      await fetchTratamientos();
    } catch (error) {
      const errorMessage = (error as Error).message || "Ocurrió un error desconocido";
      showNotification("error", errorMessage);
    }
  };

  const editTratamiento = async (tratamiento: TratamientoWithId) => {
    try {
      await editTratamientoAPI(tratamiento);
      showNotification("success", "Tratamiento editado correctamente");
      await fetchTratamientos();
    } catch (error) {
      const errorMessage = (error as Error).message || "Ocurrió un error desconocido";
      showNotification("error", errorMessage);
    }
  };

  return { tratamientos, addTratamiento, deleteTratamiento, editTratamiento };
}

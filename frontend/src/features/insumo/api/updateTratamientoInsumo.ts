import api from "../../../utils/axios";
import type { DetalleTratamientoInsumo } from "../../tratamiento/types/tratamiento";
type ApiResponse<T> = { message: string; data: T; success: boolean; };

export async function updateTratamientoInsumo(
  idTratamiento: number,
  idInsumos: number[],
  cantidad: number
): Promise<DetalleTratamientoInsumo[]> {
  const resultados = await Promise.all(
    idInsumos.map((id_insumo) =>
      api
        .put<ApiResponse<DetalleTratamientoInsumo>>(
          "/insumos/actualizar-stock",
          {
            id_tratamiento: idTratamiento,
            id_insumo,        
            cantidad,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        )
        .then((resp) => resp.data.data) 
    )
  );
  return resultados;
}
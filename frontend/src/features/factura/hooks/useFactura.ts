import { useEffect, useState } from "react";
import type { Factura, facturaWithId } from "../types/Factura";
import { CreateFacturaApi } from "../api/createFacturaApi";
import { showNotification } from "../../../utils/showNotification";
import { getFacturas } from "../api/getFacturas";

export default function useFactura() {
  const [factura, setFactura] = useState<facturaWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchFactura();
  }, []);

  const fetchFactura = async () => {
    setLoading(true);
    try {
      const responde = await getFacturas();
      setFactura(responde);
    } catch (error) {
      const msg = (error as Error).message || "Ocurrió un error desconocido";
      showNotification("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const createFactura = async (data: Factura) => {
    setLoading(true);
    try {
      await CreateFacturaApi(data);
      showNotification("success", "Factura creada correctamente");
      await fetchFactura(); // para refrescar la lista luego de crear
    } catch (error) {
      const msg = (error as Error).message || "Ocurrió un error desconocido";
      showNotification("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return { factura, createFactura, fetchFactura, loading };
}

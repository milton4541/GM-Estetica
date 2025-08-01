import { useEffect, useState } from "react";
import type { Factura, facturaWithId } from "../types/Factura";
import { CreateFacturaApi } from "../api/createFacturaApi";
import { showNotification } from "../../../utils/showNotification";
import { getFacturas } from "../api/getFacturas";

export default function useFactura(){
    const [factura, setFactura] = useState<facturaWithId[]>([])

    useEffect(()=>{
        fetchFactura()
    }, [])

    const fetchFactura = async () => {
        try {
            const responde = await getFacturas()
            setFactura(responde)
        } catch (error) {
            const msg = (error as Error).message || "Ocurrió un error desconocido";
            showNotification("error", msg);   
        }
    }

    const createFactura = async (data: Factura) => {
        try {
            await CreateFacturaApi(data)
            showNotification('success', 'Factura creada correctamente')
        } catch (error) {
            const msg = (error as Error).message || "Ocurrió un error desconocido";
            showNotification("error", msg);
        }
    }

    return {factura, createFactura, fetchFactura}
}
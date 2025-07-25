import { useState } from "react";
import type { HistorialItem } from "../types/historial"
import { getHistorial } from "../api/getHistorial";


export type HistorialSliceType = {
    historial: HistorialItem[];
    fetchHistorial: () => void;
}

export default function useHistorial(): HistorialSliceType{
    const [historial, setHistorial] = useState<HistorialItem[]>([])

    const fetchHistorial = async () => {
        try {
            const data = await getHistorial()
            setHistorial(data)
        } catch (error) {
            console.error("error: ", error)
        }
    }

    
    return {historial, fetchHistorial}
}


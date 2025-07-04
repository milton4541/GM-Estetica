import { useState, useEffect } from "react";
import { showNotification } from "../../../utils/showNotification";
import type { Pacient, PacientWithId } from "../types/pacient";
import { getPacients } from "../api/getPacients";
import { addPacientApi } from "../api/addPacientApi";
import { deleteClientAPI } from "../api/deletePacientApi";
import { editPacientAPI } from "../api/editPacientApi";
export type PacientsSliceType = {
    pacient: PacientWithId
    addPacient: (pacient: Pacient) => void
    fetchPacients: () => void
    deletePacient: (id: number) => void
    editPacient: (pacient: PacientWithId) => void
}

export default function usePacients() {
     const [pacient, setPacient] = useState<PacientWithId[]>([]);
        
    const fetchPacients = async () => {
        // Llama a la API para obtener los clientes
        const pacient = await getPacients(); 
        setPacient(pacient); 
    };
    
    useEffect(() => {
        fetchPacients();
    }, []);

    const addPacient = async (pacient: Pacient) => { 
        try{
        // Llama a la API para crear el cliente
        await addPacientApi(pacient); 
        showNotification('success','Paciente agregado correctamente');
        await fetchPacients(); //refresca datos
        } catch (error) {
            const errorMessage = (error as Error).message || 'Ocurrió un error desconocido';
            showNotification('error', errorMessage);
        }
    }

    const deletePacient = async (id: number) => {
        try {
            // Llama a la API para eliminar el cliente
            await deleteClientAPI(id);
            showNotification('success','Cliente eliminado correctamente');
            await fetchPacients(); //refresca datos
        } catch (error) {
            const errorMessage = (error as Error).message || 'Ocurrió un error desconocido';
            showNotification('error', errorMessage);
        }
    }

    const editPacient = async (pacient: PacientWithId) => {
        try {
            await editPacientAPI(pacient);
            showNotification('success','Paciente editado correctamente');
            await fetchPacients(); //refresca datos
            console.log("refresca datos")
        } catch (error) {
            const errorMessage = (error as Error).message || 'Ocurrió un error desconocido';
            showNotification('error', errorMessage);
        }    
    }



     return { pacient, addPacient, deletePacient,editPacient };
}
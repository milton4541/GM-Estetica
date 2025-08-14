import { useState, useEffect } from "react";
import { showNotification } from "../../../utils/showNotification";
import type { Pacient, PacientWithId } from "../types/pacient";
import { getPacients } from "../api/getPacients";
import { addPacientApi } from "../api/addPacientApi";
import { deleteClientAPI } from "../api/deletePacientApi";
import { editPacientAPI } from "../api/editPacientApi";

export type PacientsSliceType = {
    pacient: PacientWithId[];
    loading: boolean;
    addPacient: (pacient: Pacient) => void;
    fetchPacients: () => void;
    deletePacient: (id: number) => void;
    editPacient: (pacient: PacientWithId) => void;
};

export default function usePacients() {
    const [pacient, setPacient] = useState<PacientWithId[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchPacients = async () => {
        setLoading(true);
        try {
            const pacient = await getPacients();
            setPacient(pacient);
        } catch (error) {
            const errorMessage = (error as Error).message || 'Ocurrió un error desconocido';
            showNotification('error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPacients();
    }, []);

    const addPacient = async (pacient: Pacient) => { 
        try {
            await addPacientApi(pacient);
            showNotification('success', 'Paciente agregado correctamente');
            await fetchPacients();
        } catch (error) {
            const errorMessage = (error as Error).message || 'Ocurrió un error desconocido';
            showNotification('error', errorMessage);
        }
    };

    const deletePacient = async (id: number) => {
        try {
            await deleteClientAPI(id);
            showNotification('success', 'Cliente eliminado correctamente');
            await fetchPacients();
        } catch (error) {
            const errorMessage = (error as Error).message || 'Ocurrió un error desconocido';
            showNotification('error', errorMessage);
        }
    };

    const editPacient = async (pacient: PacientWithId) => {
        try {
            await editPacientAPI(pacient);
            showNotification('success', 'Paciente editado correctamente');
            await fetchPacients();
        } catch (error) {
            const errorMessage = (error as Error).message || 'Ocurrió un error desconocido';
            showNotification('error', errorMessage);
        }    
    };

    return { pacient, loading, addPacient, deletePacient, editPacient, fetchPacients };
}

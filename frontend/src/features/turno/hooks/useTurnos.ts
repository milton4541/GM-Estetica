import { useState, useEffect, useCallback } from "react";
import { getTurnos } from "../api/getTurnos";
import type { FinalizePayload, NewTurno, Turno, UpdateTurno } from "../types/Turno";
import { showNotification } from "../../../utils/showNotification";
import { addTurnoAPI } from "../api/addTurnoApi";
import { deleteTurnoAPI } from "../api/deleteTurnoApi";
import { editTurnoAPI } from "../api/editTurnoApi";
import { finaliceTurnoAPI } from "../api/finaliceTurnoApi";
import { createDoc } from "../../historial/api/CreateDoc";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    rawTurno: Turno;
  };
}

export default function useTurnos() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTurnos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const turnosArray: Turno[] = await getTurnos();
      const apiEvents: CalendarEvent[] = turnosArray.map((turno) => {
        const isoStart = `${turno.fecha}T${turno.hora}:00`;
        const startDate = new Date(isoStart);

        // AHORA SOLO ACCEDEMOS A UN TRATAMIENTO Y SU DURACIÓN
        const totalDuration = turno.tratamiento ? turno.tratamiento.duracion : 0;

        return {
          id: String(turno.id_turno),
          title: `${turno.paciente.nombre} ${turno.paciente.apellido}`,
          start: startDate.toISOString(),
          backgroundColor: turno.finalizado ? 'gray' : '#1e40af', // bg-blue-800
          borderColor: turno.finalizado ? 'gray' : '#1e40af', // bg-blue-800
          textColor: 'white',
          end: new Date(
            startDate.getTime() + totalDuration * 60_000
          ).toISOString(),
          extendedProps: { rawTurno: turno }
        };
      });

      setEvents(apiEvents);
    } catch (err) {
      console.error("Error fetching turnos:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTurnos();
  }, [fetchTurnos]);

  const addTurno = async (turno: NewTurno) => {
    try {
      await addTurnoAPI(turno);
      showNotification("success", "Cita creada correctamente");
      await fetchTurnos();
    } catch (err) {
      showNotification("error", (err as Error).message);
    }
  };

  const deleteTurno = async (id: number) => {
    try {
      await deleteTurnoAPI(id);
      showNotification("success", "Cita eliminada correctamente");
      await fetchTurnos();
    } catch (err) {
      showNotification("error", (err as Error).message);
    }
  };

  const updateTurno = async (turno: UpdateTurno) => {
    console.log(turno);
    try {
      await editTurnoAPI(turno);
      showNotification("success", "Cita editada correctamente");
      await fetchTurnos();
    } catch (err) {
      showNotification("error", (err as Error).message);
    }
  };

  const finaliceTurno = async (id_turno: number, turno?: FinalizePayload): Promise<void> => {
    try {
      await finaliceTurnoAPI(id_turno);

      if (turno?.documento) {
        await createDoc(turno.documento);
      }
      showNotification("success", "Cita finalizada correctamente");
      await fetchTurnos();
    } catch (err) {
      showNotification("error", (err as Error).message);
    }
  };

  return { events, loading, error, refresh: fetchTurnos, addTurno, deleteTurno, updateTurno, finaliceTurno };
}
import { useState, useEffect, useCallback } from "react";
import { getTurnos } from "../api/getTurnos";
import { addTurnoAPI } from "../api/addTurnoApi";
import { deleteTurnoAPI } from "../api/deleteTurnoApi";
import { editTurnoAPI } from "../api/editTurnoApi";
import { finaliceTurnoAPI } from "../api/finaliceTurnoApi";
import { createDoc } from "../../historial/api/CreateDoc";
import type { FinalizePayload, NewTurno, Turno, UpdateTurno } from "../types/Turno";
import { showNotification } from "../../../utils/showNotification";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: { rawTurno: Turno };
}

export default function useTurnos() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Mapear turno a evento de calendario
  const mapTurnoToEvent = (turno: Turno): CalendarEvent[] => {
    if (!turno.tratamiento || !turno.paciente) return [];

    let startDate: Date;
    try {
      const hora = turno.hora.length === 5 ? turno.hora : turno.hora.slice(0, 5);
      const isoStart = `${turno.fecha}T${hora}:00`;
      startDate = new Date(isoStart);
      if (isNaN(startDate.getTime())) throw new Error("Invalid start date");
    } catch {
      startDate = new Date();
    }

    const duration = Number(turno.tratamiento.duracion) || 30;
    const endDate = new Date(startDate.getTime() + duration * 60_000);

    const isFinalizado = !!turno.finalizado;

    const event: CalendarEvent = {
      id: `${turno.id_turno}`,
      title: `${turno.paciente.nombre} ${turno.paciente.apellido}`,
      start: startDate,
      end: endDate,
      backgroundColor: isFinalizado ? "gray" : "#1e40af",
      borderColor: isFinalizado ? "gray" : "#1e40af",
      textColor: "white",
      extendedProps: { rawTurno: turno },
    };

    return [event];
  };

  // Fetch turnos
  const fetchTurnos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const turnosArray: Turno[] = Array.isArray(await getTurnos()) ? await getTurnos() : [];
      const apiEvents = turnosArray.flatMap(mapTurnoToEvent);
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

  // Agregar turno
  const addTurno = async (turno: NewTurno) => {
    try {
      const createdTurno = await addTurnoAPI(turno);
      createdTurno.finalizado = false; // forzar activo
      const newEvents = mapTurnoToEvent(createdTurno);
      setEvents(prev => [...prev, ...newEvents]);
      showNotification("success", "Cita creada correctamente");
    } catch (err) {
      showNotification("error", (err as Error).message);
    }
  };

  // Eliminar turno
  const deleteTurno = async (id: number) => {
    try {
      await deleteTurnoAPI(id);
      showNotification("success", "Cita eliminada correctamente");
      await fetchTurnos();
    } catch (err) {
      showNotification("error", (err as Error).message);
    }
  };

  // Actualizar turno
  const updateTurno = async (turno: UpdateTurno) => {
    try {
      await editTurnoAPI(turno);
      showNotification("success", "Cita editada correctamente");
      await fetchTurnos();
    } catch (err) {
      showNotification("error", (err as Error).message);
    }
  };

  // Finalizar turno
  const finaliceTurno = async (id_turno: number, turno?: FinalizePayload) => {
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

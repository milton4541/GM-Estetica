// src/historial/hooks/useHistorial.ts
import { useState, useCallback, useEffect } from 'react';
import type { HistorialItem } from '../types/historial';
import { getHistorial } from '../api/getHistorial';
import { getHistorialByPaciente } from '../api/getHistorialByPaciente';
import { getHistorialByTratamiento } from '../api/getHistorialByTratamiento';

export default function useHistorial() {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading]      = useState(false);
  const [error, setError]          = useState<string | null>(null);

  // 1) Traer todo - envuelto en useCallback para memorizar la función
  const fetchHistorial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistorial();
      setHistorial(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []); // El array de dependencias está vacío, la función no cambiará.

  // 2) Filtrar por paciente - envuelto en useCallback
  const fetchByPaciente = useCallback(async (pacienteId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistorialByPaciente(pacienteId);
      setHistorial(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []); // El array de dependencias está vacío.

  // 3) Filtrar por tratamiento - envuelto en useCallback
  const fetchByTratamiento = useCallback(async (tratamientoId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistorialByTratamiento(tratamientoId);
      setHistorial(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []); // El array de dependencias está vacío.

  // Carga inicial
  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]); // Ahora, esta dependencia es estable gracias a useCallback.

  return {
    historial,
    loading,
    error,
    fetchHistorial,
    fetchByPaciente,
    fetchByTratamiento,
  };
}
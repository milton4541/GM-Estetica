// src/historial/hooks/useHistorial.ts
import { useState, useEffect } from 'react'
import type { HistorialItem } from '../types/historial'
import { getHistorial } from '../api/getHistorial'
import { getHistorialByPaciente } from '../api/getHistorialByPaciente'
import { getHistorialByTratamiento } from '../api/getHistorialByTratamiento'

export default function useHistorial() {
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string|null>(null)

  // 1) Traer todo
  const fetchHistorial = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getHistorial()
      setHistorial(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // 2) Filtrar por paciente
  const fetchByPaciente = async (pacienteId: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getHistorialByPaciente(pacienteId)
      setHistorial(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // 3) Filtrar por tratamiento
  const fetchByTratamiento = async (tratamientoId: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getHistorialByTratamiento(tratamientoId)
      setHistorial(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Carga inicial
  useEffect(() => {
    fetchHistorial()
  }, [])

  return {
    historial,
    loading,
    error,
    fetchHistorial,
    fetchByPaciente,
    fetchByTratamiento
  }
}

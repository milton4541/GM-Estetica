import React, { useState } from "react";
import Select from "react-select";

import usePacients from "../paciente/hooks/usePacient";
import useTratamientos from "../tratamiento/hooks/useTratamientos";

import type { NewTurno } from "./types/Turno";

type Props = {
  onClose: () => void;
  selectedDate: string; // ISO string
  addTurno: (t: NewTurno) => Promise<void>;
};

export default function AddTurno({ onClose, selectedDate, addTurno }: Props) {
  const [clientId, setClientId] = useState<number | null>(null);
  const [selectedTratamientos, setSelectedTratamientos] = useState<number[]>([]);

  // 1. Traemos los datos y funciones de los hooks
  const { pacient } = usePacients();
  const { tratamientos } = useTratamientos();

  // 2. Preparamos opciones para los selects
  const clientOptions = pacient.map((p) => ({
    value: p.id_paciente,
    label: `${p.nombre} ${p.apellido}`,
  }));
  const tratamientoOptions = tratamientos.map((t) => ({
    value: t.id_tratamiento,
    label: t.descripcion,
  }));

  // 3. Formateo de fecha y hora para la API
  const formatDateAPI = (iso: string) => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };
  const formatTimeAPI = (iso: string) => {
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mi}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clientId === null || selectedTratamientos.length === 0) return;

    await addTurno({
      fecha: formatDateAPI(selectedDate),
      hora: formatTimeAPI(selectedDate),
      id_tratamiento: selectedTratamientos,
      id_paciente: clientId,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="bg-white p-6 rounded-lg w-1/3 h-[40vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Crear Cita</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Fecha:</label>
            <p>{formatDateAPI(selectedDate)} &nbsp; {formatTimeAPI(selectedDate)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Paciente:</label>
            <Select
              options={clientOptions}
              value={clientOptions.find((opt) => opt.value === clientId) || null}
              onChange={(opt) => setClientId(opt ? opt.value : null)}
              placeholder="Selecciona un paciente..."
              isSearchable
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tratamientos:</label>
            <Select
              options={tratamientoOptions}
              isMulti
              value={tratamientoOptions.filter((opt) => selectedTratamientos.includes(opt.value))}
              onChange={(opts) =>
                setSelectedTratamientos(opts.map((o) => o.value))
              }
              placeholder="Selecciona tratamientos..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!clientId || selectedTratamientos.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Guardar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

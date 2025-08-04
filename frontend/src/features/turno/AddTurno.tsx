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

// Estilos personalizados para react-select
const customStyles = {
  control: (provided: any, state: { isFocused: any }) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 1px #2563eb' : 'none',
    '&:hover': {
      borderColor: '#9ca3af',
    },
    borderRadius: '8px',
  }),
  option: (provided: any, state: { isSelected: any; isFocused: any }) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#1e40af' : state.isFocused ? '#eff6ff' : null,
    color: state.isSelected ? 'white' : '#1f2937',
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
  }),
};

export default function AddTurno({ onClose, selectedDate, addTurno }: Props) {
  const [clientId, setClientId] = useState<number | null>(null);
  const [selectedTratamientos, setSelectedTratamientos] = useState<number[]>([]);

  const { pacient } = usePacients();
  const { tratamientos } = useTratamientos();

  const clientOptions = pacient.map((p) => ({
    value: p.id_paciente,
    label: `${p.nombre} ${p.apellido}`,
  }));
  const tratamientoOptions = tratamientos.map((t) => ({
    value: t.id_tratamiento,
    label: t.descripcion,
  }));

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
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Cita</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha y Hora:</label>
            <p className="mt-1 text-gray-900">{formatDateAPI(selectedDate)} &nbsp; {formatTimeAPI(selectedDate)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Paciente:</label>
            <Select
              options={clientOptions}
              value={clientOptions.find((opt) => opt.value === clientId) || null}
              onChange={(opt) => setClientId(opt ? opt.value : null)}
              placeholder="Selecciona un paciente..."
              isSearchable
              styles={customStyles}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Tratamientos:</label>
            <Select
              options={tratamientoOptions}
              isMulti
              value={tratamientoOptions.filter((opt) => selectedTratamientos.includes(opt.value))}
              onChange={(opts) =>
                setSelectedTratamientos(opts.map((o) => o.value))
              }
              placeholder="Selecciona tratamientos..."
              styles={customStyles}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!clientId || selectedTratamientos.length === 0}
              className="px-4 py-2 text-white rounded-lg bg-blue-800 hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors"
            >
              Guardar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
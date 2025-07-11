import { useState } from "react";
import ConfirmAction from "../../components/confirmAction";
import Select from "react-select";
import usePacients from "../paciente/hooks/usePacient";
import useTratamientos from "../tratamiento/hooks/useTratamientos";
import type { FinalizePayload, Turno, UpdateTurno } from "./types/Turno";

type Props = {
  turno: Turno;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UpdateTurno) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onFinalize: (id: number, data: FinalizePayload) => Promise<void>;
};

export default function DetailModal({
  turno,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onFinalize,
}: Props) {
  const [mode, setMode] = useState<"view"|"edit"|"confirmDelete"|"finalize">("view");
  const [file, setFile] = useState<File|null>(null);
  const [stockUsado, setStockUsado] = useState<number>(0);
  const [descuentoPrecio, setDescuentoPrecio] = useState<number>(0);
  const [descuentoPct, setDescuentoPct] = useState<number>(0);

  // ① Inicializamos formData como UpdateTurno, no como Turno
  const [formData, setFormData] = useState<UpdateTurno>({
    id_turno: turno.id_turno,
    fecha: turno.fecha,
    hora: turno.hora,
    id_tratamiento: turno.tratamiento.id_tratamiento,
    id_paciente: turno.paciente.id_paciente,
  });

  const { pacient } = usePacients();
  const { tratamientos } = useTratamientos();

  if (!isOpen) return null;

  const handleSave = async () => {
    await onSave(formData);
    setMode("view");
    onClose();
  };

  const handleDeleteConfirmed = async () => {
    await onDelete(turno.id_turno);
    onClose();
  };

  const handleFinalize = async () => {
    const payload: FinalizePayload = {
      documento: file,
      stock_usado: stockUsado,
      descuento_precio: descuentoPrecio,
      descuento_porcentaje: descuentoPct,
    };
    await onFinalize(turno.id_turno, payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3 h-[40vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-semibold">
            {mode === "view" && `Cita: ${turno.paciente.nombre} ${turno.paciente.apellido}`}
            {mode === "edit" && "Editar Cita"}
            {mode === "confirmDelete" && "Confirmar eliminación"}
            {mode === "finalize" && "Finalizar turno"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* VIEW MODE */}
          {mode === "view" && (
            <>
              <p><b>Fecha:</b> {turno.fecha} – {turno.hora}</p>
              <p><b>Tratamiento:</b> {turno.tratamiento.descripcion} ({turno.tratamiento.duracion} min)</p>
              <p><b>Paciente:</b> {turno.paciente.nombre} {turno.paciente.apellido}</p>
              <p><b>Finalizado:</b> {turno.finalizado ? "Sí" : "No"}</p>
            </>
          )}

          {/* EDIT MODE */}
          {mode === "edit" && (
            <form className="space-y-4">
              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium">Fecha</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={e => setFormData(f => ({ ...f, fecha: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              {/* Hora */}
              <div>
                <label className="block text-sm font-medium">Hora</label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={e => setFormData(f => ({ ...f, hora: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              {/* Paciente */}
              <div>
                <label className="block text-sm font-medium mb-1">Paciente</label>
                <Select
                  options={pacient.map(p => ({
                    value: p.id_paciente,
                    label: `${p.nombre} ${p.apellido}`
                  }))}
                  value={pacient
                    .filter(p => p.id_paciente === formData.id_paciente)
                    .map(p => ({ value: p.id_paciente, label: `${p.nombre} ${p.apellido}` }))[0]}
                  onChange={opt => {
                    if (opt) setFormData(f => ({ ...f, id_paciente: opt.value }));
                  }}
                  className="text-sm"
                />
              </div>

              {/* Tratamiento */}
              <div>
                <label className="block text-sm font-medium mb-1">Tratamiento</label>
                <Select
                  options={tratamientos.map(t => ({
                    value: t.id_tratamiento,
                    label: t.descripcion
                  }))}
                  value={tratamientos
                    .filter(t => t.id_tratamiento === formData.id_tratamiento)
                    .map(t => ({ value: t.id_tratamiento, label: t.descripcion }))[0]}
                  onChange={opt => {
                    if (opt) setFormData(f => ({ ...f, id_tratamiento: opt.value }));
                  }}
                  className="text-sm"
                />
              </div>
            </form>
          )}

          {/* CONFIRM DELETE */}
          {mode === "confirmDelete" && (
            <ConfirmAction
              onConfirm={handleDeleteConfirmed}
              onCancel={() => setMode("view")}
            />
          )}

{/* FINALIZE MODE */}
          {mode === "finalize" && (
            <>
              {/* Usa tu HTML Tailwind adaptado a React */}
              <div>
                <label className="block text-sm font-medium mb-1">Documentación</label>
                <input
                  type="file"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-600 file:py-2 file:px-4 file:rounded-full file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock Usado</label>
                <input
                  type="number"
                  value={stockUsado}
                  onChange={e => setStockUsado(+e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Descuento Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={descuentoPrecio}
                    onChange={e => setDescuentoPrecio(+e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descuento %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={descuentoPct}
                    onChange={e => setDescuentoPct(+e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end border-t px-6 py-4 space-x-2">
          {mode === "view" && (
            <>
              <button onClick={() => setMode("edit")} className="px-4 py-2 bg-yellow-500 text-white rounded">Editar</button>
              <button onClick={() => setMode("confirmDelete")} className="px-4 py-2 bg-red-500 text-white rounded">Eliminar</button>
              {!turno.finalizado && (
                <button onClick={() => setMode("finalize")} className="px-4 py-2 bg-green-600 text-white rounded">Finalizar turno</button>
              )}
            </>
          )}

          {mode === "edit" && (
            <>
              <button onClick={() => setMode("view")} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
            </>
          )}

          {mode === "finalize" && (
            <>
              <button onClick={() => setMode("view")} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              <button onClick={handleFinalize} className="px-4 py-2 bg-green-600 text-white rounded">Finalizar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

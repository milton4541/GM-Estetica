import React, { useEffect, useState } from "react";
import Select from "react-select";
import ConfirmAction from "../../components/confirmAction";
import usePacients from "../paciente/hooks/usePacient";
import useTratamientos from "../tratamiento/hooks/useTratamientos";
import useInsumos from "../insumo/hooks/useInsumos";
import type { FinalizePayload, Turno, UpdateTurno } from "./types/Turno";
import api from "../../utils/axios";
import { deleteTurnoAPI } from "./api/deleteTurnoApi";
import useTurnos from "./hooks/useTurnos";
import { updateTratamientoInsumo } from "../insumo/api/updateTratamientoInsumo";
import dayjs from "dayjs";
import LoadingSpinner from '../../components/LoadingSpinner';

type ApiResponse<T> = { message: string; data: T; success: boolean };
type DetalleTratamientoInsumo = { id: number; id_tratamiento: number; id_insumo: number; cantidad: number; };

const token = localStorage.getItem("authToken");

// --- Helpers de normalización ---
const toHHmm = (h?: string) => {
  if (!h) return h as any;
  const m = h.match(/^(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : h;
};

const toYMD = (d?: string) => {
  if (!d) return d as any;
  // Si viene como DD/MM/YYYY lo paso a YYYY-MM-DD para <input type="date">
  return d.includes("/")
    ? dayjs(d, "DD/MM/YYYY").format("YYYY-MM-DD")
    : d;
};

async function fetchInsumosByTratamiento(idTratamiento: number): Promise<DetalleTratamientoInsumo[]> {
  const resp = await api.get<ApiResponse<DetalleTratamientoInsumo[]>>(
    `/tratamiento-insumo/${idTratamiento}`,
    { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
  );
  return resp.data.data;
}

// Enviamos fecha como DD/MM/YYYY y hora como HH:mm (lo que tu backend valida)
async function updateTurnoApi(data: UpdateTurno): Promise<Turno> {
  const { id_turno, fecha, ...rest } = data;

  const formattedFecha = dayjs(fecha, "YYYY-MM-DD").format("DD/MM/YYYY");
  const normalizedHora = toHHmm(rest.hora as string);

  const payload = { ...rest, hora: normalizedHora, fecha: formattedFecha };
  console.log("Payload enviado:", payload);

  const resp = await api.patch<ApiResponse<Turno>>(
    `/turnos/${id_turno}`,
    payload,
    { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
  );
  return resp.data.data;
}

interface TurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  turno: Turno;
  onSave: (data: UpdateTurno) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onFinalize: (id: number, payload?: FinalizePayload) => Promise<void>;
}

const TurnoModal: React.FC<TurnoModalProps> = ({ isOpen, onClose, turno }) => {
  const [mode, setMode] = useState<"view" | "edit" | "confirmDelete" | "finalize">("view");
  const [formData, setFormData] = useState<UpdateTurno | null>(null);
  const [insumosUsed, setInsumosUsed] = useState<{ id_insumo: number; cantidad: number; nombre: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loadingInsumos, setLoadingInsumos] = useState(false);

  const { pacient } = usePacients();
  const { tratamientos } = useTratamientos();
  const { insumos: availableInsumos } = useInsumos();
  const { finaliceTurno } = useTurnos();

  // Inicializamos formData al abrir el modal (normalizando fecha/hora para los inputs)
  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      id_turno: turno.id_turno,
      fecha: toYMD(turno.fecha),
      hora: toHHmm(turno.hora),
      id_tratamiento: turno.tratamiento.id_tratamiento,
      id_paciente: turno.paciente.id_paciente,
    });
    setMode("view");
    setFile(null);
    setInsumosUsed([]);
  }, [isOpen, turno]);

  // Fetch insumos cuando se entra en modo FINALIZE
  useEffect(() => {
    if (mode !== "finalize" || !formData || availableInsumos.length === 0) return;

    setLoadingInsumos(true);
    fetchInsumosByTratamiento(formData.id_tratamiento)
      .then(detalles => {
        const enriched = detalles.map(d => {
          const ins = availableInsumos.find(i => Number(i.id_insumo) === Number(d.id_insumo));
          return { id_insumo: d.id_insumo, cantidad: 0, nombre: ins?.nombre || "<desconocido>" };
        });
        setInsumosUsed(enriched);
      })
      .catch(console.error)
      .finally(() => setLoadingInsumos(false));
  }, [mode, formData, availableInsumos]);

  if (!isOpen || !formData) return null;

  const handleClose = () => {
    setFormData(null);
    setMode("view");
    onClose();
  };

  const handleSave = async () => {
    try {
      await updateTurnoApi(formData);
      handleClose();
    } catch (e: any) {
      if (e.response) {
        console.error("Errores de validación:", e.response.data);
      } else {
        console.error(e);
      }
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteTurnoAPI(turno.id_turno);
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleFinalize = async () => {
    if (!formData) return;
    try {
      const ids = insumosUsed.map(i => i.id_insumo);
      const cantidad = insumosUsed[0]?.cantidad || 0;
      await updateTratamientoInsumo(formData.id_tratamiento, ids, cantidad);
      if (file) await finaliceTurno(turno.id_turno, { documento: file });
      else await finaliceTurno(turno.id_turno);
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b mb-4">
          <h3 className="text-lg font-semibold">
            {mode === "view" && `Cita: ${turno.paciente.nombre} ${turno.paciente.apellido}`}
            {mode === "edit" && "Editar Cita"}
            {mode === "confirmDelete" && "Confirmar Eliminación"}
            {mode === "finalize" && "Finalizar Turno"}
          </h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        {/* Body */}
        <div className="space-y-6">
          {mode === "view" && (
            <>
              <p><b>Fecha:</b> {turno.fecha} – {turno.hora}</p>
              <p><b>Tratamiento:</b> {turno.tratamiento.descripcion} ({turno.tratamiento.duracion} min)</p>
              <p><b>Paciente:</b> {turno.paciente.nombre} {turno.paciente.apellido}</p>
              <p><b>Finalizado:</b> {turno.finalizado ? "Sí" : "No"}</p>
            </>
          )}

          {mode === "edit" && (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Fecha</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={e => setFormData(f => ({ ...f!, fecha: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Hora</label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={e => setFormData(f => ({ ...f!, hora: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Paciente</label>
                <Select
                  options={pacient.map(p => ({ value: p.id_paciente, label: `${p.nombre} ${p.apellido}` }))}
                  value={pacient
                    .filter(p => p.id_paciente === formData.id_paciente)
                    .map(p => ({ value: p.id_paciente, label: `${p.nombre} ${p.apellido}` }))[0]}
                  onChange={opt => opt && setFormData(f => ({ ...f!, id_paciente: opt.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tratamiento</label>
                <Select
                  options={tratamientos.map(t => ({ value: t.id_tratamiento, label: t.descripcion }))}
                  value={tratamientos
                    .filter(t => t.id_tratamiento === formData.id_tratamiento)
                    .map(t => ({ value: t.id_tratamiento, label: t.descripcion }))[0]}
                  onChange={opt => opt && setFormData(f => ({ ...f!, id_tratamiento: opt.value }))}
                />
              </div>
            </form>
          )}

          {mode === "confirmDelete" && <ConfirmAction onConfirm={handleDeleteConfirmed} onCancel={() => setMode("view")} />}

          {mode === "finalize" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Documentación</label>
                <input
                  type="file"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-600 file:py-2 file:px-4 file:rounded-full file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Insumos Utilizados</label>
                {loadingInsumos ? <LoadingSpinner /> : insumosUsed.map(iu => (
                  <div key={iu.id_insumo} className="flex justify-between mb-2">
                    <span>{iu.nombre}</span>
                    <input
                      type="number"
                      value={iu.cantidad}
                      onChange={e => {
                        const nueva = +e.target.value;
                        setInsumosUsed(prev => prev.map(x => x.id_insumo === iu.id_insumo ? { ...x, cantidad: nueva } : x));
                      }}
                      className="w-20 text-right rounded-md border-gray-300"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t mt-4 pt-4 space-x-2">
          {mode === "view" && (
            <>
              <button onClick={() => setMode("edit")} className="px-4 py-2 bg-blue-700 text-white font-bold rounded hover:bg-blue-800 transition-colors">Editar</button>
              <button onClick={() => setMode("confirmDelete")} className="px-4 py-2 bg-red-700 text-white font-bold rounded hover:bg-red-800 transition-colors">Eliminar</button>
              {!turno.finalizado && <button onClick={() => setMode("finalize")} className="px-4 py-2 bg-green-700 text-white font-bold rounded hover:bg-green-800 transition-colors">Finalizar turno</button>}
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
};

export default TurnoModal;

// src/pages/ReportesView.tsx
import { useState } from "react";
import {
  getIngresosTotales,
  descargarIngresosTotalesPdf,
  getIngresosMensuales,
  descargarIngresosMensualesPdf,
  getRendimientoPorTratamiento,
  descargarRendimientoTratamientosPdf,
  downloadBlob,
} from "./reportesAPI";

type TabKey = "totales" | "mensuales" | "rendimiento";

export default function ReportesView() {
  const [tab, setTab] = useState<TabKey>("totales");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ----- Estado filtros -----
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [mes, setMes] = useState<string>(""); // formato YYYY-MM
  const [tratamiento, setTratamiento] = useState<string>("");

  // ----- Estado datos -----
  const [totales, setTotales] = useState<number | null>(null);
  const [mensuales, setMensuales] = useState<Array<{ mes: string; total: number }>>([]);
  const [rendimiento, setRendimiento] = useState<Array<{ tratamiento: string; ingreso_total: number }>>([]);

  // ----- Helpers -----
  const safeExec = async (fn: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await fn();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  // ----- Acciones -----
  const verTotales = () =>
    safeExec(async () => {
      const data = await getIngresosTotales({
        fecha_inicio: fechaInicio || undefined,
        fecha_fin: fechaFin || undefined,
      });
      setTotales(data.total ?? 0);
    });

  const descargarTotales = () =>
    safeExec(async () => {
      const { blob, filename } = await descargarIngresosTotalesPdf({
        fecha_inicio: fechaInicio || undefined,
        fecha_fin: fechaFin || undefined,
      });
      downloadBlob(blob, filename);
    });

  const verMensuales = () =>
    safeExec(async () => {
      const data = await getIngresosMensuales({ mes: mes || undefined });
      setMensuales(data.data || []);
    });

  const descargarMensuales = () =>
    safeExec(async () => {
      const blob = await descargarIngresosMensualesPdf({ mes: mes || undefined });
      downloadBlob(blob, "ingresos_mensuales.pdf");
    });

  const verRendimiento = () =>
    safeExec(async () => {
      const data = await getRendimientoPorTratamiento({ tratamiento: tratamiento || undefined });
      setRendimiento(data.data || []);
    });

  const descargarRendimiento = () =>
    safeExec(async () => {
      const blob = await descargarRendimientoTratamientosPdf({ tratamiento: tratamiento || undefined });
      downloadBlob(blob, "rendimiento_tratamientos.pdf");
    });

  // ----- Render -----
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Reportes</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          className={`px-3 py-2 rounded ${tab === "totales" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("totales")}
        >
          Ingresos Totales
        </button>
        <button
          className={`px-3 py-2 rounded ${tab === "mensuales" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("mensuales")}
        >
          Ingresos Mensuales
        </button>
        <button
          className={`px-3 py-2 rounded ${tab === "rendimiento" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("rendimiento")}
        >
          Rendimiento por Tratamiento
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">{error}</div>
      )}
      {loading && <div className="mb-4 p-3 rounded bg-blue-50 border border-blue-200">Cargando...</div>}

      {/* Contenido pestañas */}
      {tab === "totales" && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm mb-1">Fecha inicio</label>
              <input
                type="date"
                className="w-full rounded border px-3 py-2"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Fecha fin</label>
              <input
                type="date"
                className="w-full rounded border px-3 py-2"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={verTotales} className="px-3 py-2 rounded bg-gray-800 text-white">
                Ver
              </button>
              <button onClick={descargarTotales} className="px-3 py-2 rounded bg-emerald-600 text-white">
                Descargar PDF
              </button>
            </div>
          </div>

          <div className="rounded border p-4">
            <h3 className="font-medium mb-2">Resultado</h3>
            <p className="text-2xl">
              {totales !== null ? (
                <>$ {totales.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
              ) : (
                <span className="text-gray-500">Sin datos (haz clic en “Ver”)</span>
              )}
            </p>
          </div>
        </section>
      )}

      {tab === "mensuales" && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[240px_auto] gap-3">
            <div>
              <label className="block text-sm mb-1">Mes (YYYY‑MM)</label>
              <input
                type="month"
                className="w-full rounded border px-3 py-2"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Déjalo vacío para ver todos los meses.</p>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={verMensuales} className="px-3 py-2 rounded bg-gray-800 text-white">
                Ver
              </button>
              <button onClick={descargarMensuales} className="px-3 py-2 rounded bg-emerald-600 text-white">
                Descargar PDF
              </button>
            </div>
          </div>

          <div className="rounded border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 border-b">Mes</th>
                  <th className="text-left px-3 py-2 border-b">Total</th>
                </tr>
              </thead>
              <tbody>
                {mensuales.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-4 text-gray-500">
                      Sin datos (haz clic en “Ver”)
                    </td>
                  </tr>
                ) : (
                  mensuales.map((row) => (
                    <tr key={row.mes} className="odd:bg-white even:bg-gray-50">
                      <td className="px-3 py-2 border-b">{row.mes}</td>
                      <td className="px-3 py-2 border-b">
                        $ {row.total.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "rendimiento" && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(240px,1fr)_auto] gap-3">
            <div>
              <label className="block text-sm mb-1">Tratamiento (contiene)</label>
              <input
                type="text"
                className="w-full rounded border px-3 py-2"
                placeholder="Ej: Limpieza"
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={verRendimiento} className="px-3 py-2 rounded bg-gray-800 text-white">
                Ver
              </button>
              <button onClick={descargarRendimiento} className="px-3 py-2 rounded bg-emerald-600 text-white">
                Descargar PDF
              </button>
            </div>
          </div>

          <div className="rounded border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 border-b">Tratamiento</th>
                  <th className="text-left px-3 py-2 border-b">Ingreso total</th>
                </tr>
              </thead>
              <tbody>
                {rendimiento.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-4 text-gray-500">
                      Sin datos (haz clic en “Ver”)
                    </td>
                  </tr>
                ) : (
                  rendimiento.map((row, i) => (
                    <tr key={i} className="odd:bg-white even:bg-gray-50">
                      <td className="px-3 py-2 border-b">{row.tratamiento}</td>
                      <td className="px-3 py-2 border-b">
                        $ {Number(row.ingreso_total).toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

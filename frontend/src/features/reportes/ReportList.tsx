// src/pages/ReportesView.tsx
import React from 'react';
import axios from 'axios';

type Report = {
  key: 'ingresosTotales' | 'ingresosMensuales' | 'rendimientoTratamientos';
  title: string;
  description: string;
  endpoint: string;      // relativo a la base
  fallbackName: string;  // nombre de archivo si el header no viene
};

const API_BASE =
  (import.meta as any).env?.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:8000/api'; // ajustá si usás otro puerto o proxy

const reports: Report[] = [
  {
    key: 'ingresosTotales',
    title: 'Ingresos Totales',
    description: 'Suma total de ingresos de todas las facturas.',
    endpoint: '/reportes/ingresos-totales-pdf',
    fallbackName: 'ingresos_totales.pdf',
  },
  {
    key: 'ingresosMensuales',
    title: 'Ingresos Mensuales',
    description: 'Ingresos agrupados por mes (YYYY-MM).',
    endpoint: '/reportes/ingresos-mensuales-pdf',
    fallbackName: 'ingresos_mensuales.pdf',
  },
  {
    key: 'rendimientoTratamientos',
    title: 'Rendimiento por Tratamientos',
    description: 'Top tratamientos por ingreso total.',
    endpoint: '/reportes/rendimiento-tratamientos-pdf',
    fallbackName: 'rendimiento_tratamientos.pdf',
  },
];

function getFilenameFromContentDisposition(header?: string | null) {
  if (!header) return null;
  // Ej: attachment; filename="ingresos_totales.pdf"
  const match = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(header);
  if (match && match[1]) {
    try {
      return decodeURIComponent(match[1].replace(/\"/g, ''));
    } catch {
      return match[1].replace(/\"/g, '');
    }
  }
  return null;
}

const ReportesView: React.FC = () => {
  const [loading, setLoading] = React.useState<Record<Report['key'], boolean>>({
    ingresosTotales: false,
    ingresosMensuales: false,
    rendimientoTratamientos: false,
  });

  const downloadPdf = async (rep: Report) => {
    try {
      setLoading((s) => ({ ...s, [rep.key]: true }));
      const token = localStorage.getItem('authToken');

      const response = await axios.get(`${API_BASE}${rep.endpoint}`, {
        responseType: 'blob',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      // Si el backend devolvió JSON de error, lo detectamos
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        const text = await response.data.text?.();
        const json = text ? JSON.parse(text) : {};
        throw new Error(json.message || 'No se pudo generar el PDF');
      }

      const disposition = response.headers['content-disposition'];
      const nameFromHeader = getFilenameFromContentDisposition(disposition);
      const filename = nameFromHeader || rep.fallbackName;

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? 'Error al descargar el PDF');
    } finally {
      setLoading((s) => ({ ...s, [rep.key]: false }));
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reportes administrativos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((rep) => (
          <div key={rep.key} className="rounded-2xl border p-5 shadow-sm bg-white/5">
            <h2 className="text-lg font-semibold mb-1">{rep.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{rep.description}</p>

            <button
              onClick={() => downloadPdf(rep)}
              disabled={loading[rep.key]}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 border font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading[rep.key] ? 'Generando…' : 'Descargar PDF'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportesView;

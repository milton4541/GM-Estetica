// src/api/reportesApi.ts
import axios from "axios";

/** Cliente Axios con token automático en cada request */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api",
  timeout: 20000,
});

// Interceptor: agrega Authorization si hay token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Helper para descarga de blobs (PDFs)
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const API_BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

/** Lee el body de error cuando responseType = 'blob' */
async function parseBlobError(e: unknown): Promise<never> {
  if (axios.isAxiosError(e) && e.response?.data instanceof Blob) {
    try {
      const text = await e.response.data.text();
      try {
        const json = JSON.parse(text);
        throw new Error(json.message || json.error || text);
      } catch {
        throw new Error(text);
      }
    } catch {
      throw new Error("Fallo al leer el error del servidor.");
    }
  }
  if (e instanceof Error) throw e;
  throw new Error("Error desconocido");
}

// ---------- Ingresos Totales ----------
export const getIngresosTotales = async (params: { fecha_inicio?: string; fecha_fin?: string }) => {
  try {
    const token = localStorage.getItem("authToken");
    const res = await axios.get(`${API_BASE}/reportes/ingresos-totales`, {
      params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return res.data;
  } catch (e) {
    throw await parseBlobError(e);
  }
};

export const descargarIngresosTotalesPdf = async (params: { fecha_inicio?: string; fecha_fin?: string }) => {
  try {
    const token = localStorage.getItem("authToken");
    const res = await axios.get(`${API_BASE}/reportes/ingresos-totales-pdf`, {
      params,
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    });

    // intenta tomar el nombre del header
    const dispo = res.headers["content-disposition"] as string | undefined;
    let filename = "ingresos_totales.pdf";
    if (dispo) {
      const match = dispo.match(/filename="?([^"]+)"?/i);
      if (match?.[1]) filename = match[1];
    }
    return { blob: res.data as Blob, filename };
  } catch (e) {
    throw await parseBlobError(e);
  }
};

// ---------- Ingresos Mensuales ----------
export const getIngresosMensuales = async (params: { mes?: string }) => {
  try {
    const token = localStorage.getItem("authToken");
    const res = await axios.get(`${API_BASE}/reportes/ingresos-mensuales`, {
      params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return res.data;
  } catch (e) {
    throw await parseBlobError(e);
  }
};

export const descargarIngresosMensualesPdf = async (params: { mes?: string }) => {
  try {
    const token = localStorage.getItem("authToken");
    const res = await axios.get(`${API_BASE}/reportes/ingresos-mensuales-pdf`, {
      params,
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    });
    return res.data as Blob;
  } catch (e) {
    throw await parseBlobError(e);
  }
};

// ---------- Rendimiento por Tratamiento ----------
export const getRendimientoPorTratamiento = async (params: { tratamiento?: string }) => {
  try {
    const token = localStorage.getItem("authToken");
    const res = await axios.get(`${API_BASE}/reportes/rendimiento-tratamientos`, {
      params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return res.data;
  } catch (e) {
    throw await parseBlobError(e);
  }
};

export const descargarRendimientoTratamientosPdf = async (params: { tratamiento?: string }) => {
  try {
    const token = localStorage.getItem("authToken");
    const res = await axios.get(`${API_BASE}/reportes/rendimiento-tratamientos-pdf`, {
      params,
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    });
    return res.data as Blob;
  } catch (e) {
    throw await parseBlobError(e);
  }
};


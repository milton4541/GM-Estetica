import React, { useState, useEffect } from 'react';
import type { Factura } from './types/Factura';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  idPaciente: number;
  idTratamiento: number;
  importe: number | string; // puede venir string desde SQL Server
  onSubmit: (data: Factura) => void;
};

const ModalRegistro: React.FC<Props> = ({
  isOpen,
  onClose,
  idPaciente,
  idTratamiento,
  importe,
  onSubmit
}) => {
  const [descuentoPrecio, setDescuentoPrecio] = useState<number>(0);
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState<number>(0);
  const [importeFinal, setImporteFinal] = useState<number>(Number(importe));

  // Calcular importe final en base al descuento ingresado
  useEffect(() => {
    const baseImporte = Number(importe) || 0; // convertir string a number y proteger de NaN
    let result = baseImporte;

    if (descuentoPrecio > 0) {
      result = baseImporte - descuentoPrecio;
    } else if (descuentoPorcentaje > 0) {
      result = baseImporte * (1 - descuentoPorcentaje / 100);
    }

    setImporteFinal(result >= 0 ? Number(result.toFixed(2)) : 0);
  }, [descuentoPrecio, descuentoPorcentaje, importe]);

  const handleSubmit = () => {
    onSubmit({
      id_paciente: Number(idPaciente),
      id_tratamiento: Number(idTratamiento),
      importe: Number(importe) || 0,
      descuento_precio: Number(descuentoPrecio) || 0,
      descuento_porcentaje: Number(descuentoPorcentaje) || 0,
      importe_final: Number(importeFinal) || 0,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-xl font-bold mb-4">Enviar Factura</h2>

        <div>
          <label className="block text-sm">Importe base</label>
          <input
            type="number"
            value={Number(importe) || 0}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm">Descuento en precio ($)</label>
          <input
            type="number"
            value={descuentoPrecio}
            onChange={(e) => {
              setDescuentoPrecio(e.target.value ? Number(e.target.value) : 0);
              setDescuentoPorcentaje(0); // resetear el otro
            }}
            className="w-full border rounded px-3 py-2"
            min={0}
            max={Number(importe) || 0}
          />
        </div>

        <div>
          <label className="block text-sm">Descuento en porcentaje (%)</label>
          <input
            type="number"
            value={descuentoPorcentaje}
            onChange={(e) => {
              setDescuentoPorcentaje(e.target.value ? Number(e.target.value) : 0);
              setDescuentoPrecio(0); // resetear el otro
            }}
            className="w-full border rounded px-3 py-2"
            min={0}
            max={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Importe final estimado</label>
          <input
            type="number"
            value={importeFinal}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistro;

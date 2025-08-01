import React, { useState, useEffect } from 'react';
import type { Factura } from './types/Factura';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  idPaciente: number;
  idTratamiento: number;
  importe: number;
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
  const [descuentoPrecio, setDescuentoPrecio] = useState<number | ''>('');
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState<number | ''>('');
  const [importeFinal, setImporteFinal] = useState(importe);

  // Calcular importe final en base al descuento ingresado
  useEffect(() => {
    if (descuentoPrecio !== '') {
      const result = importe - Number(descuentoPrecio);
      setImporteFinal(result >= 0 ? result : 0);
    } else if (descuentoPorcentaje !== '') {
      const result = importe * (1 - Number(descuentoPorcentaje) / 100);
      setImporteFinal(result >= 0 ? result : 0);
    } else {
      setImporteFinal(importe);
    }
  }, [descuentoPrecio, descuentoPorcentaje, importe]);

  const handleSubmit = () => {
    onSubmit({
      id_paciente: idPaciente,
      id_tratamiento: idTratamiento,
      importe,
      descuento_precio: descuentoPrecio === '' ? 0 : Number(descuentoPrecio),
      descuento_porcentaje: descuentoPorcentaje === '' ? 0 : Number(descuentoPorcentaje),
      importe_final: importeFinal,
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
            value={importe}
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
              setDescuentoPrecio(e.target.value === '' ? '' : Number(e.target.value));
              setDescuentoPorcentaje(''); // resetear el otro
            }}
            className="w-full border rounded px-3 py-2"
            min={0}
            max={importe}
          />
        </div>

        <div>
          <label className="block text-sm">Descuento en porcentaje (%)</label>
          <input
            type="number"
            value={descuentoPorcentaje}
            onChange={(e) => {
              setDescuentoPorcentaje(e.target.value === '' ? '' : Number(e.target.value));
              setDescuentoPrecio(''); // resetear el otro
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
            value={importeFinal.toFixed(2)}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistro;

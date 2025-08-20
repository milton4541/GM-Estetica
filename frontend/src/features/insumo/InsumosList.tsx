import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { FaPlus, FaEdit, FaTrash, FaSyncAlt } from 'react-icons/fa';
import Modal from '../../components/modal';
import { useState } from 'react';
import type { Insumo, insumoWithId } from './types/insumo';
import ConfirmAction from '../../components/confirmAction';
import InsumoEditForm from './InsumoEditForm';
import useInsumos from './hooks/useInsumos';
import InsumoForm from './InsumoForm';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function InsumoList() {
  const { insumos, loading, addInsumo, deleteInsumo, editInsumo, reestockInsumo  } = useInsumos();

  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<insumoWithId | null>(null);

  // Estado para Reestock
  const [restockQty, setRestockQty] = useState<Record<number, number>>({});
  const [restockLoadingId, setRestockLoadingId] = useState<number | null>(null);

  const handleAdd = (insumo: Insumo) => {
    addInsumo(insumo);
    setIsOpenAdd(false);
  };

  const handleEdit = (insumo: insumoWithId) => {
    editInsumo(insumo);
    setIsOpenEdit(false);
  };

  const handleDelete = (id: number) => {
    deleteInsumo(id);
    setIsOpenDelete(false);
  };

  const handleRestockChange = (id: number, value: string) => {
    const n = Math.max(1, Number(value));
    setRestockQty((prev) => ({ ...prev, [id]: Number.isFinite(n) ? Math.trunc(n) : 1 }));
  };

const handleRestock = (row: insumoWithId) => {
  const cantidad = Number(restockQty[row.id_insumo] ?? 1);
  if (!Number.isInteger(cantidad) || cantidad < 1) return; // validación simple
  reestockInsumo({ id_insumo: row.id_insumo, cantidad });
};

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Lista de Insumos</h2>
        <button
          onClick={() => setIsOpenAdd(true)}
          className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded flex items-center gap-2 mb-4"
          disabled={loading}
        >
          Agregar Insumo <FaPlus />
        </button>

        <Modal isOpen={isOpenAdd} onClose={() => setIsOpenAdd(false)}>
          <InsumoForm onSubmit={handleAdd} />
        </Modal>

        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-50 uppercase">
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Componentes</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Cantidad Mínima</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha Expiración</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Reestock</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Editar</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {insumos.map((row) => (
                <TableRow key={row.id_insumo}>
                  <TableCell sx={{ padding: '8px 16px' }}>{row.componentes}</TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>{row.nombre}</TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>
                    {row.precio_insumo ? Number(row.precio_insumo).toFixed(2) : '0.00'}
                  </TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>{row.cantidad}</TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>{row.cantidad_min}</TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>
                    {new Date(row.fecha_expiracion).toLocaleDateString()}
                  </TableCell>

                  {/* Reestock */}
                  <TableCell sx={{ padding: '8px 16px' }}>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        className="w-20 border rounded px-2 py-1"
                        value={restockQty[row.id_insumo] ?? 1}
                        onChange={(e) => handleRestockChange(row.id_insumo, e.target.value)}
                        disabled={loading || restockLoadingId === row.id_insumo}
                      />
                      <button
                        onClick={() => handleRestock(row)}
                        disabled={loading || restockLoadingId === row.id_insumo}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2 px-3 rounded inline-flex items-center gap-2"
                        title="Reestock"
                      >
                        <FaSyncAlt />
                        <span className="hidden sm:inline">Reestock</span>
                      </button>
                    </div>
                  </TableCell>

                  <TableCell sx={{ padding: '8px 16px' }}>
                    <IconButton
                      onClick={() => {
                        setSelectedInsumo(row);
                        setIsOpenEdit(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 transition-all"
                      disabled={loading}
                    >
                      <FaEdit />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>
                    <IconButton
                      onClick={() => {
                        setSelectedInsumo(row);
                        setIsOpenDelete(true);
                      }}
                      className="text-red-600 hover:text-red-900 transition-all"
                      disabled={loading}
                    >
                      <FaTrash />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {isOpenEdit && selectedInsumo && (
        <Modal isOpen={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
          <InsumoEditForm
            insumo={selectedInsumo}
            onSubmit={(updated) => {
              handleEdit(updated);
              setIsOpenEdit(false);
            }}
          />
        </Modal>
      )}

      {isOpenDelete && selectedInsumo && (
        <ConfirmAction
          onConfirm={() => {
            handleDelete(selectedInsumo.id_insumo);
            setIsOpenDelete(false);
          }}
          onCancel={() => setIsOpenDelete(false)}
        />
      )}
    </div>
  );
}

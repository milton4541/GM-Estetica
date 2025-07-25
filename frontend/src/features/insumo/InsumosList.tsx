import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../../components/modal';
import { useState } from 'react';
import type { Insumo, insumoWithId } from './types/insumo';
import ConfirmAction from '../../components/confirmAction';
import InsumoEditForm from './InsumoEditForm';
import useInsumos from './hooks/useInsumos';
import InsumoForm from './InsumoForm';

export default function InsumoList() {
  const { insumos, addInsumo, deleteInsumo, editInsumo } = useInsumos();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<insumoWithId | null>(null);

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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Insumos</h2>
      <button
        onClick={() => setIsOpenAdd(true)}
        className="bg-gray-500 hover:bg-gray-700 text-black font-bold py-2 px-4 rounded flex items-center gap-2 mb-6"
      >
        Agregar Insumo <FaPlus />
      </button>

      <Modal isOpen={isOpenAdd} onClose={() => setIsOpenAdd(false)}>
        <InsumoForm onSubmit={handleAdd} />
      </Modal>

      <TableContainer component={Paper}>
        <Table>
          <TableHead className="text-center uppercase">
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Componentes</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cantidad Mínima</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha Expiración</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Editar</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="text-center">
            {insumos.map((row) => (
              <TableRow key={row.id_insumo}>
                <TableCell>{row.componentes}</TableCell>
                <TableCell>{row.nombre}</TableCell>
                <TableCell>{row.precio_insumo.toFixed(2)}</TableCell>
                <TableCell>{row.cantidad}</TableCell>
                <TableCell>{row.cantidad_min}</TableCell>
                <TableCell>{new Date(row.fecha_expiracion).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedInsumo(row);
                      setIsOpenEdit(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition-all"
                  >
                    <FaEdit />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedInsumo(row);
                      setIsOpenDelete(true);
                    }}
                    className="text-red-500 hover:text-red-700 transition-all"
                  >
                    <FaTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
            }}
            onCancel={() => setIsOpenDelete(false)}
          />
        )}
      </TableContainer>
    </div>
  );
}

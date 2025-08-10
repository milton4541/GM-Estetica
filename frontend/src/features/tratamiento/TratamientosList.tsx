import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../../components/modal';
import { useState } from 'react';
import type { Tratamiento, TratamientoWithId } from './types/tratamiento';
import ConfirmAction from '../../components/confirmAction';
import useTratamientos from './hooks/useTratamientos';
import TratamientoForm from './TratamientosForm';
import TratamientoEditForm from './TratamientosEditForm';
import useInsumos from '../insumo/hooks/useInsumos';

export default function TratamientoList() {
  const { tratamientos, addTratamiento, deleteTratamiento, editTratamiento } = useTratamientos();
  const { insumos } = useInsumos();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedTratamiento, setSelectedTratamiento] = useState<TratamientoWithId | null>(null);

  const handleAdd = (tratamiento: Tratamiento) => {
    addTratamiento(tratamiento);
    setIsOpenAdd(false);
  };

  const handleEdit = (tratamiento: TratamientoWithId) => {
    editTratamiento(tratamiento);
    setIsOpenEdit(false);
  };

  const handleDelete = (id: number) => {
    deleteTratamiento(id);
    setIsOpenDelete(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Lista de Tratamientos</h2>
        <button
          onClick={() => setIsOpenAdd(true)}
          className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded flex items-center gap-2 mb-4"
        >
          Agregar Tratamiento <FaPlus />
        </button>

        <Modal isOpen={isOpenAdd} onClose={() => setIsOpenAdd(false)}>
          <TratamientoForm onSubmit={handleAdd} insumos={insumos} />
        </Modal>

        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-50 uppercase">
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Duración (min)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Precio ($)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Editar</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tratamientos.map((row) => (
                <TableRow key={row.id_tratamiento}>
                  <TableCell sx={{ padding: '8px 16px' }}>{row.descripcion}</TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>{row.duracion}</TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>{row.precio.toFixed(2)}</TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>
                    <IconButton
                      onClick={() => {
                        setSelectedTratamiento(row);
                        setIsOpenEdit(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 transition-all"
                    >
                      <FaEdit />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>
                    <IconButton
                      onClick={() => {
                        setSelectedTratamiento(row);
                        setIsOpenDelete(true);
                      }}
                      className="text-red-600 hover:text-red-900 transition-all"
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

      {isOpenEdit && selectedTratamiento && (
        <Modal isOpen={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
          <TratamientoEditForm
            insumos={insumos}
            tratamiento={selectedTratamiento}
            onSubmit={(updated) => {
              handleEdit(updated);
              setIsOpenEdit(false);
            }}
          />
        </Modal>
      )}

      {isOpenDelete && selectedTratamiento && (
        <ConfirmAction
          onConfirm={() => {
            handleDelete(selectedTratamiento.id_tratamiento);
          }}
          onCancel={() => setIsOpenDelete(false)}
        />
      )}
    </div>
  );
}
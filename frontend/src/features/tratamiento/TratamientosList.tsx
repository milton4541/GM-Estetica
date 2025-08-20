import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

import Modal from '../../components/modal';
import ConfirmAction from '../../components/confirmAction';
import LoadingSpinner from '../../components/LoadingSpinner';

import useTratamientos from './hooks/useTratamientos';
import useInsumos from '../insumo/hooks/useInsumos';

import type { Tratamiento, TratamientoWithId } from './types/tratamiento';

import TratamientoForm from './TratamientosForm';
import TratamientoEditForm from './TratamientosEditForm';

export default function TratamientoList() {
  const { tratamientos, loading, addTratamiento, deleteTratamiento, editTratamiento } = useTratamientos();
  const { insumos } = useInsumos();

  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedTratamiento, setSelectedTratamiento] = useState<TratamientoWithId | null>(null);

  const handleAdd = async (tratamiento: Tratamiento) => {
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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Lista de Tratamientos</h2>
        <button
          onClick={() => setIsOpenAdd(true)}
          className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded flex items-center gap-2 mb-4"
          disabled={loading}
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
                  <TableCell sx={{ padding: '8px 16px' }}>{row.precio ? Number(row.precio).toFixed(2) : '0.00'}</TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>
                    <IconButton
                      onClick={() => {
                        setSelectedTratamiento(row);
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
                        setSelectedTratamiento(row);
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
            setIsOpenDelete(false);
          }}
          onCancel={() => setIsOpenDelete(false)}
        />
      )}
    </div>
  );
}

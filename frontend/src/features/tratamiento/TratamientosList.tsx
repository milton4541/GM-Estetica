import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../../components/modal';
import { useState } from 'react';
import type { Tratamiento, TratamientoWithId } from './types/tratamiento';
import ConfirmAction from '../../components/confirmAction';
import useTratamientos from './hooks/useTratamientos';
import TratamientoForm from './TratamientosForm';
import TratamientoEditForm from './TratamientosEditForm';

export default function TratamientoList() {
  const { tratamientos, addTratamiento, deleteTratamiento, editTratamiento } = useTratamientos();
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
      <h2 className="text-2xl font-bold mb-4">Lista de Tratamientos</h2>
      <button
        onClick={() => setIsOpenAdd(true)}
        className="bg-gray-500 hover:bg-gray-700 text-black font-bold py-2 px-4 rounded flex items-center gap-2 mb-6"
      >
        Agregar Tratamiento <FaPlus />
      </button>

      <Modal isOpen={isOpenAdd} onClose={() => setIsOpenAdd(false)}>
        <TratamientoForm onSubmit={handleAdd} />
      </Modal>

      <TableContainer component={Paper}>
        <Table>
          <TableHead className="text-center uppercase">
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Duración (min)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Precio ($)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Editar</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="text-center">
            {tratamientos.map((row) => (
              <TableRow key={row.id_tratamiento}>
                <TableCell>{row.descripcion}</TableCell>
                <TableCell>{row.duracion}</TableCell>
                <TableCell>{row.precio.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedTratamiento(row);
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
                      setSelectedTratamiento(row);
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

        {isOpenEdit && selectedTratamiento && (
          <Modal isOpen={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
            <TratamientoEditForm
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
      </TableContainer>
    </div>
);
}

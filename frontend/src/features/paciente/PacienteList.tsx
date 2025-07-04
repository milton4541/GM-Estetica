
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { FaUserPlus } from 'react-icons/fa';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../../components/modal';
import { useState } from 'react';
import PacientForm from './PacientForm';
import type { Pacient, PacientWithId } from './types/pacient';
import ConfirmAction from '../../components/confirmAction';
import usePacients from './hooks/usePacient';
import PacientEditForm from './PacientEdit';

export default function PacienteList() {

 const {pacient, addPacient, deletePacient, editPacient} = usePacients()
 const [isOpen, setIsOpen] = useState(false);  //para abrir modal de agregar cliente
 const [isOpenDelete, setIsOpenDelete] = useState(false); //para abrir modal de eliminar cliente
 const [isOpenEdit, setIsOpenEdit] = useState(false); //para abrir modal de editar cliente
 const [selectedClient, setSelectedClient] = useState<PacientWithId | null>(null);

  const handleEdit = (pacient: PacientWithId) => {
    editPacient(pacient);
    setIsOpenEdit(false);
  };
  const handleDelete = (id: number) => {
    console.log(`Eliminando el paciente con id: ${id}`);
    deletePacient(id);    
    setIsOpenDelete(false); 
  };
  const handleAddPacient =  (pacient: Pacient) => {
      addPacient(pacient); // Llama a tu API o slice de Redux
      setIsOpen(false); // Cierra el modal
  };

 return (
  <div className="container mx-auto p-4">
    <h2 className="text-2xl font-bold mb-4">Lista de Pacientes</h2>
    <button
    onClick={() => {
      setIsOpen(true);
    }}
        className="bg-gray-500 hover:bg-gray-700 text-black font-bold py-2 px-4 rounded flex items-center gap-2 mb-6"
    >
      Agregar Paciente <FaUserPlus />
    </button>

    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <PacientForm onSubmit={handleAddPacient} />
    </Modal>

    <TableContainer component={Paper}>
      <Table>
        <TableHead className="text-center uppercase">
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>DNI</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Apellido</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Obra Social</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Editar</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Eliminar</TableCell>
          </TableRow>
        </TableHead>

        <TableBody className="text-center">
          {pacient.map((row) => (
            <TableRow key={row.dni_paciente}>
              <TableCell>{row.dni_paciente}</TableCell>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.apellido}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.telefono}</TableCell>
              <TableCell>{row.obra_social}</TableCell>

              <TableCell>
                <IconButton
                  onClick={() => {
                    setSelectedClient(row);
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
                    setSelectedClient(row);
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

      {/* Modal de edición */}
    {isOpenEdit && selectedClient && (
      <Modal isOpen={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
        <PacientEditForm
          pacient={selectedClient}
          onSubmit={(updated) => {
            handleEdit(updated);
            setIsOpenEdit(false);
          }}
        />
      </Modal>
    )}

      {/* Modal de confirmación */}
    {isOpenDelete && selectedClient && (
        <ConfirmAction
          onConfirm={() => {
            handleDelete(selectedClient.id_paciente); // Llama a tu función de delete
            setIsOpenDelete(false); // Cierra el modal luego de confirmar
          }}
          onCancel={() => setIsOpenDelete(false)} // Cierra al cancelar
        />
    )}

    </TableContainer>
  </div>
);
}
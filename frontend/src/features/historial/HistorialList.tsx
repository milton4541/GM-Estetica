import { useState, Fragment, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Select, MenuItem, Button, Collapse, TextField, Alert
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Autocomplete } from '@mui/material';

import useTratamientos from '../tratamiento/hooks/useTratamientos';
import usePacients from '../paciente/hooks/usePacient';
import useHistorial from './hooks/useHistorial';
import type { PacientWithId } from '../paciente/types/pacient';
import type { TratamientoWithId } from '../tratamiento/types/tratamiento';
import { DocumentosPorHistorial } from './DocumentosPorHistorial';
import ModalRegistro from '../factura/FacturaModal';
import useFactura from '../factura/hooks/useFactura';
import LoadingSpinner from '../../components/LoadingSpinner';

export function HistorialTratamientos() {
  const { tratamientos } = useTratamientos();
  const { pacient } = usePacients();

  const [filterType, setFilterType] = useState<'paciente' | 'tratamiento' | ''>('');
  const [filterPaciente, setFilterPaciente] = useState<PacientWithId | null>(null);
  const [filterTratamiento, setFilterTratamiento] = useState<TratamientoWithId | null>(null);
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [showFacturaModal, setShowFacturaModal] = useState(false);
  const [facturaData, setFacturaData] = useState<{
    id_paciente: number;
    id_tratamiento: number;
    importe: number;
  } | null>(null);

  const { historial, loading, error, fetchByPaciente, fetchByTratamiento, fetchHistorial } = useHistorial();
  const { createFactura } = useFactura();

  useEffect(() => {
    if (filterType === 'paciente' && filterPaciente) {
      fetchByPaciente(filterPaciente.id_paciente);
    } else if (filterType === 'tratamiento' && filterTratamiento) {
      fetchByTratamiento(filterTratamiento.id_tratamiento);
    } else {
      fetchHistorial();
    }
  }, [filterType, filterPaciente, filterTratamiento, fetchByPaciente, fetchByTratamiento, fetchHistorial]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Historial de Tratamientos</h2>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* FILTROS */}
        <div className="flex gap-4 mb-6 items-end" aria-disabled={loading}>
          <Select
            value={filterType}
            displayEmpty
            onChange={e => {
              const ft = e.target.value;
              setFilterType(ft as 'paciente' | 'tratamiento' | '');
              setFilterPaciente(null);
              setFilterTratamiento(null);
            }}
            sx={{
              minWidth: 160,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#0a4682ff' },
              '& .MuiSvgIcon-root': { color: '#1976d2' },
              '& .MuiSelect-select': { color: '#1976d2' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
              '&.Mui-focused .MuiSvgIcon-root': { color: '#1976d2' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
            }}
            disabled={loading}
          >
            <MenuItem value="">— Mostrar todo —</MenuItem>
            <MenuItem value="paciente">Por Paciente</MenuItem>
            <MenuItem value="tratamiento">Por Tratamiento</MenuItem>
          </Select>

          {filterType === 'paciente' && (
            <Autocomplete
              options={pacient}
              getOptionLabel={p => `${p.nombre} ${p.apellido}`}
              value={filterPaciente}
              onChange={(_, newVal) => setFilterPaciente(newVal)}
              sx={{ width: 240 }}
              disabled={loading}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Selecciona paciente"
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#1976d2',
                    },
                  }}
                />
              )}
            />
          )}

          {filterType === 'tratamiento' && (
            <Autocomplete
              options={tratamientos}
              getOptionLabel={t => t.descripcion}
              value={filterTratamiento}
              onChange={(_, newVal) => setFilterTratamiento(newVal)}
              sx={{ width: 240 }}
              disabled={loading}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Selecciona tratamiento"
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#1976d2',
                    },
                  }}
                />
              )}
            />
          )}

          <Button
            onClick={() => {
              setFilterType('');
              setFilterPaciente(null);
              setFilterTratamiento(null);
            }}
            disabled={loading}
          >
            Limpiar filtro
          </Button>
        </div>

        {/* TABLA */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-50 uppercase">
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Paciente</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Tratamiento</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Documentos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historial.map(row => (
                <Fragment key={row.id_historial}>
                  <TableRow hover>
                    <TableCell sx={{ padding: '8px 16px' }}>
                      {row.paciente.nombre} {row.paciente.apellido}
                    </TableCell>
                    <TableCell sx={{ padding: '8px 16px' }}>
                      {row.tratamiento.descripcion}
                    </TableCell>
                    <TableCell sx={{ padding: '8px 16px' }}>
                      {new Date(row.created_at).toLocaleDateString('es-AR')}
                    </TableCell>
                    <TableCell sx={{ padding: '8px 16px' }}>
                      <div className="flex justify-center gap-1">
                        <IconButton
                          onClick={() =>
                            setOpenRow(openRow === row.id_historial ? null : row.id_historial)
                          }
                          className="text-gray-600 hover:text-gray-900 transition-all"
                        >
                          {openRow === row.id_historial ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setFacturaData({
                              id_paciente: row.paciente.id_paciente,
                              id_tratamiento: row.tratamiento.id_tratamiento,
                              importe: row.tratamiento.precio,
                            });
                            setShowFacturaModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-all"
                        >
                          <ReceiptIcon />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ padding: 0 }} colSpan={4}>
                      <Collapse in={openRow === row.id_historial} timeout="auto" unmountOnExit>
                        <div className="p-4">
                          <DocumentosPorHistorial historialId={row.id_historial} />
                        </div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {facturaData && (
        <ModalRegistro
          isOpen={showFacturaModal}
          onClose={() => setShowFacturaModal(false)}
          idPaciente={facturaData.id_paciente}
          idTratamiento={facturaData.id_tratamiento}
          importe={facturaData.importe}
          onSubmit={(data) => {
            createFactura(data);
          }}
        />
      )}
    </div>
  );
}

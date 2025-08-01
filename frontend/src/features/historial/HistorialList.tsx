import { useState, Fragment, useEffect } from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Select, MenuItem, Button, Collapse, TextField
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { Autocomplete } from '@mui/material'
import useTratamientos from '../tratamiento/hooks/useTratamientos'
import usePacients from '../paciente/hooks/usePacient'
import useHistorial from './hooks/useHistorial'
import type { PacientWithId } from '../paciente/types/pacient'
import type { TratamientoWithId } from '../tratamiento/types/tratamiento'
import { DocumentosPorHistorial } from './DocumentosPorHistorial'
import ModalRegistro from '../factura/FacturaModal';
import useFactura from '../factura/hooks/useFactura';

export function HistorialTratamientos() {
  const { tratamientos } = useTratamientos()
  const { pacient }      = usePacients()

  const [filterType, setFilterType] = useState<'paciente'|'tratamiento'|''>('')

  const [filterPaciente, setFilterPaciente]       = useState<PacientWithId|null>(null)
  const [filterTratamiento, setFilterTratamiento] = useState<TratamientoWithId|null>(null)
  const [openRow,setOpenRow] = useState<number|null>(null)
  const [showFacturaModal, setShowFacturaModal] = useState(false);
  const [facturaData, setFacturaData] = useState<{
    id_paciente: number;
    id_tratamiento: number;
    importe: number;
  } | null>(null);

  const { historial,fetchByPaciente,fetchByTratamiento,fetchHistorial} = useHistorial()
  const {createFactura} = useFactura()
  useEffect(() => {
  if (filterType === 'paciente' && filterPaciente) {
    fetchByPaciente(filterPaciente.id_paciente)
  }
  else if (filterType === 'tratamiento' && filterTratamiento) {
    fetchByTratamiento(filterTratamiento.id_tratamiento)
  }
  else {
    fetchHistorial()
  }
}, [filterType, filterPaciente, filterTratamiento])


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Historial de Tratamientos</h2>

      {/* FILTROS */}
      <div className="flex gap-4 mb-6 items-end">
        <Select
          value={filterType}
          displayEmpty
          onChange={e => {
            const ft = e.target.value
            setFilterType(ft)
            // Al cambiar de tipo, limpiamos ambos estados
            setFilterPaciente(null)
            setFilterTratamiento(null)
          }}
          sx={{ minWidth: 160 }}
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
            renderInput={params => <TextField {...params} label="Selecciona paciente" />}
          />
        )}

        {filterType === 'tratamiento' && (
          <Autocomplete
            options={tratamientos}
            getOptionLabel={t => t.descripcion}
            value={filterTratamiento}
            onChange={(_, newVal) => setFilterTratamiento(newVal)}
            sx={{ width: 240 }}
            renderInput={params => <TextField {...params} label="Selecciona tratamiento" />}
          />
        )}

        <Button
          onClick={() => {
            setFilterType('')
            setFilterPaciente(null)
            setFilterTratamiento(null)
          }}
        >
          Limpiar filtro
        </Button>
      </div>

      {/* TABLA */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="uppercase text-center">
              <TableCell sx={{ fontWeight: 'bold' }}>Paciente</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tratamiento</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Documentos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historial.map(row => (
              <Fragment key={row.id_historial}>
                <TableRow hover>
                  <TableCell>
                  {row.paciente.nombre} {row.paciente.apellido}
                  </TableCell>
                  <TableCell>
                    {row.tratamiento.descripcion}
                  </TableCell>
                  <TableCell>
                    {new Date(row.created_at).toLocaleDateString('es-AR')}
                  </TableCell>
                  <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <IconButton
                      onClick={() =>
                        setOpenRow(openRow === row.id_historial ? null : row.id_historial)
                      }
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
      {facturaData && (
      <ModalRegistro
        isOpen={showFacturaModal}
        onClose={() => setShowFacturaModal(false)}
        idPaciente={facturaData.id_paciente}
        idTratamiento={facturaData.id_tratamiento}
        importe={facturaData.importe}
        onSubmit={(data) => {
          createFactura(data)
        }}
      />
      )}

    </div>
  )
}

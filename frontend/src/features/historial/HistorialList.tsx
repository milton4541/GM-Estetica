import { useState, useEffect, Fragment } from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Select, MenuItem, Button, Collapse, TextField
} from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import { Autocomplete } from '@mui/material'
import { DocumentosPorHistorial } from './DocumentosPorHistorial'

export function HistorialTratamientos() {
  const [historial, setHistorial] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [tratamientos, setTratamientos] = useState([])

  const [filterType, setFilterType] = useState('')        // 'paciente' | 'tratamiento' | ''
  const [filterValue, setFilterValue] = useState(null)    // objeto paciente o tratamiento

  const [openRow, setOpenRow] = useState(null)            // id de historial expandido

  // Carga inicial
  useEffect(() => {
    fetch('/api/historial')
      .then(r => r.json())
      .then(data => setHistorial(data))

    fetch('/api/pacientes')
      .then(r => r.json())
      .then(data => setPacientes(data))

    fetch('/api/tratamientos')
      .then(r => r.json())
      .then(data => setTratamientos(data))
  }, [])

  // Filtro: si hay filterType y filterValue, lo aplicamos
  const filtered = historial.filter(item => {
    if (filterType === 'paciente') {
      return item.paciente.id_paciente === filterValue?.id_paciente
    }
    if (filterType === 'tratamiento') {
      return item.tratamiento.id_tratamiento === filterValue?.id_tratamiento
    }
    return true
  })

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Historial de Tratamientos</h2>

      {/* Controles de filtrado */}
      <div className="flex gap-4 mb-6 items-end">
        <Select
          value={filterType}
          displayEmpty
          onChange={e => {
            setFilterType(e.target.value)
            setFilterValue(null)
          }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">— Mostrar todo —</MenuItem>
          <MenuItem value="paciente">Por Paciente</MenuItem>
          <MenuItem value="tratamiento">Por Tratamiento</MenuItem>
        </Select>

        {filterType === 'paciente' && (
          <Autocomplete
            options={pacientes}
            getOptionLabel={p => `${p.nombre} ${p.apellido}`}
            value={filterValue}
            onChange={(e, newVal) => setFilterValue(newVal)}
            sx={{ width: 240 }}
            renderInput={params => <TextField {...params} label="Selecciona paciente" />}
          />
        )}

        {filterType === 'tratamiento' && (
          <Autocomplete
            options={tratamientos}
            getOptionLabel={t => t.nombre}
            value={filterValue}
            onChange={(e, newVal) => setFilterValue(newVal)}
            sx={{ width: 240 }}
            renderInput={params => <TextField {...params} label="Selecciona tratamiento" />}
          />
        )}

        <Button onClick={() => { setFilterType(''); setFilterValue(null) }}>
          Limpiar filtro
        </Button>
      </div>

      {/* Tabla principal */}
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
            {filtered.map(row => (
              <Fragment key={row.id}>
                <TableRow hover>
                  <TableCell>{`${row.paciente.nombre} ${row.paciente.apellido}`}</TableCell>
                  <TableCell>{row.tratamiento.nombre}</TableCell>
                  <TableCell>
                    {new Date(row.created_at).toLocaleDateString('es-AR')}
                  </TableCell>
                  <TableCell className="text-center">
                    <IconButton
                      onClick={() => setOpenRow(openRow === row.id ? null : row.id)}
                    >
                      {openRow === row.id ? <ExpandLess/> : <ExpandMore/>}
                    </IconButton>
                  </TableCell>
                </TableRow>

                {/* Fila expandible con lista de documentos */}
                <TableRow>
                  <TableCell style={{ padding: 0 }} colSpan={4}>
                    <Collapse in={openRow === row.id} timeout="auto" unmountOnExit>
                      <div className="p-4">
                        <DocumentosPorHistorial historialId={row.id} />
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
  )
}

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import useFactura from './hooks/useFactura';
import usePacients from '../paciente/hooks/usePacient';
import useTratamientos from '../tratamiento/hooks/useTratamientos';

export default function FacturaList() {
  const {factura} = useFactura()
  const {pacient} = usePacients()
  const {tratamientos} = useTratamientos()


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Facturas</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead className="text-center uppercase">
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Codigo Factura</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Importe</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Descuento Precio</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Descuento Porcentaje</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Importe Final</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Paciente</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tratamiento</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="text-center">
            {factura.map(row => {
              const pac = pacient.find(p => p.id_paciente === row.id_paciente)
              const trat = tratamientos.find(t => t.id_tratamiento === row.id_tratamiento)

              return (
                <TableRow key={row.factura_id}>
                  <TableCell>{row.factura_id}</TableCell>
                  <TableCell>{row.importe}</TableCell>
                  <TableCell>${row.descuento_precio}</TableCell>
                  <TableCell>{row.descuento_porcentaje}%</TableCell>
                  <TableCell>{row.importe_final}</TableCell>

                  <TableCell>
                    {pac ? `${pac.nombre} ${pac.apellido}` : '—'}
                  </TableCell>

                  <TableCell>
                    {trat ? trat.descripcion : '—'}
                  </TableCell>

                  <TableCell>
                    {new Date(row.created_at).toLocaleDateString('es-AR')}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>

        </Table>
      </TableContainer>
    </div>
  );
}

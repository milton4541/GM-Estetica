import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import useFactura from './hooks/useFactura';
import usePacients from '../paciente/hooks/usePacient';
import useTratamientos from '../tratamiento/hooks/useTratamientos';

export default function FacturaList() {
  const { factura } = useFactura();
  const { pacient } = usePacients();
  const { tratamientos } = useTratamientos();

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Lista de Facturas</h2>

        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-50 uppercase">
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Codigo Factura</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Importe</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Descuento Precio</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Descuento Porcentaje</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Importe Final</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Paciente</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Tratamiento</TableCell>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {factura.map(row => {
                const pac = pacient.find(p => p.id_paciente === row.id_paciente);
                const trat = tratamientos.find(t => t.id_tratamiento === row.id_tratamiento);

                return (
                  <TableRow key={row.factura_id}>
                    <TableCell sx={{ padding: '8px 16px' }}>{row.factura_id}</TableCell>
                    <TableCell sx={{ padding: '8px 16px' }}>{row.importe}</TableCell>
                    <TableCell sx={{ padding: '8px 16px' }}>${row.descuento_precio}</TableCell>
                    <TableCell sx={{ padding: '8px 16px' }}>{row.descuento_porcentaje}%</TableCell>
                    <TableCell sx={{ padding: '8px 16px' }}>{row.importe_final}</TableCell>

                    <TableCell sx={{ padding: '8px 16px' }}>
                      {pac ? `${pac.nombre} ${pac.apellido}` : '—'}
                    </TableCell>

                    <TableCell sx={{ padding: '8px 16px' }}>
                      {trat ? trat.descripcion : '—'}
                    </TableCell>

                    <TableCell sx={{ padding: '8px 16px' }}>
                      {new Date(row.created_at).toLocaleDateString('es-AR')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
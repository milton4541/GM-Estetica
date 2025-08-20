import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { FacturaWithRelations } from './types/Factura';
import { getFacturas } from './api/getFacturas';

export default function FacturaList() {
  const [facturas, setFacturas] = useState<FacturaWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await getFacturas();
        setFacturas(response); // response debe venir con paciente y tratamiento anidados
      } catch (error) {
        console.error('Error cargando facturas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Lista de Facturas</h2>

        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-50 uppercase">
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Código Factura</TableCell>
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
              {facturas.map((row) => (
                <TableRow key={row.factura_id}>
                  <TableCell sx={{ padding: '8px 16px' }}>{row.factura_id}</TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>{row.importe}</TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>${row.descuento_precio}</TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>{row.descuento_porcentaje}%</TableCell>
                  <TableCell sx={{ padding: '8px 16px' }}>{row.importe_final}</TableCell>

                  <TableCell sx={{ padding: '8px 16px' }}>
                    {row.paciente ? `${row.paciente.nombre} ${row.paciente.apellido}` : '—'}
                  </TableCell>

                  <TableCell sx={{ padding: '8px 16px' }}>
                    {row.tratamiento ? row.tratamiento.descripcion : '—'}
                  </TableCell>

                  <TableCell sx={{ padding: '8px 16px' }}>
                    {new Date(row.created_at).toLocaleDateString('es-AR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

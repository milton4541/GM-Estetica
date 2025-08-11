import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './features/usuarios/PrivateRoute';
import RequireRole from './features/usuarios/RequireRoile';
import { ROLES } from './features/usuarios/roles';

import Layout from './layout/layout';
import Login from './features/login/login';
import CalendarPage from './features/turno/calendar';
import { HistorialTratamientos } from './features/historial/HistorialList';
import PacienteList from './features/paciente/PacienteList';
import InsumoList from './features/insumo/InsumosList';
import TratamientoList from './features/tratamiento/TratamientosList';
import FacturaList from './features/factura/FacturaList';
import ReportesView from './features/reportes/ReportList';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<CalendarPage />} />

        <Route
          path="historial"
          element={
            <RequireRole roles={[ROLES.ADMIN, ROLES.SECRETARIO]}>
              <HistorialTratamientos />
            </RequireRole>
          }
        />

        <Route path="pacientes" element={<PacienteList />} />
        <Route path="insumos" element={<InsumoList />} />
        <Route path="tratamientos" element={<TratamientoList />} />

        <Route
          path="facturas"
          element={
            <RequireRole roles={[ROLES.ADMIN]}>
              <FacturaList />
            </RequireRole>
          }
        />

        <Route
          path="reportes"
          element={
            <RequireRole roles={[ROLES.ADMIN]}>
              <ReportesView />
            </RequireRole>
          }
        />
      </Route>

      <Route path="/403" element={<div>No tenés permisos (403)</div>} />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

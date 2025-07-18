import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/login/login";
import Notification from "./components/notification";
import Layout from "./layout/layout";
import PrivateRoute from "./utils/PrivateRoute";
import PacienteList from "./features/paciente/PacienteList";
import InsumosList from "./features/insumo/InsumosList";
import TratamientoList from "./features/tratamiento/TratamientosList";
import CalendarPage from "./features/turno/calendar";
import { HistorialTratamientos } from "./features/historial/HistorialList";
export default function AppRouter() {
    return (
<BrowserRouter>
      <Notification />

      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Rutas protegidas */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<CalendarPage />} />
          <Route path="/historial" element={<HistorialTratamientos />} />
          <Route path="/pacientes" element={<PacienteList />} />
          <Route path="/insumos" element={<InsumosList />} />
          <Route path="/tratamientos" element={<TratamientoList />} />

        </Route>
      </Routes>
    </BrowserRouter>
    );
}
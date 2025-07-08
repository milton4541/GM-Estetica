import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/login/login";
import Notification from "./components/notification";
import Layout from "./layout/layout";
import Turno from "./features/turnos/Turno";
import PrivateRoute from "./utils/PrivateRoute";
import PacienteList from "./features/paciente/PacienteList";
import InsumosList from "./features/insumo/InsumosList";
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
          <Route path="/" element={<Turno />} />
          <Route path="/pacientes" element={<PacienteList />} />
          <Route path="/insumos" element={<InsumosList />} />

        </Route>
      </Routes>
    </BrowserRouter>
    );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/login/login";
import Notification from "./components/notification";
import Paciente from "./features/paciente/PacienteList";
import Layout from "./layout/layout";
import Turno from "./features/turnos/Turno";
import PrivateRoute from "./utils/PrivateRoute";
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
          <Route path="/pacientes" element={<Paciente />} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/login/login";
import Notification from "./components/notification";
import Layout from "./layout/layout";
import Turno from "./features/turnos/Turno";
import PrivateRoute from "./utils/PrivateRoute";
import PacienteList from "./features/paciente/PacienteList";
export default function AppRouter() {
    return (
<BrowserRouter>
      <Notification />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/r" element={<PacienteList />} />
        {/* Rutas protegidas */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Turno />} />
                  <Route path="/b" element={<PacienteList />} />
          <Route path="/pacientes" element={<PacienteList />} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
}
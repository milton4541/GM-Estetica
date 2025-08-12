import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Options from "../components/options";
import Modal from "../components/modal"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarPlus, faUserInjured, faBoxOpen, faHandHoldingMedical,
  faHistory, faChartBar, faFileInvoiceDollar, faUser, faClose,
} from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../features/usuarios/roles";
import RoleGate from "../features/usuarios/RoleGate";
import api from "../utils/axios";

export default function Layout() {
  const [loading, setLoading] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false); // ⬅️ estado del modal
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await api.post("/logout", null, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (_) {
      // opcional: toast
    } finally {
      localStorage.removeItem("authToken");
      navigate("/login", { replace: true });
      setLoading(false);
    }
  };

  return (
    <div className="font-sans antialiased min-h-screen bg-gray-50 flex">
      <aside className="w-64 min-h-screen text-white p-6 overflow-y-auto shadow-xl sidebar-bg">
        <h1 className="text-2xl font-bold mb-6 text-shadow-sm">Sistema de Gestión</h1>
        <nav className="space-y-0.5">
          <Link to="/" className="rounded-lg hover:bg-blue-900 transition-colors block">
            <Options icon={<FontAwesomeIcon icon={faCalendarPlus} size="lg" />} label="Turnos" />
          </Link>
          <Link to="/pacientes" className="rounded-lg hover:bg-blue-900 transition-colors block">
            <Options icon={<FontAwesomeIcon icon={faUserInjured} size="lg" />} label="Pacientes" />
          </Link>
          <Link to="/insumos" className="rounded-lg hover:bg-blue-900 transition-colors block">
            <Options icon={<FontAwesomeIcon icon={faBoxOpen} size="lg" />} label="Insumos" />
          </Link>
          <Link to="/tratamientos" className="rounded-lg hover:bg-blue-900 transition-colors block">
            <Options icon={<FontAwesomeIcon icon={faHandHoldingMedical} size="lg" />} label="Tratamientos" />
          </Link>

          <RoleGate roles={[ROLES.ADMIN, ROLES.SECRETARIO]}>
            <Link to="/historial" className="rounded-lg hover:bg-blue-900 transition-colors block">
              <Options icon={<FontAwesomeIcon icon={faHistory} size="lg" />} label="Historial" />
            </Link>
          </RoleGate>

          <RoleGate roles={[ROLES.ADMIN]}>
            <Link to="/facturas" className="rounded-lg hover:bg-blue-900 transition-colors block">
              <Options icon={<FontAwesomeIcon icon={faFileInvoiceDollar} size="lg" />} label="Facturas" />
            </Link>
          </RoleGate>

          <RoleGate roles={[ROLES.ADMIN]}>
            <Link to="/reportes" className="rounded-lg hover:bg-blue-900 transition-colors block">
              <Options icon={<FontAwesomeIcon icon={faChartBar} size="lg" />} label="Reportes" />
            </Link>
          </RoleGate>

          <RoleGate roles={[ROLES.ADMIN]}>
            <Link to="/usuarios" className="rounded-lg hover:bg-blue-900 transition-colors block">
              <Options icon={<FontAwesomeIcon icon={faUser} size="lg" />} label="Usuarios" />
            </Link>
          </RoleGate>

          {/* Botón que abre la confirmación */}
          <button
            onClick={() => setConfirmLogoutOpen(true)}
            disabled={loading}
            className="w-full rounded-lg hover:bg-blue-900 transition-colors block text-left disabled:opacity-60"
          >
            <Options
              icon={<FontAwesomeIcon icon={faClose} size="lg" />}
              label={loading ? "Cerrando sesión…" : "Cerrar Sesión"}
            />
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

      {/* Modal de confirmación */}
      <Modal isOpen={confirmLogoutOpen} onClose={() => !loading && setConfirmLogoutOpen(false)}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Confirmar cierre de sesión</h3>
          <p className="text-gray-600 mb-4">¿Seguro que querés cerrar sesión?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmLogoutOpen(false)}
              disabled={loading}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
            >
              {loading ? "Cerrando…" : "Cerrar sesión"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

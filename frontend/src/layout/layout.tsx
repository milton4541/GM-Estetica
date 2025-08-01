import { Outlet, Link } from "react-router-dom";
import Options from "../components/options";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarPlus,
  faUserInjured,
  faBoxOpen,
  faHandHoldingMedical,
  faHistory,
  faChartBar,
  faFileInvoiceDollar,
} from "@fortawesome/free-solid-svg-icons";

export default function Layout() {
  return (
    <div className="font-sans antialiased min-h-screen bg-gray-50 flex">
      {/* Barra lateral de navegación */}
      <aside className="w-64 border-r bg-white p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Sistema de Gestión</h1>
        <nav className="space-y-4">
          <div>
            <Link to="/" className="flex items-center">
              <Options
                icon={<FontAwesomeIcon icon={faCalendarPlus} size="lg" />}
                label="Turnos"
              />
            </Link>

            <Link to="/pacientes" className="flex items-center">
              <Options
                icon={<FontAwesomeIcon icon={faUserInjured} size="lg" />}
                label="Pacientes"
              />
            </Link>

            <Link to="/insumos" className="flex items-center">
              <Options
                icon={<FontAwesomeIcon icon={faBoxOpen} size="lg" />}
                label="Insumos"
              />
            </Link>

            <Link to="/tratamientos" className="flex items-center">
              <Options
                icon={<FontAwesomeIcon icon={faHandHoldingMedical} size="lg" />}
                label="Tratamientos"
              />
            </Link>

            <Link to="/historial" className="flex items-center">
              <Options
                icon={<FontAwesomeIcon icon={faHistory} size="lg" />}
                label="Historial"
              />
            </Link>

            <Link to="/facturas" className="flex items-center">
              <Options
                icon={<FontAwesomeIcon icon={faFileInvoiceDollar} size="lg" />}
                label="Facturas"
              />
            </Link>

            <Link to="/reportes" className="flex items-center">
              <Options
                icon={<FontAwesomeIcon icon={faChartBar} size="lg" />}
                label="Reportes"
              />
            </Link>
          </div>
        </nav>
      </aside>

      {/* Área principal de contenido */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

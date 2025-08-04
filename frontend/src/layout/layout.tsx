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
      <aside className="w-64 min-h-screen bg-blue-800 text-white p-6 overflow-y-auto shadow-xl">
        <h1 className="text-2xl font-bold mb-6">Sistema de Gestión</h1>
        <nav className="space-y-0.5">
          {/* Aquí los Links solo tienen las clases de estilo de borde y hover */}
          <Link
            to="/"
            className="rounded-lg hover:bg-blue-700 transition-colors block"
          >
            <Options
              icon={<FontAwesomeIcon icon={faCalendarPlus} size="lg" />}
              label="Turnos"
            />
          </Link>

          <Link
            to="/pacientes"
            className="rounded-lg hover:bg-blue-700 transition-colors block"
          >
            <Options
              icon={<FontAwesomeIcon icon={faUserInjured} size="lg" />}
              label="Pacientes"
            />
          </Link>

          <Link
            to="/insumos"
            className="rounded-lg hover:bg-blue-700 transition-colors block"
          >
            <Options
              icon={<FontAwesomeIcon icon={faBoxOpen} size="lg" />}
              label="Insumos"
            />
          </Link>

          <Link
            to="/tratamientos"
            className="rounded-lg hover:bg-blue-700 transition-colors block"
          >
            <Options
              icon={<FontAwesomeIcon icon={faHandHoldingMedical} size="lg" />}
              label="Tratamientos"
            />
          </Link>

          <Link
            to="/historial"
            className="rounded-lg hover:bg-blue-700 transition-colors block"
          >
            <Options
              icon={<FontAwesomeIcon icon={faHistory} size="lg" />}
              label="Historial"
            />
          </Link>

          <Link
            to="/facturas"
            className="rounded-lg hover:bg-blue-700 transition-colors block"
          >
            <Options
              icon={<FontAwesomeIcon icon={faFileInvoiceDollar} size="lg" />}
              label="Facturas"
            />
          </Link>

          <Link
            to="/reportes"
            className="rounded-lg hover:bg-blue-700 transition-colors block"
          >
            <Options
              icon={<FontAwesomeIcon icon={faChartBar} size="lg" />}
              label="Reportes"
            />
          </Link>
        </nav>
      </aside>

      {/* Área principal de contenido */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
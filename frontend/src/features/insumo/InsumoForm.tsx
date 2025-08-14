import { useForm } from "react-hook-form";
import type { Insumo } from "./types/insumo";
import { format } from "date-fns";
interface InsumoFormProps {
  onSubmit: (insumo: Insumo) => void;
}

// Define el tipo de datos que maneja el formulario (fecha como string)
type InsumoFormValues = Omit<Insumo, "fecha_expiracion"> & { fecha_expiracion: string };

const InsumoForm: React.FC<InsumoFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InsumoFormValues>();

  const onFormSubmit = (data: InsumoFormValues) => {
    const dateObj = new Date(data.fecha_expiracion);
    const fechaFormateada = format(dateObj, "dd/MM/yyyy"); // ej. "14/02/2025"
    const insumo: Insumo = {
      componentes: data.componentes,
      nombre: data.nombre,
      precio_insumo: Number(data.precio_insumo),
      cantidad: Number(data.cantidad),
      cantidad_min: Number(data.cantidad_min),
      fecha_expiracion: fechaFormateada,
    };
    onSubmit(insumo);
    reset();
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Agregar Insumo</h3>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="p-4 md:p-5">
        <div className="grid gap-4 mb-4 grid-cols-2">
          {/* Componentes */}
          <div>
            <label htmlFor="componentes" className="block mb-2 text-sm font-medium text-gray-900">
              Componentes
            </label>
            <input
              type="text"
              {...register("componentes", { required: "Componentes obligatorios" })}
              className={`bg-gray-50 border ${
                errors.componentes ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Lista de componentes"
            />
            {errors.componentes && <p className="text-red-500 text-sm mt-1">{errors.componentes.message}</p>}
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">
              Nombre
            </label>
            <input
              type="text"
              {...register("nombre", { required: "Nombre obligatorio" })}
              className={`bg-gray-50 border ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Nombre del insumo"
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="precio_insumo" className="block mb-2 text-sm font-medium text-gray-900">
              Precio
            </label>
            <input
              type="number"
              step="0.01"
              {...register("precio_insumo", {
                required: "Precio obligatorio",
                min: { value: 0, message: "Debe ser mayor o igual a 0" },
              })}
              className={`bg-gray-50 border ${
                errors.precio_insumo ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="0.00"
            />
            {errors.precio_insumo && <p className="text-red-500 text-sm mt-1">{errors.precio_insumo.message}</p>}
          </div>

          {/* Cantidad */}
          <div>
            <label htmlFor="cantidad" className="block mb-2 text-sm font-medium text-gray-900">
              Cantidad
            </label>
            <input
              type="number"
              {...register("cantidad", {
                required: "Cantidad obligatoria",
                min: { value: 0, message: "Debe ser mayor o igual a 0" },
              })}
              className={`bg-gray-50 border ${
                errors.cantidad ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="0"
            />
            {errors.cantidad && <p className="text-red-500 text-sm mt-1">{errors.cantidad.message}</p>}
          </div>

          {/* Cantidad Mínima */}
          <div>
            <label htmlFor="cantidad_min" className="block mb-2 text-sm font-medium text-gray-900">
              Cantidad Mínima
            </label>
            <input
              type="number"
              {...register("cantidad_min", {
                required: "Cantidad mínima obligatoria",
                min: { value: 0, message: "Debe ser mayor o igual a 0" },
              })}
              className={`bg-gray-50 border ${
                errors.cantidad_min ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="0"
            />
            {errors.cantidad_min && (
              <p className="text-red-500 text-sm mt-1">{errors.cantidad_min.message}</p>
            )}
          </div>

          {/* Fecha de Expiración */}
          <div>
            <label htmlFor="fecha_expiracion" className="block mb-2 text-sm font-medium text-gray-900">
              Fecha de Expiración
            </label>
            <input
              type="date"
              {...register("fecha_expiracion", { required: "Fecha obligatoria" })}
              className={`bg-gray-50 border ${
                errors.fecha_expiracion ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
            />
            {errors.fecha_expiracion && (
              <p className="text-red-500 text-sm mt-1">{errors.fecha_expiracion.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="text-white inline-flex items-center bg-[#15428c] hover:bg-[#123675] font-medium rounded-lg text-sm px-5 py-2.5"
        >
          <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Agregar Insumo
        </button>
      </form>
    </div>
  );
};

export default InsumoForm;
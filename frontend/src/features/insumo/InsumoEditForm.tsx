import { useForm } from "react-hook-form";
import type { insumoWithId } from "./types/insumo";
import { format } from "date-fns";

interface InsumoEditFormProps {
  insumo: insumoWithId;
  onSubmit: (updated: insumoWithId) => void;
}

type InsumoFormValues = Omit<insumoWithId, "fecha_expiracion"> & { fecha_expiracion: string };

const InsumoEditForm: React.FC<InsumoEditFormProps> = ({ insumo, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InsumoFormValues>({
    defaultValues: {
      ...insumo,
      // El input type="date" requiere formato YYYY-MM-DD para mostrar el valor
      fecha_expiracion: format(insumo.fecha_expiracion, "dd/MM/yyyy"),
    },
  });

  const onFormSubmit = (data: InsumoFormValues) => {
    // Convierte a dd/MM/yyyy si el backend lo espera
    const [yyyy, mm, dd] = data.fecha_expiracion.split("-");
    const fechaFormateada = `${dd}/${mm}/${yyyy}`;

    const updated: insumoWithId = {
      id_insumo: data.id_insumo,
      componentes: data.componentes,
      nombre: data.nombre,
      precio_insumo: Number(data.precio_insumo),
      cantidad: Number(data.cantidad),
      cantidad_min: Number(data.cantidad_min),
      // Envío la fecha formateada
      fecha_expiracion: fechaFormateada,
    };
    onSubmit(updated);
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Editar Insumo</h3>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="p-4 md:p-5">
        <input type="hidden" {...register("id_insumo")} />

        <div className="grid gap-4 mb-4 grid-cols-2">
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
            />
            {errors.componentes && <p className="text-red-500 text-sm mt-1">{errors.componentes.message}</p>}
          </div>

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
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
          </div>

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
            />
            {errors.precio_insumo && <p className="text-red-500 text-sm mt-1">{errors.precio_insumo.message}</p>}
          </div>

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
            />
            {errors.cantidad && <p className="text-red-500 text-sm mt-1">{errors.cantidad.message}</p>}
          </div>

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
            />
            {errors.cantidad_min && <p className="text-red-500 text-sm mt-1">{errors.cantidad_min.message}</p>}
          </div>

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
          className="text-white inline-flex items-center bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Actualizar Insumo
        </button>
      </form>
    </div>
  );
};

export default InsumoEditForm;

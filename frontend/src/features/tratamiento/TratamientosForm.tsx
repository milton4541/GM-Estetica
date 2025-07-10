import { useForm } from "react-hook-form";
import type { Tratamiento } from "./types/tratamiento";

interface TratamientoFormProps {
  onSubmit: (tratamiento: Tratamiento) => void;
}

type TratamientoFormValues = Tratamiento;

const TratamientoForm: React.FC<TratamientoFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TratamientoFormValues>();

  const onFormSubmit = (data: TratamientoFormValues) => {
    // convertir números en caso de ser strings
    const tratamiento: Tratamiento = {
      descripcion: data.descripcion,
      duracion: Number(data.duracion),
      precio: Number(data.precio),
    };
    onSubmit(tratamiento);
    reset();
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Agregar Tratamiento</h3>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="p-4 md:p-5">
        <div className="grid gap-4 mb-4 grid-cols-2">
          {/* Descripción */}
          <div className="col-span-2">
            <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-900">
              Descripción
            </label>
            <input
              type="text"
              {...register("descripcion", { required: "Descripción obligatoria" })}
              className={`bg-gray-50 border ${
                errors.descripcion ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Descripción del tratamiento"
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Duración */}
          <div>
            <label htmlFor="duracion" className="block mb-2 text-sm font-medium text-gray-900">
              Duración (min)
            </label>
            <input
              type="number"
              {...register("duracion", {
                required: "Duración obligatoria",
                min: { value: 1, message: "Debe ser al menos 1 minuto" },
              })}
              className={`bg-gray-50 border ${
                errors.duracion ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="0"
            />
            {errors.duracion && (
              <p className="text-red-500 text-sm mt-1">{errors.duracion.message}</p>
            )}
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="precio" className="block mb-2 text-sm font-medium text-gray-900">
              Precio ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("precio", {
                required: "Precio obligatorio",
                min: { value: 0, message: "Debe ser mayor o igual a 0" },
              })}
              className={`bg-gray-50 border ${
                errors.precio ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="0.00"
            />
            {errors.precio && (
              <p className="text-red-500 text-sm mt-1">{errors.precio.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Agregar Tratamiento
        </button>
      </form>
    </div>
  );
};

export default TratamientoForm;
